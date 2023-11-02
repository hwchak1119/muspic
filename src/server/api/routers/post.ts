import { z } from "zod";
import { clerkClient } from "@clerk/nextjs";
import type { User } from "@clerk/nextjs/dist/types/server";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { TRPCError } from "@trpc/server";

const filterUserForClient = (user: User) => {
  return {
    id: user.id,
    username: user.username,
  };
};

export const postRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    const posts = await ctx.db.post.findMany({
      take: 100,
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

  // create: publicProcedure
  //   .input(z.object({ content: z.string().min(1) }))
  //   .mutation(async ({ ctx, input }) => {
  //     // simulate a slow db call
  //     await new Promise((resolve) => setTimeout(resolve, 1000));
  //     const authorId = ctx.userId;

  //     return ctx.db.post.create({
  //       data: {
  //         authorId,
  //         content: input.content,
  //       },
  //     });
  //   }),

  getLatest: publicProcedure.query(({ ctx }) => {
    return ctx.db.post.findFirst({
      orderBy: { createdAt: "desc" },
    });
  }),
});
