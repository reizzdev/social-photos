"use client";

import { useState } from "react";
import { api } from "@/services/api";

export default function UploadPhoto() {
  const [imageUrl, setImageUrl] = useState("");
  const [tags, setTags] = useState("");
  const [message, setMessage] = useState("");

  const handleUpload = async () => {
    try {
      const tagArray = tags
        .split(",")
        .map((t) => t.trim())
        .filter((t) => t !== "");

      await api.post("/photos", {
        image_url: imageUrl,
        tags: tagArray,
      });

      setImageUrl("");
      setTags("");
      setMessage("Foto subida 🔥");
    } catch (err) {
      console.error(err);
      setMessage("Error subiendo foto");
    }
  };

  return (
    <div style={{ marginTop: 40 }}>
      <h2>Subir foto</h2>

      <input
        type="text"
        placeholder="URL imagen"
        value={imageUrl}
        onChange={(e) => setImageUrl(e.target.value)}
        style={{ width: 400 }}
      />

      <br />
      
      <input
        type="text"
        placeholder="tags (perro, playa)"
        value={tags}
        onChange={(e) => setTags(e.target.value)}
        style={{ width: 400 }}
      />

      <br />

      <button onClick={handleUpload}>Subir foto</button>

      <p>{message}</p>
    </div>
  );
}
