"use client";

import { useEffect, useState } from "react";
import { api } from "@/services/api";

export default function ProfilePage() {

  const [user, setUser] = useState<any>(null);
  const [photos, setPhotos] = useState<any[]>([]);
  const [followers, setFollowers] = useState<any[]>([]);
  const [following, setFollowing] = useState<any[]>([]);
  const [error, setError] = useState("");

  const [imageUrl, setImageUrl] = useState("");
  const [tags, setTags] = useState("");
  const [message, setMessage] = useState("");

  const fetchFollowers = async (userId: string) => {
    try {
      const f = await api.get(`/users/followers/${userId}`);
      setFollowers(f.data);

      const fg = await api.get(`/users/following/${userId}`);
      setFollowing(fg.data);

    } catch (err) {
      console.error(err);
    }
  };

  const fetchData = async () => {

    try {

      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token");

      const userRes = await api.get("/users/me", {
        headers: { Authorization: `Bearer ${token}` }
      });

      setUser(userRes.data);

      const photosRes = await api.get(`/photos/user/${userRes.data.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setPhotos(photosRes.data);

      fetchFollowers(userRes.data.id);

    } catch (err) {
      console.error(err);
      setError("No autorizado");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // =============================
  // SUBIR FOTO
  // =============================

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

      setImageUrl("");
      setTags("");
      setMessage("Foto subida 🔥");

      fetchData();

    } catch (err) {

      console.error(err);
      setMessage("Error subiendo foto");

    }

  };

  // =============================
  // BORRAR FOTO
  // =============================

  const handleDelete = async (photoId: string) => {

    try {

      const token = localStorage.getItem("token");

      await api.delete(`/photos/${photoId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setPhotos(prev => prev.filter(p => p.id !== photoId));

    } catch (err) {

      console.error(err);

    }

  };

  // =============================
  // CENSURAR
  // =============================

  const toggleCensor = async (photoId: string) => {

    try {

      await api.patch(`/photos/censor/${photoId}`);

      setPhotos(prev =>
        prev.map(p =>
          p.id === photoId ? { ...p, censored: !p.censored } : p
        )
      );

    } catch (err) {

      console.error(err);

    }

  };

  if (error) return <p>{error}</p>;
  if (!user) return <p>Cargando...</p>;

  return (
    <div style={{ padding: 40 }}>

      <h1>Perfil de {user.username}</h1>
      <p>{user.email}</p>
      <p>{user.bio || "Sin bio"}</p>

      {/* =====================
      SUBIR FOTO
      ===================== */}

      <div style={{ marginTop: 40 }}>

        <h2>Subir foto</h2>

        <input
          type="text"
          placeholder="URL imagen"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          style={{ width: 400 }}
        />

        <br /><br />

        <input
          type="text"
          placeholder="tags (perro, playa)"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          style={{ width: 400 }}
        />

        <br /><br />

        <button onClick={handleUpload}>
          Subir foto
        </button>

        <p>{message}</p>

      </div>

      {/* =====================
      FOTOS
      ===================== */}

      <h2 style={{ marginTop: 40 }}>Mis Fotos</h2>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 20
        }}
      >

        {photos.map(photo => (

          <div key={photo.id} style={{ width: 200 }}>

           <div style={{ position: "relative" }}>

  <img
    src={photo.image_url}
    alt=""
    style={{
      width: "100%",
      borderRadius: 8
    }}
  />

  {photo.censored && (
    <div
      style={{
        position: "absolute",
        top: 5,
        left: 5,
        background: "red",
        color: "white",
        padding: "3px 6px",
        borderRadius: 5,
        fontSize: 12,
        fontWeight: "bold"
      }}
    >
      CENSURADA
    </div>
  )}

</div>

            <div style={{ display: "flex", gap: 5 }}>

              <button
                onClick={() => handleDelete(photo.id)}
                style={{
                  background: "red",
                  color: "white",
                  border: "none",
                  padding: "5px 10px",
                  cursor: "pointer"
                }}
              >
                Eliminar
              </button>

              <button
                onClick={() => toggleCensor(photo.id)}
                style={{
                  background: "black",
                  color: "white",
                  border: "none",
                  padding: "5px 10px",
                  cursor: "pointer"
                }}
              >
                {photo.censored ? "Quitar censura" : "Censurar"}
              </button>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}