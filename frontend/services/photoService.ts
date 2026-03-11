import { api } from "@/services/api";

export const getPhotosByUser = async (userId: string) => {
  const res = await api.get(`/photos/user/${userId}`);
  return res.data;
};

export const toggleLike = async (photoId: string) => {
  const res = await api.post(`/photos/like/${photoId}`);
  return res.data;
};