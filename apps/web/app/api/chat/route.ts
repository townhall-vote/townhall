import { generateText } from "ai"
import { NextResponse } from "next/server"

interface ConversationMessage {
  role: "user" | "assistant"
  content: string
}

// Ported from Democracy.AI's server.js (ROUTE 4).
export async function POST(request: Request) {
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

    const messages = [
      ...conversationHistory.map((msg) => ({
        role: msg.role,
        content: msg.content,
      })),
      { role: "user" as const, content: userQuestion },
    ]

    const { text: response } = await generateText({
      model: "anthropic/claude-sonnet-5",
      maxOutputTokens: 1024,
      providerOptions: {
        gateway: {
          only: ["bedrock"],
        },
      },
      instructions: `You are a helpful policy expert answering questions about federal legislation.

Bill: ${billTitle}

Be concise, clear, and helpful. Focus on explaining the bill accurately and answering the user's specific question.`,
      messages,
    })

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
