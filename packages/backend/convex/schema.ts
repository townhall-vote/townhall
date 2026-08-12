import { defineSchema, defineTable } from "convex/server"
import { v } from "convex/values"

export default defineSchema({
  users: defineTable({
    clerkUserId: v.string(),
  }).index("by_clerkUserId", ["clerkUserId"]),

  bookmarks: defineTable({
    clerkUserId: v.string(),
    congress: v.number(),
    billType: v.string(),
    billNumber: v.string(),
    title: v.optional(v.string()),
  })
    .index("by_user", ["clerkUserId"])
    .index("by_user_and_bill", ["clerkUserId", "congress", "billType", "billNumber"]),
})

