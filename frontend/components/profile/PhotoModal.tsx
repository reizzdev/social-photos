"use client";

import { PhotoModalProps } from "@/types/photo";
import Link from "next/link";

export default function PhotoModal({ photo, onClose, handleLike }: PhotoModalProps) {
  if (!photo) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-neutral-950 border border-neutral-800 rounded-2xl overflow-hidden w-full max-w-4xl max-h-[90vh] flex flex-col md:flex-row"
      >
        {/* Imagen */}
        <div className="flex-1 bg-black flex items-center justify-center min-h-[300px]">
          <img
            src={photo.image_url}
            className="w-full h-full object-contain max-h-[90vh]"
          />
        </div>

        {/* Panel derecho */}
        <div className="md:w-72 flex flex-col border-t md:border-t-0 md:border-l border-neutral-800 flex-shrink-0">

          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-800">
            <Link
              href={`/${photo.users?.username}`}
              onClick={onClose}
              className="flex items-center gap-2 group"
            >
              <img
                src={photo.users?.avatar_url || "/default-avatar.png"}
                className="w-8 h-8 rounded-full object-cover border border-neutral-700"
              />
              <span className="text-sm font-medium text-white group-hover:underline">
                @{photo.users?.username}
              </span>
            </Link>
            <button
              onClick={onClose}
              className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-neutral-800 text-neutral-500 hover:text-white transition text-xs"
            >
              ✕
            </button>
          </div>

          {/* Likes */}
          <div className="flex items-center gap-2 px-4 py-3 border-b border-neutral-800">
            <button
              onClick={() => handleLike(photo.id)}
              className="text-xl hover:scale-110 transition-transform"
            >
              ❤️
            </button>
            <span className="text-sm text-neutral-300">
              {photo.like_count ?? 0} {photo.like_count === 1 ? "like" : "likes"}
            </span>
          </div>

          {/* Tags */}
          {photo.photo_tags && photo.photo_tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 px-4 py-3 border-b border-neutral-800">
              {photo.photo_tags.map((pt) => (
                <Link
                  key={pt.tag_id}
                  href={`/tag/${pt.tags.name}`}
                  onClick={onClose}
                  className="text-xs bg-violet-500/10 hover:bg-violet-500/20 text-violet-400 px-2.5 py-1 rounded-full transition"
                >
                  #{pt.tags.name}
                </Link>
              ))}
            </div>
          )}

          {/* Comentarios placeholder */}
          <div className="flex-1 flex items-center justify-center px-4 py-6">
            <p className="text-xs text-neutral-600 text-center">
              Los comentarios llegarán pronto
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}