"use client";

import { useState } from "react";
import { api } from "@/services/api";
import { PhotoCardProps } from "@/types/photo";

export default function PhotoCard({ photo, onDelete, onToggle }: PhotoCardProps) {
  const [confirming, setConfirming] = useState(false);

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

  const toggleCensor = async () => {
    try {
      await api.patch(`/photos/censor/${photo.id}`);
      onToggle(photo.id);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="w-[200px]">
      {/* Imagen sin ningún overlay */}
      <div className="relative overflow-hidden rounded-xl">
        <img
          src={photo.image_url}
          alt=""
          className="w-full object-cover"
        />
      </div>

      {/* Controles debajo de la imagen */}
      <div className="flex items-center gap-2 mt-2">
        {/* Botón censurar — ocupa todo el espacio */}
        <button
          onClick={toggleCensor}
          className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition ${
            photo.censored
              ? "bg-red-500/10 text-red-500 border border-red-400/40 hover:bg-red-500/20"
              : "bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700"
          }`}
        >
          {photo.censored ? "Censurada" : "Censurar"}
        </button>

        {/* Botón eliminar — solo ícono X */}
        <button
          onClick={handleDelete}
          title={confirming ? "¿Confirmar?" : "Eliminar"}
          className={`w-8 h-8 flex items-center justify-center rounded-lg text-xs font-bold transition flex-shrink-0 ${
            confirming
              ? "bg-red-500 text-white animate-pulse"
              : "bg-neutral-100 dark:bg-neutral-800 text-neutral-400 hover:bg-red-500 hover:text-white"
          }`}
        >
          {confirming ? "?" : "✕"}
        </button>
      </div>
    </div>
  );
}