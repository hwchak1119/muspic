import { CreatePost } from "~/app/_components/posts/create-post";

import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { PostList } from "./_components/posts/get-posts";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home",
};

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
        <SignedIn>
          <UserButton />
        </SignedIn>
        <SignedOut>
          <SignInButton />
        </SignedOut>
        <PostList />
        <CreatePost />
      </div>
    </main>
  );
}
