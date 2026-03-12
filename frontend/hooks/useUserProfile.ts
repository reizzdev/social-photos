"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import {
  getMe,
  getUserByUsername,
  getFollowers,
  getFollowing,
  followUser,
  unfollowUser,
} from "@/services/useService";

import { getPhotosByUser, toggleLike } from "@/services/photoService";

export function useUserProfile() {
  const { username } = useParams();

  const [user, setUser] = useState<any>(null);
  const [me, setMe] = useState<any>(null);

  const [photos, setPhotos] = useState<any[]>([]);
  const [followers, setFollowers] = useState<any[]>([]);
  const [following, setFollowing] = useState<any[]>([]);

  // ✅ NUEVO: IDs que el usuario logueado sigue
  const [myFollowingIds, setMyFollowingIds] = useState<string[]>([]);

  const [selectedPhoto, setSelectedPhoto] = useState<any>(null);
  const [showFollowers, setShowFollowers] = useState(false);
  const [showFollowing, setShowFollowing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchData = async () => {
    try {
      let meData = null;

      try {
        meData = await getMe();
        setMe(meData);

        // ✅ Carga los IDs que el usuario logueado sigue
        if (meData?.id) {
          const myFollowing = await getFollowing(meData.id);
          const ids = myFollowing.map((u: any) => u.id);
          setMyFollowingIds(ids);
        }
      } catch {
        setMe(null);
        setMyFollowingIds([]);
      }

      const userData = await getUserByUsername(username as string);
      setUser(userData);

      const photosData = await getPhotosByUser(userData.id);
      setPhotos(photosData);

      const followersData = await getFollowers(userData.id);
      setFollowers(followersData);

      const followingData = await getFollowing(userData.id);
      setFollowing(followingData);

    } catch (err) {
      console.error(err);
      setError("Error cargando perfil");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (username) fetchData();
  }, [username]);

  const isFollowing = (targetId: string) => {
    if (!me) return false;
    return followers.some((f) => f.id === me.id);
  };

  const handleFollow = async (targetId: string) => {
    await followUser(targetId);

    const newFollowers = await getFollowers(targetId);
    setFollowers(newFollowers);

    // ✅ Actualiza los IDs del usuario logueado inmediatamente
    setMyFollowingIds((prev) =>
      prev.includes(targetId) ? prev : [...prev, targetId]
    );
  };

  const handleUnfollow = async (targetId: string) => {
    await unfollowUser(targetId);

    const newFollowers = await getFollowers(targetId);
    setFollowers(newFollowers);

    // ✅ Remueve el ID al dejar de seguir
    setMyFollowingIds((prev) => prev.filter((id) => id !== targetId));
  };

  const handleLike = async (photoId: string) => {
    try {
      const res = await toggleLike(photoId);
      const newLikes = res.likes;

      setPhotos((prev) =>
        prev.map((p) =>
          p.id === photoId ? { ...p, like_count: newLikes } : p
        )
      );

      if (selectedPhoto && selectedPhoto.id === photoId) {
        setSelectedPhoto({ ...selectedPhoto, like_count: newLikes });
      }
    } catch (err) {
      console.error(err);
    }
  };

  return {
    user,
    me,
    photos,
    followers,
    following,
    myFollowingIds, // ✅ Exportado para usarlo en ProfilePage

    selectedPhoto,
    setSelectedPhoto,

    showFollowers,
    setShowFollowers,

    showFollowing,
    setShowFollowing,

    loading,
    error,

    isFollowing,
    handleFollow,
    handleUnfollow,
    handleLike,
  };
}