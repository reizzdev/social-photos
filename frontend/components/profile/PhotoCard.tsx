"use client";

// ESTO ES PARA EL PROFILE DONDE SE PUEDE CENSURAR O ELIMINAR FOTOS

import { api } from "@/services/api";

import { PhotoCardProps } from "@/types/photo";

export default function PhotoCard({
  photo,
  onDelete,
  onToggle,
}: PhotoCardProps) {
  const handleDelete = async () => {
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
      <div className="relative">
        <img src={photo.image_url} alt="" className="w-full rounded-lg" />

        {photo.censored && (
          <div className="absolute top-1 left-1 bg-red-600 text-white px-2 py-[2px] rounded text-xs font-bold">
            CENSURADA
          </div>
        )}
      </div>

      <div className="flex gap-2 mt-1">
        <button
          onClick={handleDelete}
          className="px-2 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
        >
          Eliminar
        </button>

        <button
          onClick={toggleCensor}
          className="px-2 py-1 text-sm bg-gray-700 text-white rounded hover:bg-gray-800"
        >
          {photo.censored ? "Quitar censura" : "Censurar"}
        </button>
      </div>
    </div>
  );
}
