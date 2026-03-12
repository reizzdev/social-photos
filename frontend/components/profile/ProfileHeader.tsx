"use client";

import { useState } from "react";
import { ProfileHeaderProps } from "@/types/user";
import { api } from "@/services/api";

export default function ProfileHeader({ user, me, isFollowing, handleFollow, handleUnfollow }: ProfileHeaderProps) {
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
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAvatarPreview(avatarInput);
      setEditingAvatar(false);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex items-center gap-6 mb-8">
      <div className="relative">
        <img
          src={avatarPreview || "/default-avatar.png"}
          className="w-24 h-24 rounded-full object-cover border"
        />
        {isOwner && (
          <button
            onClick={() => setEditingAvatar(!editingAvatar)}
            className="absolute bottom-0 right-0 bg-gray-800 text-white text-xs px-2 py-1 rounded-full"
          >
            ✏️
          </button>
        )}
      </div>

      <div className="flex-1">
        <h1 className="text-2xl font-bold">{user.username}</h1>

        {user.bio && <p className="text-gray-500 mt-1">{user.bio}</p>}

        {editingAvatar && isOwner && (
          <div className="flex gap-2 mt-2">
            <input
              type="text"
              placeholder="URL de tu foto de perfil"
              value={avatarInput}
              onChange={(e) => setAvatarInput(e.target.value)}
              className="border rounded px-2 py-1 text-sm flex-1 text-black"
            />
            <button
              onClick={handleSaveAvatar}
              className="bg-green-600 text-white px-3 py-1 rounded text-sm"
            >
              Guardar
            </button>
            <button
              onClick={() => setEditingAvatar(false)}
              className="bg-gray-600 text-white px-3 py-1 rounded text-sm"
            >
              Cancelar
            </button>
          </div>
        )}

        {me && me.id !== user.id && (
          <div className="mt-3">
            {following ? (
              <button
                onClick={() => handleUnfollow(user.id)}
                className="bg-red-600 px-4 py-1 rounded"
              >
                Dejar de seguir
              </button>
            ) : (
              <button
                onClick={() => handleFollow(user.id)}
                className="bg-blue-500 text-white px-4 py-1 rounded"
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