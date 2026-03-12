"use client";

import { useRef, useEffect, useState } from "react";
import Link from "next/link";
import { PhotoGridProps } from "@/types/photo";

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
}: PhotoGridProps) {
  const gridRef = useRef<HTMLDivElement>(null);
  const [openTags, setOpenTags] = useState<string | null>(null);

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
    setFollowing?.((prev: string[]) => [...prev, userId]);
  };

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
        const shouldBlur =
          showUsername && photo.censored && !followsUser && !isOwner;

        return (
          <div key={photo.id} className="photo-card">
            <div className="image-wrapper">
              <div
                className="relative group cursor-pointer"
                onClick={() => {
                  if (!shouldBlur) setSelectedPhoto(photo);
                }}
              >
                <img
                  src={photo.image_url}
                  alt="foto"
                  onLoad={masonry ? setMasonry : undefined}
                  className={`${shouldBlur ? "censored" : ""} ${
                    masonry ? "" : "w-full aspect-square object-cover"
                  }`}
                />

                {showUsername && (
                  <Link
                    href={`/${photo.users?.username}`}
                    onClick={(e) => e.stopPropagation()}
                    className="absolute bottom-2 left-2 bg-black/60 hover:bg-black/80 text-white text-sm px-3 py-1 rounded-full backdrop-blur-sm transition z-20"
                  >
                    @{photo.users?.username}
                  </Link>
                )}

                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2 text-white text-lg font-semibold">
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

                {shouldBlur && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/70 text-white">
                    {currentUser ? (
                      <button onClick={() => handleFollowClick(photo.user_id)}>
                        Seguir para ver
                      </button>
                    ) : (
                      <button onClick={() => setShowAuthModal?.(true)}>
                        Registrate para ver
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div
              className={`tags-overlay ${openTags === photo.id ? "show" : ""}`}
            >
              {photo.photo_tags?.map((pt: any) => (
                <Link
                  key={pt.tag_id}
                  href={`/tag/${pt.tags.name}`}
                  className="tag"
                >
                  #{pt.tags.name}
                </Link>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
