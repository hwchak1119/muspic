"use client";

import { api } from "~/trpc/react";
import { RouterOutputs } from "~/trpc/shared";
import { Spinner } from "../Spinner";
import Link from "next/link";

type PostWithUser = RouterOutputs["post"]["getAll"][number];

const PostView = ({ post, author }: PostWithUser) => {
  return (
    <div>
      <Link href={`/@${author.username}`}>
        <h4>{author.username}</h4>
      </Link>
      <Link href={`/post/${post.id}`}>
        <div>{post.content}</div>
      </Link>
    </div>
  );
};

export function PostList() {
  const { data, isLoading } = api.post.getAll.useQuery();

  if (isLoading) return <Spinner />;

  if (!data) return <div>You have no posts yet.</div>;

  return (
    <div className="w-full max-w-xs">
      {data?.map((fullPost) => (
        <PostView key={fullPost.post.id} {...fullPost} />
      ))}
    </div>
  );
}
