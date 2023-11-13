"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

import { api } from "~/trpc/react";

export function CreatePost() {
  const [input, setInput] = useState<string>("");

  const router = useRouter();

  const { mutate: createPost, isLoading: isPosting } =
    api.post.create.useMutation({
      onSuccess: () => {
        setInput("");
        router.refresh();
      },
      onError: (e) => {
        const errorMessage = e.data?.zodError?.fieldErrors.content;
        if (errorMessage && errorMessage[0]) {
          toast.error(errorMessage[0]);
        } else {
          toast.error("Failed to post!");
        }
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
