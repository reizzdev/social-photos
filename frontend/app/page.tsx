"use client";

import PhotoGrid from "@/components/profile/PhotoGrid";
import PhotoModal from "@/components/profile/PhotoModal";
import AuthModal from "@/components/shared/AuthModal";
import { usePhotosPage } from "@/hooks/usePhotosPage";

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

  return (
    <div className="p-10">
    
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