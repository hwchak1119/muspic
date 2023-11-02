"use client";

import { api } from "~/trpc/react";
import { RouterOutputs } from "~/trpc/shared";

type PostWithUser = RouterOutputs["post"]["getAll"][number];

const PostView = ({ post, author }: PostWithUser) => {
  return (
    <div>
      <h4>{author.username}</h4>
      <div>{post.content}</div>
    </div>
  );
};

export function PostList() {
  const { data, isLoading } = api.post.getAll.useQuery();

  if (isLoading) return <div>Loading...</div>;

  if (!data) return <div>You have no posts yet.</div>;

  return (
    <div className="w-full max-w-xs">
      {data?.map((fullPost) => (
        <PostView key={fullPost.post.id} {...fullPost} />
      ))}
    </div>
  );
}
