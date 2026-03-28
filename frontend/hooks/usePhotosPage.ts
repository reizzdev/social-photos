"use client";

import { useEffect, useState } from "react";
import { api } from "@/services/api";

export function usePhotosPage() {
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
        { headers: { Authorization: `Bearer ${token}` } },
      );

      setFollowing((prev) =>
        prev.includes(userId) ? prev : [...prev, userId],
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
        { headers: { Authorization: `Bearer ${token}` } },
      );

      setPhotos((prev) =>
        prev.map((p) =>
          p.id === photoId ? { ...p, like_count: res.data.likes } : p,
        ),
      );

      if (selectedPhoto && selectedPhoto.id === photoId) {
        setSelectedPhoto({ ...selectedPhoto, like_count: res.data.likes });
      }
    } catch (err) {
      console.error(err);
    }
  };

  return {
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
  };
}
