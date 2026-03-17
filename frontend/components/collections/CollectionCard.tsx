"use client";

import Link from "next/link";
import { Collection } from "@/types/collection";

interface Props {
  collection: Collection;
  currentUser?: any;
  following?: string[];
  onDelete?: (id: string) => void;
  onTogglePrivacy?: (id: string) => void;
}

export default function CollectionCard({ collection, currentUser, following, onDelete, onTogglePrivacy }: Props) {
  const isOwner = currentUser?.id === collection.user_id;
  const hasGoal = collection.goal_amount > 0;
  const progress = hasGoal
    ? Math.min((collection.current_amount / collection.goal_amount) * 100, 100)
    : 0;

  const photos = collection.photos ?? [];

  return (
    <div className="border border-neutral-200 dark:border-neutral-800 rounded-2xl overflow-hidden">

      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-100 dark:border-neutral-800">
        <Link href={`/${collection.users?.username}`} className="flex items-center gap-2">
          <img
            src={collection.users?.avatar_url || "/default-avatar.png"}
            className="w-8 h-8 rounded-full object-cover border border-neutral-200 dark:border-neutral-700"
          />
          <span className="text-sm font-medium text-neutral-900 dark:text-white">
            @{collection.users?.username}
          </span>
        </Link>
        {isOwner && (
  <div className="flex items-center gap-2">
    {onTogglePrivacy && (
      <button
        onClick={() => onTogglePrivacy(collection.id)}
        className="text-xs text-neutral-400 hover:text-violet-400 transition"
      >
        {collection.is_private ? "🔒 Privada" : "🌐 Pública"}
      </button>
    )}
    {onDelete && (
      <button
        onClick={() => onDelete(collection.id)}
        className="text-xs text-neutral-400 hover:text-red-400 transition"
      >
        Eliminar
      </button>
    )}
  </div>
)}
      </div>

      {/* Descripción */}
      {collection.description && (
        <p className="px-4 py-2 text-sm text-neutral-600 dark:text-neutral-400">
          {collection.description}
        </p>
      )}

      {/* Fotos en masonry */}
      {photos.length > 0 && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
            gap: 4,
            padding: 4,
          }}
        >
          {photos.map((photo) => {
            const followsOwner = following?.includes(photo.user_id) ?? false;
            const isPhotoOwner = currentUser?.id === photo.user_id;
            const isFollowGated = photo.access_type === "follow" && !followsOwner && !isPhotoOwner;
            const isGoalGated = photo.access_type === "goal" && !collection.completed && !isPhotoOwner;

            return (
              <div key={photo.id} className="relative overflow-hidden rounded-lg aspect-square">
                <img
                  src={photo.image_url}
                  className={`w-full h-full object-cover ${
                    isFollowGated || isGoalGated ? "blur-xl brightness-50 scale-110" : ""
                  }`}
                />
                {isFollowGated && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-white text-xs font-medium">🔒 Seguir</span>
                  </div>
                )}
                {isGoalGated && (
  <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
    <span className="text-white text-xs font-medium">🎯 Meta pendiente</span>
    <span className="text-white/60 text-[10px]">
      {Math.round((collection.current_amount / collection.goal_amount) * 100)}% completado
    </span>
  </div>
)}
              </div>
            );
          })}
        </div>
      )}

      {/* Barra de progreso de meta */}
      {hasGoal && (
        <div className="px-4 py-3 border-t border-neutral-100 dark:border-neutral-800">
          <div className="flex justify-between text-xs text-neutral-500 mb-1.5">
            <span>{collection.current_amount} / {collection.goal_amount} monedapp</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="w-full h-1.5 bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-violet-500 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
          {collection.deadline_at && (
            <p className="text-xs text-neutral-400 mt-1.5">
              Vence: {new Date(collection.deadline_at).toLocaleString()}
            </p>
          )}
        </div>
      )}
    </div>
  );
}