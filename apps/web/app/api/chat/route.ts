import Anthropic from "@anthropic-ai/sdk"
import { NextResponse } from "next/server"

interface ConversationMessage {
  role: "user" | "assistant"
  content: string
}

// Ported from Democracy.AI's server.js (ROUTE 4).
export async function POST(request: Request) {
  const apiKey = process.env.CLAUDE_API_KEY

  if (!apiKey) {
    return NextResponse.json(
      { error: "CLAUDE_API_KEY is not configured on the server." },
      { status: 500 },
    )
  }

  try {
    const {
      billTitle,
      userQuestion,
      conversationHistory = [],
    }: {
      billTitle: string
      billText: string
      userQuestion: string
      conversationHistory: ConversationMessage[]
    } = await request.json()

    const anthropic = new Anthropic({ apiKey })

    const messages = [
      ...conversationHistory.map((msg) => ({
        role: msg.role,
        content: msg.content,
      })),
      { role: "user" as const, content: userQuestion },
    ]

    const message = await anthropic.messages.create({
      model: "claude-sonnet-5",
      max_tokens: 1024,
      system: `You are a helpful policy expert answering questions about federal legislation.

Bill: ${billTitle}

Be concise, clear, and helpful. Focus on explaining the bill accurately and answering the user's specific question.`,
      messages,
    })

    const firstBlock = message.content[0]
    const response = firstBlock && firstBlock.type === "text" ? firstBlock.text : ""

    return NextResponse.json({ response })
  } catch (error) {
    console.error("Error in chat:", error)
    return NextResponse.json(
      {
        error: "Failed to process question. Please try again.",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
