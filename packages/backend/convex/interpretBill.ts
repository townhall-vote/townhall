import { generateText } from "ai"
import {
  actionGeneric,
  makeFunctionReference,
  type FunctionReference,
} from "convex/server"
import { v } from "convex/values"

type GetInterpretationArgs = {
  billIdentifier: string
}

type CachedInterpretation = {
  interpretation: string
  interpretationGeneratedAt: number
}

type StoreInterpretationArgs = GetInterpretationArgs & {
  interpretation: string
  interpretationGeneratedAt: number
}

const getByBillIdentifier = makeFunctionReference<
  "query",
  GetInterpretationArgs,
  CachedInterpretation | null
>("billInterpretations:getByBillIdentifier") as unknown as FunctionReference<
  "query",
  "internal",
  GetInterpretationArgs,
  CachedInterpretation | null
>

const storeInterpretation = makeFunctionReference<
  "mutation",
  StoreInterpretationArgs,
  string
>("billInterpretations:store") as unknown as FunctionReference<
  "mutation",
  "internal",
  StoreInterpretationArgs,
  string
>

export const interpret = actionGeneric({
  args: {
    billIdentifier: v.string(),
    billTitle: v.string(),
    billText: v.string(),
  },
  returns: v.string(),
  handler: async (ctx, { billIdentifier, billTitle, billText }) => {
    const cached = await ctx.runQuery(getByBillIdentifier, { billIdentifier })

    if (cached) {
      return cached.interpretation
    }

    const { text: interpretation } = await generateText({
      model: "anthropic/claude-sonnet-5",
      maxOutputTokens: 1024,
      providerOptions: {
        gateway: {
          only: ["bedrock"],
        },
      },
      prompt: `You are an expert policy analyst who explains federal legislation with transparency, objectivity, and ethical clarity. Your goal is to help citizens understand what bills actually do without political bias.

Bill Title: ${billTitle}

Bill Text: ${billText}

Please provide an ethical, transparent analysis:

1. **Plain Language Summary** (2-3 sentences explaining what this bill does in simple terms)

2. **Who This Affects** (specific groups of people, industries, or communities impacted)

3. **Key Provisions** (the main things this bill would change or create)

4. **Potential Impacts** (both intended benefits and possible concerns, presented objectively)

5. **Transparency Note** (any important context citizens should know, such as who sponsored it, if it's bipartisan, or if there are competing perspectives)

Be clear, accurate, and balanced. Help citizens make informed decisions.`,
    })

    return await ctx.runMutation(storeInterpretation, {
      billIdentifier,
      interpretation,
      interpretationGeneratedAt: Date.now(),
    })
  },
})
