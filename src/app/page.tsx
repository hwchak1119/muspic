import { CreatePost } from "~/app/_components/posts/create-post";

import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { PostList } from "./_components/posts/get-posts";

export default async function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
        <SignedIn>
          {/* Mount the UserButton component */}
          <UserButton />
        </SignedIn>
        <SignedOut>
          {/* Signed out users get sign in button */}
          <SignInButton />
        </SignedOut>
        <PostList />
        <CreatePost />
      </div>
    </main>
  );
}
