"use client";

// ESTO ES PARA LA VISTA MODAL

import { PhotoModalProps } from "@/types/photo";
import Link from "next/link";

export default function PhotoModal({
  photo,
  onClose,
  handleLike,
}: PhotoModalProps) {
  if (!photo) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-black/90 flex items-center justify-center z-50"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="flex bg-black rounded-lg max-w-5xl w-full"
      >
        <Link
          href={`/${photo.users?.username}`}
          className="text-white text-lg font-semibold mb-3 hover:underline"
        >
          @{photo.users?.username}
        </Link>

        {/* imagen */}
        <div className="flex-1 flex items-center justify-center p-4">
          <img
            src={photo.image_url}
            className="max-h-[80vh] object-contain rounded"
          />
        </div>

        {/* panel derecho */}
        <div className="w-80 p-6 flex flex-col text-white border-l border-zinc-800">
          {/* tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {photo.photo_tags?.map((pt) => (
              <Link
                key={pt.tag_id}
                href={`/tag/${pt.tags.name}`}
                className="bg-zinc-800 px-2 py-1 rounded text-sm"
              >
                #{pt.tags.name}
              </Link>
            ))}
          </div>

          {/* likes */}
          <div className="flex items-center gap-2 mb-6">
            <button onClick={() => handleLike(photo.id)}>❤️</button>
            <span>{photo.like_count ?? 0}</span>
          </div>

          {/* comentarios placeholder */}
          <h3 className="text-lg font-semibold">Aquí irán los comentarios</h3>
        </div>
      </div>
    </div>
  );
}
