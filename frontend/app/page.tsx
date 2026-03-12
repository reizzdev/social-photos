"use client";

import { useEffect, useState } from "react";
import { api } from "@/services/api";

import PhotoGrid from "@/components/profile/PhotoGrid";
import PhotoModal from "@/components/profile/PhotoModal";

export default function PhotosPage() {
  const [photos, setPhotos] = useState<any[]>([]);
  const [following, setFollowing] = useState<string[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [selectedPhoto, setSelectedPhoto] = useState<any | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await api.get("/photos");
        setPhotos(res.data);

        const token = localStorage.getItem("token");
        if (!token) return;

        const me = await api.get("/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCurrentUser(me.data);

        const followingRes = await api.get(`/users/following/${me.data.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const ids = followingRes.data.map((u: any) => u.id);
        setFollowing(ids);
      } catch (err) {
        console.error(err);
      }
    };

    loadData();
  }, []);

  const handleFollow = async (userId: string) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setShowAuthModal(true);
        return;
      }

      await api.post(
        `/users/follow/${userId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // ✅ Actualiza el estado directamente aquí
      setFollowing((prev) =>
        prev.includes(userId) ? prev : [...prev, userId]
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleLike = async (photoId: string) => {
    try {
      const token = localStorage.getItem("token");
      const res = await api.post(
        `/photos/like/${photoId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setPhotos((prev) =>
        prev.map((p) =>
          p.id === photoId ? { ...p, like_count: res.data.likes } : p
        )
      );

      if (selectedPhoto && selectedPhoto.id === photoId) {
        setSelectedPhoto({ ...selectedPhoto, like_count: res.data.likes });
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ padding: 40 }}>
      <h1 style={{ marginBottom: 20 }}>Galería de Fotos</h1>

      <PhotoGrid
        photos={photos}
        masonry
        showUsername
        currentUser={currentUser}
        following={following}
        setFollowing={setFollowing} // ✅ AGREGADO
        handleLike={handleLike}
        handleFollow={handleFollow}
        setSelectedPhoto={setSelectedPhoto}
        setShowAuthModal={setShowAuthModal}
      />

      {selectedPhoto && (
        <PhotoModal
          photo={selectedPhoto}
          onClose={() => setSelectedPhoto(null)}
          handleLike={handleLike}
        />
      )}

      {showAuthModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.8)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 2000,
          }}
          onClick={() => setShowAuthModal(false)}
        >
          <div
            style={{
              background: "black",
              padding: 30,
              borderRadius: 10,
              textAlign: "center",
              minWidth: 300,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2>Crear cuenta</h2>
            <p>Debes tener una cuenta para ver fotos privadas</p>
            <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
              <a href="/register"><button>Registrarse</button></a>
              <a href="/login"><button>Iniciar sesión</button></a>
            </div>
            <button style={{ marginTop: 15 }} onClick={() => setShowAuthModal(false)}>
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}