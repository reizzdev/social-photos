"use client";

import { useState } from "react";
import { api } from "@/services/api";

export default function UploadPage() {

  const [imageUrl, setImageUrl] = useState("");
  const [tags, setTags] = useState("");
  const [message, setMessage] = useState("");

  const handleUpload = async () => {
    try {

      const tagArray = tags
        .split(",")
        .map(t => t.trim())
        .filter(t => t !== "");

      await api.post("/photos", {
        image_url: imageUrl,
        tags: tagArray
      });

      setMessage("Foto subida correctamente 🔥");
      setImageUrl("");
      setTags("");

    } catch (error) {
      console.error(error);
      setMessage("Error al subir foto");
    }
  };

  return (
    <div style={{ padding: 40 }}>
      <h1>Subir Foto</h1>

      <input
        type="text"
        placeholder="URL de la imagen"
        value={imageUrl}
        onChange={(e) => setImageUrl(e.target.value)}
        style={{ width: "400px" }}
      />

      <br /><br />

      <input
        type="text"
        placeholder="etiquetas (ej: perro, playa, verano)"
        value={tags}
        onChange={(e) => setTags(e.target.value)}
        style={{ width: "400px" }}
      />

      <br /><br />

      <button onClick={handleUpload}>
        Subir
      </button>

      <p>{message}</p>
    </div>
  );
}