"use client";

import { useEffect, useState } from "react";
import { api } from "@/services/api";

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [photos, setPhotos] = useState<any[]>([]);
  const [followers, setFollowers] = useState<any[]>([]);
  const [following, setFollowing] = useState<any[]>([]);
  const [error, setError] = useState("");

  // Traer seguidores y siguiendo
  const fetchFollowers = async (userId: string) => {
    try {
      const f = await api.get(`/users/followers/${userId}`);
      setFollowers(f.data);

      const fg = await api.get(`/users/following/${userId}`);
      setFollowing(fg.data);
    } catch (err) {
      console.error("Error fetchFollowers:", err);
    }
  };

  // Traer datos del usuario logeado y sus fotos
  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token");

      const userRes = await api.get("/users/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(userRes.data);

      const photosRes = await api.get(`/photos/user/${userRes.data.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPhotos(photosRes.data);

      fetchFollowers(userRes.data.id);
    } catch (err) {
      console.error("Error fetchData:", err);
      setError("No autorizado o error cargando datos");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Seguir a otro usuario
  const handleFollow = async (targetId: string) => {
    try {
      const token = localStorage.getItem("token");
      await api.post(
        `/users/follow/${targetId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (user) fetchFollowers(user.id);
    } catch (err) {
      console.error("Error handleFollow:", err);
    }
  };

  // Dejar de seguir
  const handleUnfollow = async (targetId: string) => {
    try {
      const token = localStorage.getItem("token");
      await api.delete(`/users/unfollow/${targetId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (user) fetchFollowers(user.id);
    } catch (err) {
      console.error("Error handleUnfollow:", err);
    }
  };

  // Eliminar foto propia
  const handleDelete = async (photoId: string) => {
    try {
      const token = localStorage.getItem("token");
      await api.delete(`/photos/${photoId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPhotos((prev) => prev.filter((p) => p.id !== photoId));
    } catch (err) {
      console.error("Error handleDelete:", err);
      alert("No se pudo eliminar la foto");
    }
  };

  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!user) return <p>Cargando...</p>;

  return (
    <div style={{ padding: 40 }}>
      <h1>Perfil de {user.username}</h1>
      <p>Email: {user.email}</p>
      <p>Bio: {user.bio || "Sin bio"}</p>

      {/* Seguidores y siguiendo */}
      <div style={{ marginTop: 30 }}>
        <h3>Siguiendo</h3>
        {following.map((u) => (
          <div key={u.id}>
            {u.username}{" "}
            <button onClick={() => handleUnfollow(u.id)}>Dejar de seguir</button>
          </div>
        ))}

        <h3>Seguidores</h3>
        {followers.map((u) => (
          <div key={u.id}>
            {u.username}{" "}
            <button onClick={() => handleFollow(u.id)}>Seguir</button>
          </div>
        ))}
      </div>

      {/* Fotos del usuario */}
      <h2 style={{ marginTop: 40 }}>Mis Fotos</h2>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 20 }}>
        {photos.map((photo) => (
          <div key={photo.id} style={{ width: 200 }}>
            <img
              src={photo.image_url}
              alt="foto"
              style={{ width: "100%", borderRadius: 8 }}
            />
            <button
              onClick={() => handleDelete(photo.id)}
              style={{
                marginTop: 5,
                backgroundColor: "red",
                color: "white",
                border: "none",
                padding: "5px 10px",
                cursor: "pointer",
              }}
            >
              Eliminar
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}