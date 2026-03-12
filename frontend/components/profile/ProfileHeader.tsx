"use client";

// ESTO ES LA ESTRUCTURA DE LOS PERFILES FOTO, NOMBRE DE USUARIO Y EL BOTON DE (SEGUIR O DEJAR DE SEGUIR)

import { ProfileHeaderProps } from "@/types/user";

export default function ProfileHeader({user, me, isFollowing, handleFollow, handleUnfollow}: ProfileHeaderProps) {
  if (!user) return null;

  const following = isFollowing(user.id);

  return (
    <div className="flex items-center gap-6 mb-8">
      <img
        src={user.avatar_url || "/default-avatar.png"}
        className="w-24 h-24 rounded-full object-cover border"
      />
      <div>
        <h1 className="text-2xl font-bold">{user.username}</h1>

        {user.bio && (
          <p className="text-gray-500 mt-1">{user.bio}</p>
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