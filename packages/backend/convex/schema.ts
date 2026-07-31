import { defineSchema, defineTable } from "convex/server"
import { v } from "convex/values"

export default defineSchema({
  users: defineTable({
    clerkUserId: v.string(),
  }).index("by_clerkUserId", ["clerkUserId"]),
  bills: defineTable({
    billIdentifier: v.string(),
    interpretation: v.string(),
    interpretationGeneratedAt: v.number(),
  }).index("by_billIdentifier", ["billIdentifier"]),
})
