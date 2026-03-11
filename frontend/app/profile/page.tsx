"use client";

import { useEffect, useState } from "react";
import { api } from "@/services/api";
import UploadPhoto from "@/components/profile/UploadPhoto";
import PhotoCard from "@/components/profile/PhotoCard";
// =======================
// HELPERS
// =======================

const getToken = () => localStorage.getItem("token");

const getAuth = () => ({
  headers: { Authorization: `Bearer ${getToken()}` },
});

// =======================
// PAGE
// =======================

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [photos, setPhotos] = useState<any[]>([]);
  const [followers, setFollowers] = useState<any[]>([]);
  const [following, setFollowing] = useState<any[]>([]);
  const [error, setError] = useState("");

  // =======================
  // FETCH DATA
  // =======================

  const fetchData = async () => {
    try {
      const token = getToken();
      if (!token) throw new Error("No token");

      const userRes = await api.get("/users/me", getAuth());
      setUser(userRes.data);

      const photosRes = await api.get(
        `/photos/user/${userRes.data.id}`,
        getAuth(),
      );
      setPhotos(photosRes.data);

      const f = await api.get(`/users/followers/${userRes.data.id}`);
      const fg = await api.get(`/users/following/${userRes.data.id}`);

      setFollowers(f.data);
      setFollowing(fg.data);
    } catch (err) {
      console.error(err);
      setError("No autorizado");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (error) return <p>{error}</p>;
  if (!user) return <p>Cargando...</p>;

  return (
    <div style={{ padding: 60 }}>
      <h1>Perfil de {user.username}</h1>
      <p className="p-2">{user.email}</p>
      <p className="p-2">{user.bio || "Aqui ira mi bio cuando tenga"}</p>

      <UploadPhoto />

      {/* FOTOS */}
      <h2 style={{ marginTop: 40 }}>MIS FOTOS</h2>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 20 }}>
        {photos.map((photo) => (
          <PhotoCard
            key={photo.id}
            photo={photo}
            onDelete={(id) =>
              setPhotos((prev) => prev.filter((p) => p.id !== id))
            }
            onToggle={(id) =>
              setPhotos((prev) =>
                prev.map((p) =>
                  p.id === id ? { ...p, censored: !p.censored } : p,
                ),
              )
            }
          />
        ))}
      </div>
    </div>
  );
}
