"use client";
// import { api } from "~/trpc/server";
import { api } from "~/trpc/react";

export function PostList() {
  const { data, isLoading } = api.post.getAll.useQuery();

  if (isLoading) return <div>Loading...</div>;

  if (!data) return <div>You have no posts yet.</div>;

  return (
    <div className="w-full max-w-xs">
      {data?.map(({ post, author }) => <div key={post.id}>{post.content}</div>)}
    </div>
  );
}
