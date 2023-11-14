import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Post",
};

export default function SinglePostPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
        Post View
      </div>
    </main>
  );
}
