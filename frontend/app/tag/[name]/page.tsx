"use client";

import { useEffect, useState } from "react";
import { api } from "@/services/api";
import { useParams } from "next/navigation";

export default function TagPage() {
  const { name } = useParams();
  const [photos, setPhotos] = useState<any[]>([]);
  const [error, setError] = useState("");

  const fetchPhotos = async () => {
    try {
      const res = await api.get(`/photos/tag/${name}`);
      setPhotos(res.data);
    } catch (err) {
      console.error(err);
      setError("Error cargando fotos");
    }
  };

  useEffect(() => {
    if (name) fetchPhotos();
  }, [name]);

  if (error) return <p>{error}</p>;

  return (
    <div style={{ padding: 40 }}>
      <h1># {name}</h1>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 20 }}>
        {photos.map((photo) => (
          <div key={photo.id} style={{ width: 200 }}>
            <img
              src={photo.image_url}
              style={{ width: "100%", borderRadius: 8 }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}