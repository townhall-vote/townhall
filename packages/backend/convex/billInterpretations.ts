import { internalMutationGeneric, internalQueryGeneric } from "convex/server"
import { v } from "convex/values"

export const getByBillIdentifier = internalQueryGeneric({
  args: {
    billIdentifier: v.string(),
  },
  returns: v.union(
    v.null(),
    v.object({
      interpretation: v.string(),
      interpretationGeneratedAt: v.number(),
    })
  ),
  handler: async (ctx, { billIdentifier }) => {
    const bill = await ctx.db
      .query("bills")
      .withIndex("by_billIdentifier", (query) =>
        query.eq("billIdentifier", billIdentifier)
      )
      .first()

    if (!bill) {
      return null
    }

    return {
      interpretation: bill.interpretation,
      interpretationGeneratedAt: bill.interpretationGeneratedAt,
    }
  },
})

export const store = internalMutationGeneric({
  args: {
    billIdentifier: v.string(),
    interpretation: v.string(),
    interpretationGeneratedAt: v.number(),
  },
  returns: v.string(),
  handler: async (ctx, args) => {
    const existingBill = await ctx.db
      .query("bills")
      .withIndex("by_billIdentifier", (query) =>
        query.eq("billIdentifier", args.billIdentifier)
      )
      .first()

    if (existingBill) {
      return existingBill.interpretation
    }

    await ctx.db.insert("bills", args)
    return args.interpretation
  },
})
