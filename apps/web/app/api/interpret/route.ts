import Anthropic from "@anthropic-ai/sdk"
import { NextResponse } from "next/server"

// Ported from Democracy.AI's server.js (ROUTE 3).
export async function POST(request: Request) {
  const apiKey = process.env.CLAUDE_API_KEY

  if (!apiKey) {
    return NextResponse.json(
      { error: "CLAUDE_API_KEY is not configured on the server." },
      { status: 500 },
    )
  }

  try {
    const { billText, billTitle } = await request.json()
    const anthropic = new Anthropic({ apiKey })

    const message = await anthropic.messages.create({
      model: "claude-sonnet-5",
      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content: `You are an expert policy analyst who explains federal legislation with transparency, objectivity, and ethical clarity. Your goal is to help citizens understand what bills actually do without political bias.

Bill Title: ${billTitle}

Bill Text: ${billText}

Please provide an ethical, transparent analysis:

1. **Plain Language Summary** (2-3 sentences explaining what this bill does in simple terms)

2. **Who This Affects** (specific groups of people, industries, or communities impacted)

3. **Key Provisions** (the main things this bill would change or create)

4. **Potential Impacts** (both intended benefits and possible concerns, presented objectively)

5. **Transparency Note** (any important context citizens should know, such as who sponsored it, if it's bipartisan, or if there are competing perspectives)

Be clear, accurate, and balanced. Help citizens make informed decisions.`,
        },
      ],
    })

    const firstBlock = message.content[0]
    const interpretation =
      firstBlock && firstBlock.type === "text" ? firstBlock.text : ""

    return NextResponse.json({ interpretation })
  } catch (error) {
    console.error("Error interpreting bill:", error)
    return NextResponse.json(
      {
        error: "Failed to interpret bill. Please try again.",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
