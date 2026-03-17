"use client";

import { PhotoModalProps } from "@/types/photo";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { api } from "@/services/api";

export default function PhotoModal({ photo, onClose, handleLike }: PhotoModalProps) {
  const [comments, setComments] = useState<any[]>([]);
  const [content, setContent] = useState("");
  const [currentUser, setCurrentUser] = useState<any>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!photo) return;

    const loadComments = async () => {
      try {
        const res = await api.get(`/comments/photo/${photo.id}`);
        setComments(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    const loadUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;
        const res = await api.get("/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCurrentUser(res.data);
      } catch (err) {}
    };

    loadComments();
    loadUser();
  }, [photo]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [comments]);

  if (!photo) return null;

  const handleComment = async () => {
    if (!content.trim()) return;
    try {
      const token = localStorage.getItem("token");
      const res = await api.post(
        `/comments/photo/${photo.id}`,
        { content },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setComments((prev) => [...prev, res.data]);
      setContent("");
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (commentId: string) => {
    try {
      const token = localStorage.getItem("token");
      await api.delete(`/comments/${commentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setComments((prev) => prev.filter((c) => c.id !== commentId));
    } catch (err) {
      console.error(err);
    }
  };

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
          <img src={photo.image_url} className="w-full h-full object-contain max-h-[90vh]" />
        </div>

        {/* Panel derecho */}
        <div className="md:w-72 flex flex-col border-t md:border-t-0 md:border-l border-neutral-800 flex-shrink-0">

          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-800">
            <Link href={`/${photo.users?.username}`} onClick={onClose} className="flex items-center gap-2 group">
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
            <button onClick={() => handleLike(photo.id)} className="text-xl hover:scale-110 transition-transform">
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

          {/* Comentarios */}
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
            {comments.length === 0 ? (
              <p className="text-xs text-neutral-600 text-center mt-4">
                Sin comentarios aún
              </p>
            ) : (
              comments.map((c) => (
                <div key={c.id} className="flex gap-2 group">
                  <img
                    src={c.users?.avatar_url || "/default-avatar.png"}
                    className="w-7 h-7 rounded-full object-cover flex-shrink-0 mt-0.5"
                  />
                  <div className="flex-1 min-w-0">
                    <span className="text-xs font-medium text-neutral-300">
                      @{c.users?.username}
                    </span>
                    <p className="text-xs text-neutral-400 break-words">{c.content}</p>
                  </div>
                  {currentUser?.id === c.users?.id && (
                    <button
                      onClick={() => handleDelete(c.id)}
                      className="text-neutral-700 hover:text-red-400 transition text-xs opacity-0 group-hover:opacity-100 flex-shrink-0"
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input comentario */}
          <div className="px-4 py-3 border-t border-neutral-800">
            {currentUser ? (
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Escribe un comentario..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleComment()}
                  className="flex-1 bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-1.5 text-xs text-white placeholder:text-neutral-600 focus:outline-none focus:border-violet-500 transition"
                />
                <button
                  onClick={handleComment}
                  disabled={!content.trim()}
                  className="px-3 py-1.5 bg-violet-500 hover:bg-violet-600 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs rounded-lg transition"
                >
                  Enviar
                </button>
              </div>
            ) : (
              <p className="text-xs text-neutral-600 text-center">
                <Link href="/login" className="text-violet-400 hover:underline">
                  Inicia sesión
                </Link>{" "}
                para comentar
              </p>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}