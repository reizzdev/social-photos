"use client";

import { useUserProfile } from "@/hooks/useUserProfile";
import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileStats from "@/components/profile/ProfileStats";
import FollowersList from "@/components/profile/FollowersList";
import PhotoGrid from "@/components/profile/PhotoGrid";
import PhotoModal from "@/components/profile/PhotoModal";
import { useState, useEffect } from "react";

export default function ProfilePage() {
  const profile = useUserProfile();
  const [showAuthModal, setShowAuthModal] = useState(false);

  // ✅ Estado local para following, sincronizado con profile cuando carga
  const [following, setFollowing] = useState<string[]>([]);

  useEffect(() => {
    if (profile.following) {
      // profile.following puede ser array de objetos o de strings según tu hook
      const ids = profile.following.map((u: any) =>
        typeof u === "string" ? u : u.id,
      );
      setFollowing(ids);
    }
  }, [profile.following]);

  if (profile.loading) return <p>Cargando...</p>;
  if (profile.error) return <p>{profile.error}</p>;

  return (
    <div className="max-w-3xl mx-auto p-4">
      <ProfileHeader {...profile} />
      <ProfileStats {...profile} />

      <PhotoGrid
        photos={profile.photos}
        currentUser={profile.me}
        following={profile.myFollowingIds} // ✅ ESTE ES EL CAMBIO
        handleLike={profile.handleLike}
        handleFollow={profile.handleFollow}
        setSelectedPhoto={profile.setSelectedPhoto}
        setShowAuthModal={setShowAuthModal}
        showUsername
      />

      {profile.selectedPhoto && (
        <PhotoModal
          photo={profile.selectedPhoto}
          onClose={() => profile.setSelectedPhoto(null)}
          handleLike={profile.handleLike}
        />
      )}

      {profile.showFollowers && (
        <FollowersList
          title="Seguidores"
          users={profile.followers}
          onClose={() => profile.setShowFollowers(false)}
        />
      )}

      {profile.showFollowing && (
        <FollowersList
          title="Siguiendo"
          users={profile.following}
          onClose={() => profile.setShowFollowing(false)}
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
              <a href="/register">
                <button>Registrarse</button>
              </a>
              <a href="/login">
                <button>Iniciar sesión</button>
              </a>
            </div>
            <button
              style={{ marginTop: 15 }}
              onClick={() => setShowAuthModal(false)}
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
