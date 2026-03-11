"use client";

import { PhotoGridProps } from "@/types/photo";

export default function PhotoGrid({photos, setSelectedPhoto, handleLike}: PhotoGridProps) {
  return (
    <div className="grid grid-cols-3 gap-2">
      {photos.map((photo) => (
        <div
          key={photo.id}
          className="relative group cursor-pointer"
          onClick={() => setSelectedPhoto(photo)}
        >
          <img src={photo.image_url} className="w-full h-40 object-cover" />

          {/* overlay */}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-end justify-left p-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleLike(photo.id);
              }}
              className="text-white text-md"
            >
              ❤️
            </button>
            <span className="px-2 text-white text-md">
              {photo.like_count || 0} likes
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
