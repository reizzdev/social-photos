"use client";

import Link from "next/link";
import { FollowersListProps } from "@/types/user";

export default function FollowersList({
  title,
  users,
  onClose,
  isOwner,
  onRemoveFollower,
  onUnfollow,
}: FollowersListProps) {
  return (
    <div
      className="fixed inset-0 bg-black/60 flex justify-center items-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-2xl w-80 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-100 dark:border-neutral-800">
          <h2 className="text-sm font-medium text-neutral-900 dark:text-white">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-400 hover:text-neutral-600 transition text-sm"
          >
            ✕
          </button>
        </div>

        <div className="max-h-72 overflow-y-auto divide-y divide-neutral-100 dark:divide-neutral-800">
          {users.length === 0 ? (
            <p className="text-sm text-neutral-400 text-center py-8">
              Sin usuarios aún
            </p>
          ) : (
            users.map((u) => (
              <div
                key={u.id}
                className="flex items-center gap-3 px-5 py-3 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition"
              >
                <Link
                  href={`/${u.username}`}
                  onClick={onClose}
                  className="flex items-center gap-3 flex-1 min-w-0"
                >
                  <img
                    src={u.avatar_url || "/default-avatar.png"}
                    className="w-9 h-9 rounded-full object-cover border border-neutral-200 dark:border-neutral-700 flex-shrink-0"
                  />
                  <p className="text-sm font-medium text-neutral-900 dark:text-white truncate">
                    @{u.username}
                  </p>
                </Link>

                {/* Botón eliminar seguidor */}
                {isOwner && onRemoveFollower && (
                  <button
                    onClick={() => onRemoveFollower(u.id)}
                    className="text-xs text-neutral-400 hover:text-red-400 hover:bg-red-500/10 px-2.5 py-1 rounded-lg transition flex-shrink-0"
                  >
                    Eliminar
                  </button>
                )}

                {/* Botón dejar de seguir */}
                {isOwner && onUnfollow && (
                  <button
                    onClick={() => onUnfollow(u.id)}
                    className="text-xs text-neutral-400 hover:text-red-400 hover:bg-red-500/10 px-2.5 py-1 rounded-lg transition flex-shrink-0"
                  >
                    Dejar de seguir
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
