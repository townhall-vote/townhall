import { mutation, query } from "./_generated/server"
import { v } from "convex/values"

// Returns the current user's bookmarks, or an empty list if signed out.
// Reactive: the /bills page re-renders automatically as bookmarks change.
export const list = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) return []

    return await ctx.db
      .query("bookmarks")
      .withIndex("by_user", (q) => q.eq("clerkUserId", identity.subject))
      .collect()
  },
})

// Adds a bookmark if one doesn't exist for this bill, or removes it if it
// does. Returns the resulting state so the caller can update its UI without
// waiting on the next reactive update.
export const toggle = mutation({
  args: {
    congress: v.number(),
    billType: v.string(),
    billNumber: v.string(),
    title: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) {
      throw new Error("Sign in to bookmark bills.")
    }

    const existing = await ctx.db
      .query("bookmarks")
      .withIndex("by_user_and_bill", (q) =>
        q
          .eq("clerkUserId", identity.subject)
          .eq("congress", args.congress)
          .eq("billType", args.billType)
          .eq("billNumber", args.billNumber),
      )
      .unique()

    if (existing) {
      await ctx.db.delete(existing._id)
      return { bookmarked: false }
    }

    await ctx.db.insert("bookmarks", {
      clerkUserId: identity.subject,
      congress: args.congress,
      billType: args.billType,
      billNumber: args.billNumber,
      title: args.title,
    })
    return { bookmarked: true }
  },
})
