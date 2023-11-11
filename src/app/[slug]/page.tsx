import { Metadata } from "next";
import { api } from "~/trpc/server";

export const metadata: Metadata = {
  title: "Profile",
};

export default async function ProfilePage() {
  const userProfile = await api.profile.getUserbyUsername.query({
    username: "hwchak1119",
  });

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
        {`I am ${userProfile.username}`}
      </div>
    </main>
  );
}
