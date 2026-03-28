"use client";

import { useRef, useEffect, useState } from "react";
import Link from "next/link";
import { PhotoGridProps } from "@/types/photo";
import { api } from "@/services/api";

export default function PhotoGrid({
  photos,
  currentUser,
  following,
  handleLike,
  setFollowing,
  handleFollow,
  setSelectedPhoto,
  setShowAuthModal,
  masonry = false,
  showUsername,
  showTags,
  onDelete,
  onToggleCensor,
}: PhotoGridProps & {
  onDelete?: (id: string) => void;
  onToggleCensor?: (id: string) => void;
}) {
  const gridRef = useRef<HTMLDivElement>(null);
  const [confirmingId, setConfirmingId] = useState<string | null>(null);

  const setMasonry = () => {
    const grid = gridRef.current;
    if (!grid) return;
    const rowHeight = 10;
    const rowGap = 20;
    const items = Array.from(grid.children) as HTMLElement[];
    items.forEach((item) => {
      const img = item.querySelector("img") as HTMLImageElement;
      if (!img) return;
      const span = Math.ceil(
        (img.getBoundingClientRect().height + rowGap) / (rowHeight + rowGap),
      );
      item.style.gridRowEnd = `span ${span}`;
    });
  };

  useEffect(() => {
    if (!masonry) return;
    const timeout = setTimeout(() => setMasonry(), 100);
    window.addEventListener("resize", setMasonry);
    return () => {
      clearTimeout(timeout);
      window.removeEventListener("resize", setMasonry);
    };
  }, [photos, masonry]);

  const handleFollowClick = async (userId: string) => {
    if (!handleFollow) return;
    await handleFollow(userId);
    setFollowing?.((prev: string[]) =>
      prev.includes(userId) ? prev : [...prev, userId],
    );
  };

  const handleDelete = async (photoId: string) => {
    if (confirmingId !== photoId) {
      setConfirmingId(photoId);
      setTimeout(() => setConfirmingId(null), 3000);
      return;
    }
    try {
      await api.delete(`/photos/${photoId}`);
      onDelete?.(photoId);
      setConfirmingId(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleCensor = async (photoId: string) => {
    try {
      await api.patch(`/photos/censor/${photoId}`);
      onToggleCensor?.(photoId);
    } catch (err) {
      console.error(err);
    }
  };

  if (photos.length === 0) {
    return (
      <p className="text-center text-neutral-400 text-sm mt-16">
        No hay fotos aún
      </p>
    );
  }

  return (
    <div
      ref={gridRef}
      style={
        masonry
          ? {
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
              gridAutoRows: 10,
              gap: 20,
            }
          : {
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 8,
            }
      }
    >
      {photos.map((photo) => {
        const authorId = photo.user_id ?? photo.users?.id;
        const isOwner = currentUser?.id === authorId;
        const followsUser = following?.includes(authorId) ?? false;
        
        const isGoalGated = photo.access_type === "goal" && !isOwner && !(photo.has_contributed && photo.collection_completed);
        const isFollowGated =
          (photo.censored || photo.access_type === "follow") &&
          !followsUser &&
          !isOwner &&
          !isGoalGated;
        const shouldBlur = isGoalGated || isFollowGated;

        return (
          <div key={photo.id}>
            <div
              className="relative group cursor-pointer overflow-hidden rounded-xl"
              onClick={() => {
                if (!shouldBlur) setSelectedPhoto(photo);
              }}
            >
              {/* Imagen */}
              <img
                src={photo.image_url}
                alt="foto"
                onLoad={masonry ? setMasonry : undefined}
                className={`w-full object-cover ${
                  shouldBlur ? "blur-xl brightness-50 scale-110" : ""
                } ${masonry ? "" : "aspect-square"}`}
              />

              {/* Hover overlay — like */}
              {!shouldBlur && (
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white text-lg font-semibold">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleLike(photo.id);
                    }}
                  >
                    ❤️
                  </button>
                  <span>{photo.like_count ?? 0}</span>
                </div>
              )}

              {/* Username badge */}
              {showUsername && !shouldBlur && (
                <Link
                  href={`/${photo.users?.username}`}
                  onClick={(e) => e.stopPropagation()}
                  className="absolute bottom-2 left-2 flex items-center gap-1.5 bg-black/60 hover:bg-black/80 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm transition z-20"
                >
                  {photo.users?.avatar_url && (
                    <img
                      src={photo.users.avatar_url}
                      className="w-4 h-4 rounded-full object-cover flex-shrink-0"
                    />
                  )}
                  <span>@{photo.users?.username}</span>
                </Link>
              )}

              {/* Tags */}
              {showTags &&
                photo.photo_tags &&
                photo.photo_tags.length > 0 &&
                !shouldBlur && (
                  <div className="absolute top-2 right-2 flex flex-wrap gap-1 justify-end z-20 opacity-0 group-hover:opacity-100 transition-opacity">
                    {photo.photo_tags.map((pt: any) => (
                      <Link
                        key={pt.tag_id}
                        href={`/tag/${pt.tags.name}`}
                        onClick={(e) => e.stopPropagation()}
                        className="text-[10px] bg-black/60 backdrop-blur-sm text-white px-2 py-0.5 rounded-full hover:bg-black/80 transition"
                      >
                        #{pt.tags.name}
                      </Link>
                    ))}
                  </div>
                )}

              {/* Blur overlay — follow */}
              {isFollowGated && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 z-10">
                  <div className="flex flex-col items-center gap-1.5">
                    <img
                      src={photo.users?.avatar_url || "/default-avatar.png"}
                      className="w-10 h-10 rounded-full object-cover border-2 border-white/30"
                    />
                    <p className="text-white text-xs font-medium">
                      @{photo.users?.username}
                    </p>
                  </div>
                  <p className="text-white/60 text-[10px] font-medium tracking-widest uppercase">
                    Contenido privado
                  </p>
                  {currentUser ? (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleFollowClick(authorId);
                      }}
                      className="bg-white text-neutral-900 text-xs font-medium px-4 py-2 rounded-full hover:bg-neutral-100 transition"
                    >
                      Seguir para ver
                    </button>
                  ) : (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowAuthModal?.(true);
                      }}
                      className="bg-white text-neutral-900 text-xs font-medium px-4 py-2 rounded-full hover:bg-neutral-100 transition"
                    >
                      Regístrate para ver
                    </button>
                  )}
                </div>
              )}

              {/* Blur overlay — meta */}
              {isGoalGated && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 z-10">
                  <div className="flex flex-col items-center gap-1.5">
                    <img
                      src={photo.users?.avatar_url || "/default-avatar.png"}
                      className="w-10 h-10 rounded-full object-cover border-2 border-white/30"
                    />
                    <p className="text-white text-xs font-medium">
                      @{photo.users?.username}
                    </p>
                  </div>
                  <p className="text-white/60 text-[10px] font-medium tracking-widest uppercase">
                    Contenido de meta
                  </p>
                  {photo.collection_id && (
                    <Link
                      href={`/${photo.users?.username}`}
                      onClick={(e) => e.stopPropagation()}
                      className="bg-violet-500 hover:bg-violet-600 text-white text-xs font-medium px-4 py-2 rounded-full transition"
                    >
                      🎯 Ver colección
                    </Link>
                  )}
                </div>
              )}
            </div>

            {/* Controles de owner debajo de la foto */}
            {isOwner && (onDelete || onToggleCensor) && (
              <div className="flex items-center gap-2 mt-2">
                {onToggleCensor && (
                  <button
                    onClick={() => handleToggleCensor(photo.id)}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition ${
                      photo.censored
                        ? "bg-red-500/10 text-red-500 border border-red-400/40 hover:bg-red-500/20"
                        : "bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700"
                    }`}
                  >
                    {photo.censored ? "Censurada" : "Censurar"}
                  </button>
                )}
                {onDelete && (
                  <button
                    onClick={() => handleDelete(photo.id)}
                    title={
                      confirmingId === photo.id ? "¿Confirmar?" : "Eliminar"
                    }
                    className={`w-8 h-8 flex items-center justify-center rounded-lg text-xs font-bold transition flex-shrink-0 ${
                      confirmingId === photo.id
                        ? "bg-red-500 text-white animate-pulse"
                        : "bg-neutral-100 dark:bg-neutral-800 text-neutral-400 hover:bg-red-500 hover:text-white"
                    }`}
                  >
                    {confirmingId === photo.id ? "?" : "✕"}
                  </button>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
