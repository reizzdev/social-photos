"use client";

import { useUserProfile } from "@/hooks/useUserProfile";
import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileStats from "@/components/profile/ProfileStats";
import FollowersList from "@/components/profile/FollowersList";
import PhotoGrid from "@/components/profile/PhotoGrid";
import PhotoModal from "@/components/profile/PhotoModal";
import AuthModal from "@/components/shared/AuthModal";
import CollectionFeed from "@/components/collections/CollectionFeed";
import { useState, useEffect } from "react";
import { api } from "@/services/api";
import { Collection } from "@/types/collection";

export default function ProfilePage() {
  const profile = useUserProfile();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [tab, setTab] = useState<"colecciones" | "fotos">("colecciones");

  const isOwner = profile.me?.id === profile.user?.id;

  useEffect(() => {
    if (!profile.user?.id) return;
    const fetchCollections = async () => {
      try {
        const res = await api.get(`/collections/user/${profile.user.id}`);
        setCollections(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchCollections();
  }, [profile.user?.id]);

  if (profile.loading) return <p className="text-center mt-10">Cargando...</p>;
  if (profile.error) return <p className="text-center mt-10 text-red-500">{profile.error}</p>;

  return (
    <div className="max-w-2xl mx-auto p-4">
      <ProfileHeader {...profile} />
      <ProfileStats {...profile} />

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-neutral-100 dark:bg-neutral-900 rounded-xl p-1">
        <button
          onClick={() => setTab("colecciones")}
          className={`flex-1 py-2 text-sm rounded-lg transition ${
            tab === "colecciones"
              ? "bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white font-medium"
              : "text-neutral-500 hover:text-neutral-700"
          }`}
        >
          Colecciones
        </button>
        <button
          onClick={() => setTab("fotos")}
          className={`flex-1 py-2 text-sm rounded-lg transition ${
            tab === "fotos"
              ? "bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white font-medium"
              : "text-neutral-500 hover:text-neutral-700"
          }`}
        >
          Fotos
        </button>
      </div>

      {tab === "colecciones" && (
        <CollectionFeed
          collections={collections}
          currentUser={profile.me}
          following={profile.myFollowingIds}
        />
      )}

      {tab === "fotos" && (
        <PhotoGrid
          photos={profile.photos}
          currentUser={profile.me}
          following={profile.myFollowingIds}
          handleLike={profile.handleLike}
          handleFollow={profile.handleFollow}
          setSelectedPhoto={profile.setSelectedPhoto}
          setShowAuthModal={setShowAuthModal}
          showTags
        />
      )}

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
          isOwner={isOwner}
          onRemoveFollower={profile.removeFollower}
        />
      )}

      {profile.showFollowing && (
        <FollowersList
          title="Siguiendo"
          users={profile.following}
          onClose={() => profile.setShowFollowing(false)}
          isOwner={isOwner}
          onUnfollow={profile.handleUnfollow}
        />
      )}

      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}
    </div>
  );
}