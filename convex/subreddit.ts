import { ConvexError, v } from "convex/values"
import { mutation, query } from "./_generated/server"
import { getCurrentUserOrThrow } from "./users"

// this is how we will create a new subreddit
export const create = mutation({
	args: {
		name: v.string(),
		description: v.optional(v.string()),
		// authorId: v.id("users"),
	},
	handler: async (ctx, args) => {
		const user = await getCurrentUserOrThrow(ctx)
		const subreddit = await ctx.db.query("subreddit").collect()
		if (subreddit.some((s) => s.name === args.name)) {
			throw new ConvexError({ message: "Subreddit already exists." })
		}
		await ctx.db.insert("subreddit", {
			name: args.name,
			description: args.description,
			authorId: user._id,
		})
	},
})

// this is how we will query for a subreddit
export const get = query({
	args: { name: v.string() },
	handler: async (ctx, args) => {
		const subreddit = await ctx.db
			.query("subreddit")
			.filter((q) => q.eq(q.field("name"), args.name))
			.unique()

		// if (!subreddit) {
		// 	throw new ConvexError({ message: "Subreddit not found." })
		// }

		// Instead of throwing an error like above, we can return null if the subreddit is not found, so that we can just return the message "subreddit not found" in the UI, rather having to handle the error thrown.
		// This way, things can be simpler.
		if (!subreddit) return null

		return subreddit
	},
})
