"use client";

import Link from "next/link";
import { FollowersListProps } from "@/types/user";

export default function FollowersList({ title, users, onClose }: FollowersListProps) {
  return (
    <div
      className="fixed inset-0 bg-black/60 flex justify-center items-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-2xl w-80 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-100 dark:border-neutral-800">
          <h2 className="text-sm font-medium text-neutral-900 dark:text-white">{title}</h2>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-400 hover:text-neutral-600 transition text-sm"
          >
            ✕
          </button>
        </div>

        {/* Lista */}
        <div className="max-h-72 overflow-y-auto divide-y divide-neutral-100 dark:divide-neutral-800">
          {users.length === 0 ? (
            <p className="text-sm text-neutral-400 text-center py-8">Sin usuarios aún</p>
          ) : (
            users.map((u) => (
              <Link
                key={u.id}
                href={`/${u.username}`}
                onClick={onClose}
                className="flex items-center gap-3 px-5 py-3 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition"
              >
                <img
                  src={u.avatar_url || "/default-avatar.png"}
                  className="w-9 h-9 rounded-full object-cover border border-neutral-200 dark:border-neutral-700"
                />
                <div>
                  <p className="text-sm font-medium text-neutral-900 dark:text-white">
                    @{u.username}
                  </p>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}