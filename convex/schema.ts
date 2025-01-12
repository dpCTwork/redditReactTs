import { defineSchema, defineTable } from "convex/server"
import { v } from "convex/values"

export default defineSchema({
	users: defineTable({
		username: v.string(),
		externalId: v.string(),
	})
		.index("byExternalId", ["externalId"])
		.index("byUsername", ["username"]),
	subreddit: defineTable({
		name: v.string(),
		description: v.optional(v.string()),
		authorId: v.id("users"),
	}),

	//  Define a new table called `post` with the following fields:
	post: defineTable({
		subject: v.string(),
		body: v.string(),
		subreddit: v.id("subreddit"),
		authorId: v.id("users"),
		image: v.optional(v.id("_storage")),
	})
		.index("bySubreddit", ["subreddit"])
		.index("byAuthor", ["authorId"]),
})
