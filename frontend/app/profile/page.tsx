"use client";

import { useEffect, useState } from "react";
import { api } from "@/services/api";
import UploadPhoto from "@/components/profile/UploadPhoto";
import PhotoCard from "@/components/profile/PhotoCard";
import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileStats from "@/components/profile/ProfileStats";
import CreateCollection from "@/components/collections/CreateCollection";
import CollectionFeed from "@/components/collections/CollectionFeed";
import { useCollections } from "@/hooks/useCollections";

const getToken = () => localStorage.getItem("token");
const getAuth = () => ({ headers: { Authorization: `Bearer ${getToken()}` } });

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [photos, setPhotos] = useState<any[]>([]);
  const [followers, setFollowers] = useState<any[]>([]);
  const [following, setFollowing] = useState<any[]>([]);
  const [error, setError] = useState("");
  const [showFollowers, setShowFollowers] = useState(false);
  const [showFollowing, setShowFollowing] = useState(false);
  const [tab, setTab] = useState<"fotos" | "colecciones">("colecciones");

  const { collections, createCollection, deleteCollection } = useCollections();

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
    <div className="max-w-2xl mx-auto p-6">
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
          Mis fotos
        </button>
      </div>

      {tab === "colecciones" && (
        <div className="flex flex-col gap-4">
          <CreateCollection onCreate={createCollection} />
          <CollectionFeed
            collections={collections.filter((c) => c.user_id === user.id)}
            currentUser={user}
            onDelete={deleteCollection}
          />
        </div>
      )}

      {tab === "fotos" && (
        <div className="flex flex-col gap-6">
          <UploadPhoto />
          <h2 className="text-sm font-medium text-neutral-900 dark:text-white">
            Mis fotos
          </h2>
          <div className="flex flex-wrap gap-4">
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
      )}
    </div>
  );
}
