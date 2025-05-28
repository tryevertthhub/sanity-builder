"use client";

import { useSession, signOut } from "next-auth/react";

export default function AdminPage() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        You are not logged in.
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-950 text-white">
      <div className="bg-zinc-900 rounded-lg shadow-lg p-8 w-full max-w-md flex flex-col items-center">
        <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
        <div className="mb-6">
          <div className="text-lg font-medium">Email:</div>
          <div className="text-zinc-300">{session.user?.email}</div>
        </div>
        <button
          onClick={() => signOut({ callbackUrl: "/auth/signin" })}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded text-white font-semibold transition"
        >
          Log out
        </button>
      </div>
    </div>
  );
}
