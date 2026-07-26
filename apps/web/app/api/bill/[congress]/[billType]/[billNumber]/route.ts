import { NextResponse } from "next/server"

interface RouteParams {
  params: Promise<{
    congress: string
    billType: string
    billNumber: string
  }>
}

interface CongressTextFormat {
  type: string
  url: string
}

interface CongressTextVersion {
  type: string
  date: string
  formats: CongressTextFormat[]
}

// Ported from Democracy.AI's server.js (ROUTE 2).
// Fetches bill details, then layers on the latest summary and full-text
// links from Congress.gov's separate endpoints for those.
export async function GET(_request: Request, { params }: RouteParams) {
  const { congress, billType, billNumber } = await params
  const apiKey = process.env.CONGRESS_API_KEY

  if (!apiKey) {
    return NextResponse.json(
      { error: "CONGRESS_API_KEY is not configured on the server." },
      { status: 500 },
    )
  }

  try {
    const billResponse = await fetch(
      `https://api.congress.gov/v3/bill/${congress}/${billType}/${billNumber}?api_key=${apiKey}&format=json`,
    )

    if (!billResponse.ok) {
      throw new Error(`Congress.gov responded with ${billResponse.status}`)
    }

    const billJson = await billResponse.json()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const billData: any = billJson.bill

    try {
      const summaryResponse = await fetch(
        `https://api.congress.gov/v3/bill/${congress}/${billType}/${billNumber}/summaries?api_key=${apiKey}&format=json`,
      )

      if (summaryResponse.ok) {
        const summaryJson = await summaryResponse.json()
        if (summaryJson.summaries && summaryJson.summaries.length > 0) {
          billData.summary = { text: summaryJson.summaries[0].text }
        }
      }
    } catch (summaryError) {
      console.log("No summary available for this bill", summaryError)
    }

    try {
      const textResponse = await fetch(
        `https://api.congress.gov/v3/bill/${congress}/${billType}/${billNumber}/text?api_key=${apiKey}&format=json`,
      )

      if (textResponse.ok) {
        const textJson = await textResponse.json()
        const versions: CongressTextVersion[] = textJson.textVersions ?? []
        const latestText = versions[0]
        if (latestText) {
          billData.text = {
            version: latestText.type,
            date: latestText.date,
            formats: latestText.formats,
          }
        }
      }
    } catch (textError) {
      console.log("No text available for this bill", textError)
    }

    return NextResponse.json({ bill: billData })
  } catch (error) {
    console.error("Error fetching bill details:", error)
    return NextResponse.json(
      { error: "Failed to fetch bill details" },
      { status: 500 },
    )
  }
}
