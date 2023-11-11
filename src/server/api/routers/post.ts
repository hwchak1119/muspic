import { z } from "zod";
import { clerkClient } from "@clerk/nextjs";
import {
  createTRPCRouter,
  privateProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { filterUserForClient } from "~/server/helpers/filterUserForClient";

// Create a new ratelimiter, that allows 10 requests per 10 seconds
const limitDuration = "10 s";
const limitAmount = 3;
const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(limitAmount, limitDuration),
  analytics: true,
  /**
   * Optional prefix for the keys used in redis. This is useful if you want to share a redis
   * instance with other applications and want to avoid key collisions. The default prefix is
   * "@upstash/ratelimit"
   */
  prefix: "@upstash/ratelimit",
});

export const postRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    const posts = await ctx.db.post.findMany({
      take: 100,
      orderBy: [{ createdAt: "desc" }],
    });
    const userId = posts.map((post) => post.authorId);
    const users = (
      await clerkClient.users.getUserList({
        userId: userId,
        limit: 100,
      })
    ).map(filterUserForClient);

    return posts.map((post) => {
      {
        const author = users.find((user) => user.id === post.authorId);

        if (!author || !author.username)
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Author not found",
          });
        return { post, author };
      }
    });
  }),

  create: privateProcedure
    .input(
      z.object({
        content: z
          .string()
          .min(1, "You are posting nothing, what's wrong with you?")
          .max(
            280,
            "Why don't you just go to Medium and write a long article.",
          ),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const authorId = ctx.userId;

      const { success } = await ratelimit.limit(authorId);

      if (!success)
        throw new TRPCError({
          code: "TOO_MANY_REQUESTS",
          message: `You can only create ${limitAmount} posts in ${limitDuration}`,
        });

      const post = await ctx.db.post.create({
        data: {
          authorId,
          content: input.content,
        },
      });

      return post;
    }),

  getLatest: publicProcedure.query(({ ctx }) => {
    return ctx.db.post.findFirst({
      orderBy: { createdAt: "desc" },
    });
  }),
});
