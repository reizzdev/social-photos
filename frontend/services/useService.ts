import { api } from "@/services/api";

export const getMe = async () => {
  const res = await api.get("/users/me");
  return res.data;
};

export const getUserByUsername = async (username: string) => {
  const res = await api.get(`/users/username/${username}`);
  return res.data;
};

export const getFollowers = async (userId: string) => {
  const res = await api.get(`/users/followers/${userId}`);
  return res.data;
};

export const getFollowing = async (userId: string) => {
  const res = await api.get(`/users/following/${userId}`);
  return res.data;
};

export const followUser = async (targetId: string) => {
  const res = await api.post(`/users/follow/${targetId}`);
  return res.data;
};

export const unfollowUser = async (targetId: string) => {
  const res = await api.delete(`/users/unfollow/${targetId}`);
  return res.data;
};