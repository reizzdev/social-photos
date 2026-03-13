"use client";

import { useState } from "react";
import { ProfileHeaderProps } from "@/types/user";
import { api } from "@/services/api";

export default function ProfileHeader({
  user,
  me,
  isFollowing,
  handleFollow,
  handleUnfollow,
}: ProfileHeaderProps) {
  if (!user) return null;

  const following = isFollowing(user.id);
  const isOwner = me?.id === user.id;

  const [editingAvatar, setEditingAvatar] = useState(false);
  const [avatarInput, setAvatarInput] = useState(user.avatar_url || "");
  const [avatarPreview, setAvatarPreview] = useState(user.avatar_url || "");

  const handleSaveAvatar = async () => {
    try {
      const token = localStorage.getItem("token");
      await api.patch(
        "/users/avatar",
        { avatar_url: avatarInput },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setAvatarPreview(avatarInput);
      setEditingAvatar(false);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex items-center gap-6 mb-8">
      {/* Avatar */}
      <div className="relative flex-shrink-0">
        <img
          src={avatarPreview || "/default-avatar.png"}
          className="w-24 h-24 rounded-full object-cover border-2 border-neutral-200 dark:border-neutral-700"
        />
        {isOwner && (
          <button
            onClick={() => setEditingAvatar(!editingAvatar)}
            className="absolute bottom-0 right-0 w-7 h-7 flex items-center justify-center bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-full border-2 border-white dark:border-neutral-900 hover:scale-110 transition text-xs"
          >
            ✏️
          </button>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <h1 className="text-xl font-medium text-neutral-900 dark:text-white truncate">
          @{user.username}
        </h1>

        {user.bio && (
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
            {user.bio}
          </p>
        )}

        {/* Editor de avatar */}
        {editingAvatar && isOwner && (
          <div className="flex gap-2 mt-3">
            <input
              type="text"
              placeholder="URL de tu foto de perfil"
              value={avatarInput}
              onChange={(e) => setAvatarInput(e.target.value)}
              className="flex-1 px-3 py-1.5 text-sm rounded-lg border border-neutral-300 dark:border-neutral-600 bg-transparent focus:outline-none focus:border-neutral-500"
            />
            <button
              onClick={handleSaveAvatar}
              className="px-3 py-1.5 bg-violet-500 hover:bg-violet-600 text-white text-sm rounded-lg transition"
            >
              Guardar
            </button>
            <button
              onClick={() => setEditingAvatar(false)}
              className="px-3 py-1.5 bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 text-sm rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-700 transition"
            >
              Cancelar
            </button>
          </div>
        )}

        {/* Botón follow/unfollow */}
        {me && me.id !== user.id && (
          <div className="mt-3">
            {following ? (
              <button
                onClick={() => handleUnfollow(user.id)}
                className="px-4 py-1.5 text-sm rounded-lg border border-neutral-300 dark:border-neutral-600 text-neutral-600 dark:text-neutral-300 hover:border-red-400 hover:text-red-400 transition"
              >
                Siguiendo
              </button>
            ) : (
              <button
                onClick={() => handleFollow(user.id)}
                className="px-4 py-1.5 text-sm rounded-lg bg-violet-500 hover:bg-violet-600 text-white transition"
              >
                Seguir
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
