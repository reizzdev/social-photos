"use client";

import { useUserProfile } from "@/hooks/useUserProfile";
import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileStats from "@/components/profile/ProfileStats";
import FollowersList from "@/components/profile/FollowersList";
import PhotoGrid from "@/components/profile/PhotoGrid";
import PhotoModal from "@/components/profile/PhotoModal";
import AuthModal from "@/components/shared/AuthModal";
import { useState } from "react";

export default function ProfilePage() {
  const profile = useUserProfile();
  const [showAuthModal, setShowAuthModal] = useState(false);

  const isOwner = profile.me?.id === profile.user?.id; // ✅

  if (profile.loading) return <p className="text-center mt-10">Cargando...</p>;
  if (profile.error)
    return <p className="text-center mt-10 text-red-500">{profile.error}</p>;

  return (
    <div className="max-w-3xl mx-auto p-4">
      <ProfileHeader {...profile} />
      <ProfileStats {...profile} />

      <PhotoGrid
        photos={profile.photos}
        currentUser={profile.me}
        following={profile.myFollowingIds}
        handleLike={profile.handleLike}
        handleFollow={profile.handleFollow}
        setSelectedPhoto={profile.setSelectedPhoto}
        setShowAuthModal={setShowAuthModal}
        //showUsername
        showTags
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
          isOwner={isOwner}
          onRemoveFollower={profile.removeFollower} // ✅
        />
      )}

      {profile.showFollowing && (
        <FollowersList
          title="Siguiendo"
          users={profile.following}
          onClose={() => profile.setShowFollowing(false)}
          isOwner={isOwner}
          onUnfollow={profile.handleUnfollow} // ✅
        />
      )}

      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}
    </div>
  );
}
