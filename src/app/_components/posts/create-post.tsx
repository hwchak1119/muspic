"use client";

import { useState } from "react";

import { api } from "~/trpc/react";

export function CreatePost() {
  const [input, setInput] = useState<string>("");
  const getPosts = api.post.getAll.useQuery();

  const { mutate: createPost, isLoading: isPosting } =
    api.post.create.useMutation({
      onSuccess: () => {
        setInput("");
      },
      onSettled: () => {
        getPosts.refetch();
      },
    });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        createPost({ content: input });
      }}
      className="flex flex-col gap-2"
    >
      <input
        type="text"
        placeholder="Title"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="w-full rounded-full px-4 py-2 text-black"
      />
      <button
        type="submit"
        className="rounded-full bg-white/10 px-10 py-3 font-semibold transition hover:bg-white/20"
        disabled={isPosting}
      >
        {isPosting ? "Submitting..." : "Submit"}
      </button>
    </form>
  );
}
