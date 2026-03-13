"use client";

import PhotoGrid from "@/components/profile/PhotoGrid";
import PhotoModal from "@/components/profile/PhotoModal";
import AuthModal from "@/components/shared/AuthModal";
import { useTagPage } from "@/hooks/useTagPage";

export default function TagPage() {
  const {
    name,
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
    error,
  } = useTagPage();

  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold mb-5">#{name}</h1>

      <PhotoGrid
        photos={photos}
        masonry
        showUsername
        currentUser={currentUser}
        following={following}
        setFollowing={setFollowing}
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
        <AuthModal onClose={() => setShowAuthModal(false)} />
      )}
    </div>
  );
}