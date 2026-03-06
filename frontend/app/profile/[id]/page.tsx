"use client";

import { useEffect, useState } from "react";
import { api } from "@/services/api";
import { useParams } from "next/navigation";

export default function UserProfilePage() {
  const { id } = useParams(); // id del usuario cuyo perfil estamos viendo
  const [user, setUser] = useState<any>(null);
  const [photos, setPhotos] = useState<any[]>([]);
  const [followers, setFollowers] = useState<any[]>([]);
  const [following, setFollowing] = useState<any[]>([]);
  const [me, setMe] = useState<any>(null); // usuario logeado
  const [error, setError] = useState("");

  // Traer seguidores y siguiendo del perfil que estamos viendo
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

  // Traer usuario logeado y perfil
  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token");

      // Usuario logeado
      const meRes = await api.get("/users/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMe(meRes.data);

      // Usuario del perfil
      const userRes = await api.get(`/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(userRes.data);

      // Fotos del perfil
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
  }, [id]);

  // Función para saber si "me" sigue al perfil
  const isFollowing = (targetId: string) => {
    if (!me) return false;
    return me.id !== targetId && followers.some(f => f.id === me.id);
  };

  // Seguir
  const handleFollow = async (targetId: string) => {
    try {
      const token = localStorage.getItem("token");
      await api.post(
        `/users/follow/${targetId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchFollowers(targetId);
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
      fetchFollowers(targetId);
    } catch (err) {
      console.error("Error handleUnfollow:", err);
    }
  };

  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!user || !me) return <p>Cargando...</p>;

  return (
    <div style={{ padding: 40 }}>
      <h1>Perfil de {user.username}</h1>
      <p>Email: {user.email}</p>
      <p>Bio: {user.bio || "Sin bio"}</p>

      {/* Botón seguir / dejar de seguir solo si no es tu propio perfil */}
      {user.id !== me.id && (
        <button
          onClick={() =>
            isFollowing(user.id)
              ? handleUnfollow(user.id)
              : handleFollow(user.id)
          }
          style={{
            margin: "10px 0",
            padding: "5px 15px",
            backgroundColor: isFollowing(user.id) ? "red" : "green",
            color: "white",
            border: "none",
            borderRadius: 5,
            cursor: "pointer",
          }}
        >
          {isFollowing(user.id) ? "Dejar de seguir" : "Seguir"}
        </button>
      )}

      {/* Seguidores y siguiendo */}
      <div style={{ marginTop: 30 }}>
        <h3>Siguiendo</h3>
        {following.map((u) => (
          <div key={u.id}>{u.username}</div>
        ))}

        <h3>Seguidores</h3>
        {followers.map((u) => (
          <div key={u.id}>{u.username}</div>
        ))}
      </div>

      {/* Fotos del perfil */}
      <h2 style={{ marginTop: 40 }}>Fotos</h2>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 20 }}>
        {photos.map((photo) => (
          <div key={photo.id} style={{ width: 200 }}>
            <img
              src={photo.image_url}
              alt="foto"
              style={{ width: "100%", borderRadius: 8 }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}