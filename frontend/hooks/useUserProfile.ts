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

import {
  getPhotosByUser,
  toggleLike,
} from "@/services/photoService";

export function useUserProfile() {
  const { username } = useParams();

  const [user, setUser] = useState<any>(null);
  const [me, setMe] = useState<any>(null);

  const [photos, setPhotos] = useState<any[]>([]);
  const [followers, setFollowers] = useState<any[]>([]);
  const [following, setFollowing] = useState<any[]>([]);

  const [selectedPhoto, setSelectedPhoto] = useState<any>(null);

  const [showFollowers, setShowFollowers] = useState(false);
  const [showFollowing, setShowFollowing] = useState(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchData = async () => {
    try {
      const meData = await getMe();
      setMe(meData);

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
    return me.id !== targetId && followers.some((f) => f.id === me.id);
  };

  const handleFollow = async (targetId: string) => {
    await followUser(targetId);

    const newFollowers = await getFollowers(targetId);
    setFollowers(newFollowers);
  };

  const handleUnfollow = async (targetId: string) => {
    await unfollowUser(targetId);

    const newFollowers = await getFollowers(targetId);
    setFollowers(newFollowers);
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
        setSelectedPhoto({
          ...selectedPhoto,
          like_count: newLikes,
        });
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