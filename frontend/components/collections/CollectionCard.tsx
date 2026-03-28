"use client";

import Link from "next/link";
import { useState } from "react";
import { Collection, Props } from "@/types/collection";
import { api } from "@/services/api";
import PhotoModal from "@/components/profile/PhotoModal";
import ContributeButton from "@/components/wallet/ContributeButton";

export default function CollectionCard({
  collection,
  currentUser,
  following,
  onFollow,
  onDelete,
  onTogglePrivacy,
}: Props) {
  const isOwner = currentUser?.id === collection.user_id;
  const hasGoal = collection.goal_amount > 0;
  const [currentAmount, setCurrentAmount] = useState(
    collection.current_amount ?? 0,
  );
  const [completed, setCompleted] = useState(collection.completed ?? false);
const [hasContributed, setHasContributed] = useState(collection.has_contributed ?? false);
  const progress = hasGoal
    ? Math.min((currentAmount / (collection.goal_amount ?? 1)) * 100, 100)
    : 0;

  const photos = collection.photos ?? [];
  const [selectedPhoto, setSelectedPhoto] = useState<any>(null);

  const handleFollow = async (userId: string) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      await api.post(
        `/users/follow/${userId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      onFollow?.(userId);
    } catch (err) {
      console.error(err);
    }
  };

  const handleLike = async (photoId: string) => {
    try {
      const token = localStorage.getItem("token");
      const res = await api.post(
        `/photos/like/${photoId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      if (selectedPhoto?.id === photoId) {
        setSelectedPhoto((prev: any) => ({
          ...prev,
          like_count: res.data.likes,
        }));
      }
    } catch (err) {
      console.error(err);
    }
  };

 const handleContribute = (newAmount: number) => {
  setCurrentAmount(newAmount);
  setHasContributed(true);
  if (newAmount >= (collection.goal_amount ?? 0)) {
    setCompleted(true);
  }
};

  return (
    <div className="border border-neutral-200 dark:border-neutral-800 rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-100 dark:border-neutral-800">
        <Link
          href={`/${collection.users?.username}`}
          className="flex items-center gap-2"
        >
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
            const followsOwner = (following ?? []).includes(photo.user_id);
            const isPhotoOwner = currentUser?.id === photo.user_id;
            const isFollowGated =
              photo.access_type === "follow" && !followsOwner && !isPhotoOwner;
            const isGoalGated = photo.access_type === "goal" && !(hasContributed && completed) && !isPhotoOwner;
            const isBlurred = isFollowGated || isGoalGated;

            return (
              <div
                key={photo.id}
                className="relative overflow-hidden rounded-lg aspect-square cursor-pointer group"
                onClick={() => {
                  if (!isBlurred) setSelectedPhoto(photo);
                }}
              >
                <img
                  src={photo.image_url}
                  className={`w-full h-full object-cover transition ${
                    isBlurred ? "blur-xl brightness-50 scale-110" : ""
                  }`}
                />

                {!isBlurred && (
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-1 text-white text-sm font-semibold">
                    ❤️ <span>{photo.like_count ?? 0}</span>
                  </div>
                )}

                {isFollowGated && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-2">
                    <span className="text-white text-[10px] font-medium tracking-widest uppercase">
                      Contenido privado
                    </span>
                    {currentUser ? (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleFollow(photo.user_id);
                        }}
                        className="bg-white text-neutral-900 text-[10px] font-medium px-3 py-1.5 rounded-full hover:bg-neutral-100 transition"
                      >
                        Seguir para ver
                      </button>
                    ) : (
                      <Link
                        href="/login"
                        onClick={(e) => e.stopPropagation()}
                        className="bg-white text-neutral-900 text-[10px] font-medium px-3 py-1.5 rounded-full hover:bg-neutral-100 transition"
                      >
                        Regístrate para ver
                      </Link>
                    )}
                  </div>
                )}

                {isGoalGated && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-2">
                    <span className="text-white text-xs font-medium">
                      🎯 Meta pendiente
                    </span>
                    <span className="text-white/60 text-[10px]">
                      {Math.round(
                        (currentAmount / (collection.goal_amount ?? 1)) * 100,
                      )}
                      % completado
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
            <span>
              {currentAmount} / {collection.goal_amount} fanblys
            </span>
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

      {/* Botón de aporte — solo si no es owner y hay meta */}
      {hasGoal && !isOwner && (
        <ContributeButton
          collectionId={collection.id}
          goalAmount={collection.goal_amount ?? 0}
          currentAmount={currentAmount}
          completed={completed}
          minContribution={collection.min_contribution ?? 2}
          onContribute={handleContribute}
        />
      )}

      {/* Modal */}
      {selectedPhoto && (
        <PhotoModal
          photo={selectedPhoto}
          onClose={() => setSelectedPhoto(null)}
          handleLike={handleLike}
        />
      )}
    </div>
  );
}
