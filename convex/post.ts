import { mutation, QueryCtx } from "./_generated/server"
import { ConvexError, v } from "convex/values"
import { getCurrentUserOrThrow } from "./users"
import { Doc, Id } from "./_generated/dataModel"

// We want to include the name or information about the author and/or the subreddit, not just the ID.
// Right now, we only have the ID of the author and the subreddit when we look at the post table defined in the schema.
type EnrichedPost = Omit<Doc<"post">, "subreddit"> & {
	author: { username: string } | undefined
	subreddit:
		| {
				_id: Id<"subreddit">
				name: string
		  }
		| undefined
	imageUrl?: string
}

const ERROR_MESSAGES = {
	POST_NOT_FOUND: "Post not found",
	SUBREDDIT_NOT_FOUND: "Subreddit not found",
	UNAUTHORIZED_DELETE: "You are not authorized to delete this post",
} as const

export const create = mutation({
	args: {
		subject: v.string(),
		body: v.string(),
		subreddit: v.id("subreddit"),
		storageId: v.optional(v.id("_storage")),
	},
	handler: async (ctx, args) => {
		const user = await getCurrentUserOrThrow(ctx)
		const postId = await ctx.db.insert("post", {
			subject: args.subject,
			body: args.body,
			subreddit: args.subreddit,
			authorId: user._id,
			image: args.storageId || undefined,
		})
		return postId
	},
})

async function getEnrichedPost(ctx: QueryCtx, post: Doc<"post">): Promise<EnrichedPost> {
	const [author, subreddit] = await Promise.all([ctx.db.get(post.authorId), ctx.db.get(post.subreddit)])
	const image = post.image && (await ctx.storage.getUrl(post.image))

	return {
		...post,
		author: author ? { username: author.username } : undefined,
		subreddit: {
			_id: subreddit!._id,
			name: subreddit!.name,
		},
		imageUrl: image ?? undefined,
	}
}
