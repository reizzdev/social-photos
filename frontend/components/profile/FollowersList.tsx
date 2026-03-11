"use client";

import { FollowersListProps } from "@/types/user";

export default function FollowersList({ title, users, onClose }: FollowersListProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-black w-80 rounded-lg p-4">
        <div className="flex justify-between mb-4">
          <h2 className="font-bold">{title}</h2>

          <button onClick={onClose}>✕</button>
        </div>

        <div className="space-y-2 max-h-64 overflow-y-auto">
          {users.map((u) => (
            <div key={u.id} className="flex items-center gap-3">
              <img
                src={u.avatar_url || "/default-avatar.png"}
                className="w-8 h-8 rounded-full"
              />

              <span>{u.username}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
