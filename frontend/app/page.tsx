"use client";

import PhotoGrid from "@/components/profile/PhotoGrid";
import PhotoModal from "@/components/profile/PhotoModal";
import AuthModal from "@/components/shared/AuthModal";
import CollectionFeed from "@/components/collections/CollectionFeed";
import { usePhotosPage } from "@/hooks/usePhotosPage";
import { useCollections } from "@/hooks/useCollections";
import { useState } from "react";

export default function PhotosPage() {
  const {
    photos,
    following,
    setFollowing,
    currentUser,
    selectedPhoto,
    setSelectedPhoto,
    showAuthModal,
    setShowAuthModal,
    handleFollow,
    handleLike,
  } = usePhotosPage();
  const { collections, deleteCollection } = useCollections();
  const [tab, setTab] = useState<"fotos" | "colecciones">("colecciones");

  return (
    <div className="p-6 max-w-2xl mx-auto">
      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-neutral-100 dark:bg-neutral-900 rounded-xl p-1">
        <button
          onClick={() => setTab("colecciones")}
          className={`flex-1 py-2 text-sm rounded-lg transition ${
            tab === "colecciones"
              ? "bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white font-medium shadow-sm"
              : "text-neutral-500 hover:text-neutral-700"
          }`}
        >
          Colecciones
        </button>
        <button
          onClick={() => setTab("fotos")}
          className={`flex-1 py-2 text-sm rounded-lg transition ${
            tab === "fotos"
              ? "bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white font-medium shadow-sm"
              : "text-neutral-500 hover:text-neutral-700"
          }`}
        >
          Explorar fotos
        </button>
      </div>

      {tab === "colecciones" && (
        <CollectionFeed
          collections={collections}
          currentUser={currentUser}
          following={following}
          onFollow={handleFollow}
        />
      )}

      {tab === "fotos" && (
        <PhotoGrid
          photos={photos}
          masonry
          showUsername
          showTags
          currentUser={currentUser}
          following={following}
          setFollowing={setFollowing}
          handleLike={handleLike}
          handleFollow={handleFollow}
          setSelectedPhoto={setSelectedPhoto}
          setShowAuthModal={setShowAuthModal}
        />
      )}

      {selectedPhoto && (
        <PhotoModal
          photo={selectedPhoto}
          onClose={() => setSelectedPhoto(null)}
          handleLike={handleLike}
        />
      )}

      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}
    </div>
  );
}
