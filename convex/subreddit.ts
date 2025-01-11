import { ConvexError, v } from "convex/values"
import { mutation } from "./_generated/server"
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
