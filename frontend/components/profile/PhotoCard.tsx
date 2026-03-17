"use client";

import { useState, useEffect } from "react";
import { api } from "@/services/api";
import { PhotoCardProps } from "@/types/photo";

const ACCESS_OPTIONS = [
  { value: "public", label: "🌐 Pública" },
  { value: "follow", label: "👥 Follow" },
  { value: "goal", label: "🎯 Meta" },
];

export default function PhotoCard({ photo, onDelete, onToggle, onSelect }: PhotoCardProps) {
  const [confirming, setConfirming] = useState(false);
  const [accessType, setAccessType] = useState(photo.access_type || "public");
  const [collectionId, setCollectionId] = useState<string | null>(photo.collection_id || null);
  const [collections, setCollections] = useState<any[]>([]);
  const [showCollectionPicker, setShowCollectionPicker] = useState(false);

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await api.get("/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const cols = await api.get(`/collections/user/${res.data.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCollections(cols.data);
      } catch (err) {}
    };
    fetchCollections();
  }, []);

  const handleDelete = async () => {
    if (!confirming) {
      setConfirming(true);
      setTimeout(() => setConfirming(false), 3000);
      return;
    }
    try {
      await api.delete(`/photos/${photo.id}`);
      onDelete(photo.id);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAccessChange = async (newAccess: string) => {
    try {
      const token = localStorage.getItem("token");
      await api.patch(
        `/photos/${photo.id}/access`,
        { access_type: newAccess },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAccessType(newAccess);
      onToggle(photo.id);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCollectionChange = async (newCollectionId: string | null) => {
    try {
      const token = localStorage.getItem("token");
      await api.patch(
        `/photos/${photo.id}/collection`,
        { collection_id: newCollectionId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCollectionId(newCollectionId);
      setShowCollectionPicker(false);
    } catch (err: any) {
      alert(err?.response?.data?.message || "No se puede mover, hay aportantes");
    }
  };

  const currentCollection = collections.find((c) => c.id === collectionId);
  const availableOptions = collectionId
    ? ACCESS_OPTIONS
    : ACCESS_OPTIONS.filter((o) => o.value !== "goal");

  return (
    <div className="w-[200px]">
      {/* Imagen */}
      <div
        className="relative overflow-hidden rounded-xl cursor-pointer"
        onClick={() => onSelect?.(photo)}
      >
        <img src={photo.image_url} alt="" className="w-full object-cover" />
      </div>

      {/* Badge colección — clickeable */}
      <div className="relative mt-2">
        <button
          onClick={() => setShowCollectionPicker((v) => !v)}
          className={`w-full text-left px-2.5 py-1.5 rounded-lg text-[10px] border transition ${
            collectionId
              ? "border-violet-400/40 bg-violet-500/10 text-violet-400"
              : "border-neutral-200 dark:border-neutral-700 text-neutral-400"
          }`}
        >
          {collectionId
            ? `📁 ${currentCollection?.title || "En colección"}`
            : "📁 Sin colección"}
          <span className="float-right opacity-50">▾</span>
        </button>

        {/* Dropdown */}
        {showCollectionPicker && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-xl shadow-lg z-30 overflow-hidden">
            <button
              onClick={() => handleCollectionChange(null)}
              className="w-full text-left px-3 py-2 text-xs text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition"
            >
              Sin colección
            </button>
            {collections.map((c) => (
              <button
                key={c.id}
                onClick={() => handleCollectionChange(c.id)}
                disabled={c.current_amount > 0 && c.id !== collectionId}
                className={`w-full text-left px-3 py-2 text-xs transition ${
                  c.id === collectionId
                    ? "bg-violet-500/10 text-violet-400"
                    : c.current_amount > 0
                    ? "text-neutral-300 dark:text-neutral-600 cursor-not-allowed"
                    : "text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                }`}
              >
                {c.title}
                {c.current_amount > 0 && c.id !== collectionId && (
                  <span className="ml-1 opacity-50">(con aportantes)</span>
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Indicador de meta */}
      {accessType === "goal" && (
        <div className="mt-1 text-[10px] text-violet-400 text-center">
          🎯 Se desbloquea con la meta de su colección
        </div>
      )}

      {/* Selector de acceso */}
      <div className="flex gap-1 mt-2">
        {availableOptions.map((opt) => (
          <button
            key={opt.value}
            onClick={() => handleAccessChange(opt.value)}
            className={`flex-1 py-1 text-[10px] rounded-lg border transition ${
              accessType === opt.value
                ? "border-violet-400 bg-violet-500/10 text-violet-500 font-medium"
                : "border-neutral-200 dark:border-neutral-700 text-neutral-500 hover:border-neutral-400"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Eliminar */}
      <div className="flex mt-2">
        <button
          onClick={handleDelete}
          title={confirming ? "¿Confirmar?" : "Eliminar"}
          className={`w-full py-1.5 rounded-lg text-xs font-medium transition ${
            confirming
              ? "bg-red-500 text-white animate-pulse"
              : "bg-neutral-100 dark:bg-neutral-800 text-neutral-400 hover:bg-red-500 hover:text-white"
          }`}
        >
          {confirming ? "¿Eliminar?" : "✕ Eliminar"}
        </button>
      </div>
    </div>
  );
}