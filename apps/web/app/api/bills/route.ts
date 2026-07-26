import { NextResponse } from "next/server"

// Ported from Democracy.AI's server.js (ROUTE 1).
// Pulls recent bills sorted by most recently updated. The Congress.gov
// API key stays server-side here instead of living in client JS.
export async function GET() {
  const apiKey = process.env.CONGRESS_API_KEY

  if (!apiKey) {
    return NextResponse.json(
      { error: "CONGRESS_API_KEY is not configured on the server." },
      { status: 500 },
    )
  }

  try {
    const response = await fetch(
      `https://api.congress.gov/v3/bill?api_key=${apiKey}&limit=250&format=json&sort=updateDate+desc`,
    )

    if (!response.ok) {
      throw new Error(`Congress.gov responded with ${response.status}`)
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error fetching bills:", error)
    return NextResponse.json(
      { error: "Failed to fetch bills" },
      { status: 500 },
    )
  }
}
