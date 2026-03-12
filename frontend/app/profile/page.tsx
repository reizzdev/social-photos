"use client";

import { useEffect, useState } from "react";
import { api } from "@/services/api";
import UploadPhoto from "@/components/profile/UploadPhoto";
import PhotoCard from "@/components/profile/PhotoCard";
import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileStats from "@/components/profile/ProfileStats";
// HELPERS
const getToken = () => localStorage.getItem("token");
const getAuth = () => ({
  headers: {
    Authorization: `Bearer ${getToken()}`,
  },
});

// PAGE
export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [photos, setPhotos] = useState<any[]>([]);
  const [followers, setFollowers] = useState<any[]>([]);
  const [following, setFollowing] = useState<any[]>([]);
  const [error, setError] = useState("");
  const [showFollowers, setShowFollowers] = useState(false);
  const [showFollowing, setShowFollowing] = useState(false);

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

  if (error) return <p className="p-6 text-red-500">{error}</p>;
  if (!user) return <p className="p-6">Cargando...</p>;

  return (
    <div className="p-16">
      <ProfileHeader
        user={user}
        me={user}
        isFollowing={() => false}
        handleFollow={() => {}}
        handleUnfollow={() => {}}
      />

      <ProfileStats
        photos={photos}
        followers={followers}
        following={following}
        setShowFollowers={setShowFollowers}
        setShowFollowing={setShowFollowing}
      />

      <UploadPhoto />

      <h2 className="mt-10 text-xl font-semibold">MIS FOTOS</h2>

      <div className="flex flex-wrap gap-5 mt-4">
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
