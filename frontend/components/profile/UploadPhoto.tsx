"use client";

import { useState } from "react";
import { api } from "@/services/api";

export default function UploadPhoto() {
  const [imageUrl, setImageUrl] = useState("");
  const [tags, setTags] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!imageUrl.trim()) return;
    try {
      setLoading(true);
      const tagArray = tags
        .split(",")
        .map((t) => t.trim())
        .filter((t) => t !== "");

      await api.post("/photos", { image_url: imageUrl, tags: tagArray });

      setImageUrl("");
      setTags("");
      setIsError(false);
      setMessage("Foto subida exitosamente");
    } catch (err) {
      console.error(err);
      setIsError(true);
      setMessage("Error subiendo la foto");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-4 mt-6">
      
      {/* Preview de imagen */}
      <div className="flex gap-3 mb-3">
        <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center">
          {imageUrl.trim() ? (
            <img
              src={imageUrl}
              className="w-full h-full object-cover"
              onError={(e) => (e.currentTarget.style.display = "none")}
            />
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-neutral-400">
              <rect x="3" y="3" width="18" height="18" rx="2"/>
              <circle cx="8.5" cy="8.5" r="1.5"/>
              <path d="m21 15-5-5L5 21"/>
            </svg>
          )}
        </div>

        <div className="flex-1 flex flex-col gap-2">
          <input
            type="text"
            placeholder="URL de la imagen"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className="w-full px-3 py-2 text-sm rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 focus:outline-none focus:border-violet-400 transition text-neutral-900 dark:text-white placeholder:text-neutral-400"
          />
          <input
            type="text"
            placeholder="Tags: perro, playa, viaje..."
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="w-full px-3 py-2 text-sm rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 focus:outline-none focus:border-violet-400 transition text-neutral-900 dark:text-white placeholder:text-neutral-400"
          />
        </div>
      </div>

      {/* Tags preview */}
      {tags && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {tags.split(",").map((t, i) =>
            t.trim() ? (
              <span
                key={i}
                className="text-xs bg-violet-500/10 text-violet-500 px-2.5 py-0.5 rounded-full"
              >
                #{t.trim()}
              </span>
            ) : null
          )}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between gap-3">
        {message ? (
          <p className={`text-xs ${isError ? "text-red-500" : "text-green-500"}`}>
            {message}
          </p>
        ) : (
          <span />
        )}

        <button
          onClick={handleUpload}
          disabled={!imageUrl.trim() || loading}
          className="px-4 py-1.5 bg-violet-500 hover:bg-violet-600 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition flex-shrink-0"
        >
          {loading ? "Subiendo..." : "Publicar"}
        </button>
      </div>
    </div>
  );
}