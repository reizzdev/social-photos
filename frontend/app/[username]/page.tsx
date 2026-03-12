"use client";

import { useUserProfile } from "@/hooks/useUserProfile";
import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileStats from "@/components/profile/ProfileStats";
import FollowersList from "@/components/profile/FollowersList";
import PhotoGrid from "@/components/profile/PhotoGrid";
import PhotoModal from "@/components/profile/PhotoModal";

export default function ProfilePage() {
  const profile = useUserProfile();

  if (profile.loading) return <p>Cargando...</p>;
  if (profile.error) return <p>{profile.error}</p>;

  return (
    <div className="max-w-3xl mx-auto p-4">

      <ProfileHeader {...profile} />
      <ProfileStats {...profile} />
      <PhotoGrid
  photos={profile.photos}
  setSelectedPhoto={profile.setSelectedPhoto}
  handleLike={profile.handleLike}
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
    </div>
  );
}