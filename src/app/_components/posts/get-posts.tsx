import { api } from "~/trpc/server";
import type { RouterOutputs } from "~/trpc/shared";
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

export async function PostList() {
  const postList = await api.post.getAll.query();

  if (!postList) return <div>You have no posts yet.</div>;

  return (
    <div className="w-full max-w-xs">
      {postList?.map((fullPost) => (
        <PostView key={fullPost.post.id} {...fullPost} />
      ))}
    </div>
  );
}
