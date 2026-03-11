"use client";

import { PhotoModalProps } from "@/types/photo";

export default function PhotoModal({photo,onClose,handleLike,}: PhotoModalProps) {
  if (!photo) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-black/85 flex items-center justify-center z-50"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="max-w-[90vw]"
      >
        <img
          src={photo.image_url}
          className="max-h-[80vh] rounded-lg"
        />

        <div className="mt-2 flex justify-between text-white">

          <button
            onClick={() => handleLike(photo.id)}
            className="text-xl"
          >
            ❤️
          </button>

          <span>{photo?.like_count || 0} likes</span>

        </div>
      </div>
    </div>
  );
}