"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { api } from "@/services/api";

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
  const [myFollowingIds, setMyFollowingIds] = useState<string[]>([]);
  const [collections, setCollections] = useState<any[]>([]);
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

      const token = localStorage.getItem("token");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const [photosData, followersData, followingData, collectionsRes] =
        await Promise.all([
          getPhotosByUser(userData.id),
          getFollowers(userData.id),
          getFollowing(userData.id),
          api.get(`/collections/user/${userData.id}`, { headers }),
        ]);

      setPhotos(photosData);
      setFollowers(followersData);
      setFollowing(followingData);
      setCollections(collectionsRes.data);
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
    setMyFollowingIds((prev) =>
      prev.includes(targetId) ? prev : [...prev, targetId],
    );
  };

  const handleUnfollow = async (targetId: string) => {
    await unfollowUser(targetId);
    const newFollowers = await getFollowers(targetId);
    setFollowers(newFollowers);
    setMyFollowingIds((prev) => prev.filter((id) => id !== targetId));
    setFollowing((prev) => prev.filter((u) => u.id !== targetId));
  };

  const removeFollower = async (followerId: string) => {
    await unfollowUser(followerId);
    setFollowers((prev) => prev.filter((u) => u.id !== followerId));
  };

  const handleLike = async (photoId: string) => {
    try {
      const res = await toggleLike(photoId);
      const newLikes = res.likes;
      setPhotos((prev) =>
        prev.map((p) =>
          p.id === photoId ? { ...p, like_count: newLikes } : p,
        ),
      );
      if (selectedPhoto && selectedPhoto.id === photoId) {
        setSelectedPhoto({ ...selectedPhoto, like_count: newLikes });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const createCollection = async (dto: {
    title: string;
    description?: string;
    goal_amount?: number;
    deadline_hours?: number;
    min_contribution?: number;
  }) => {
    try {
      const token = localStorage.getItem("token");
      const res = await api.post("/collections", dto, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCollections((prev) => [res.data, ...prev]);
      return res.data;
    } catch (err) {
      console.error(err);
    }
  };

  const deleteCollection = async (id: string) => {
    try {
      const token = localStorage.getItem("token");
      await api.delete(`/collections/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCollections((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const toggleCollectionPrivacy = async (id: string) => {
    try {
      const token = localStorage.getItem("token");
      const res = await api.patch(
        `/collections/${id}/privacy`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setCollections((prev) =>
        prev.map((c) =>
          c.id === id ? { ...c, is_private: res.data.is_private } : c,
        ),
      );
    } catch (err) {
      console.error(err);
    }
  };

  const deletePhoto = async (photoId: string) => {
    try {
      const token = localStorage.getItem("token");
      await api.delete(`/photos/${photoId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPhotos((prev) => prev.filter((p) => p.id !== photoId));
    } catch (err) {
      console.error(err);
    }
  };

  const toggleCensorPhoto = async (photoId: string) => {
    try {
      await api.patch(`/photos/censor/${photoId}`);
      setPhotos((prev) =>
        prev.map((p) =>
          p.id === photoId ? { ...p, censored: !p.censored } : p,
        ),
      );
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
    myFollowingIds,
    collections,
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
    removeFollower,
    handleLike,
    createCollection,
    deleteCollection,
    toggleCollectionPrivacy,
    deletePhoto,
    toggleCensorPhoto,
  };
}
