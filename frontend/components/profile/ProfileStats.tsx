"use client";

// ESTO ES LA BARRA DE DATOS DE LOS PERFILES OSEA fotos / seguidores / siguiendo

import { ProfileStatsProps } from "@/types/ui";

export default function ProfileStats({photos, followers, following, setShowFollowers, setShowFollowing}: ProfileStatsProps) {
  return (
    <div className="flex gap-6 mb-6 text-sm">
      <span>
        <b>{photos.length}</b> fotos
      </span>

      <span className="cursor-pointer" onClick={() => setShowFollowers(true)}>
        <b>{followers.length}</b> seguidores
      </span>

      <span className="cursor-pointer" onClick={() => setShowFollowing(true)}>
        <b>{following.length}</b> siguiendo
      </span>
    </div>
  );
}