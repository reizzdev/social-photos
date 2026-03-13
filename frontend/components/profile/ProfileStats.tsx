"use client";

import { ProfileStatsProps } from "@/types/ui";

export default function ProfileStats({ photos, followers, following, setShowFollowers, setShowFollowing }: ProfileStatsProps) {
  return (
    <div className="flex items-center gap-1 mb-6">

      <div className="flex items-baseline gap-1 px-4 py-2">
        <span className="text-sm font-semibold text-neutral-900 dark:text-white">{photos.length}</span>
        <span className="text-sm text-neutral-500 dark:text-neutral-400">fotos</span>
      </div>

      <div className="w-px h-4 bg-neutral-200 dark:bg-neutral-700" />

      <button
        onClick={() => setShowFollowers(true)}
        className="flex items-baseline gap-1 px-4 py-2 rounded-lg cursor-pointer"
      >
        <span className="text-sm font-semibold text-neutral-900 dark:text-white">{followers.length}</span>
        <span className="text-sm text-neutral-500 dark:text-neutral-400">seguidores</span>
      </button>

      <div className="w-px h-4 bg-neutral-200 dark:bg-neutral-700" />

      <button
        onClick={() => setShowFollowing(true)}
        className="flex items-baseline gap-1 px-4 py-2 rounded-lg cursor-pointer"
      >
        <span className="text-sm font-semibold text-neutral-900 dark:text-white">{following.length}</span>
        <span className="text-sm text-neutral-500 dark:text-neutral-400">siguiendo</span>
      </button>
    </div>
  );
}