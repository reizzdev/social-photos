"use client";

import { useEffect, useState } from "react";
import { api } from "@/services/api";
import { Collection } from "@/types/collection";

export function useCollections() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchCollections = async () => {
    try {
      const res = await api.get("/collections");
      setCollections(res.data);
    } catch (err) {
      setError("Error cargando colecciones");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCollections();
  }, []);

  const createCollection = async (dto: {
    title: string;
    description?: string;
    goal_amount?: number;
    deadline_hours?: number;
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

  return { collections, loading, error, createCollection, deleteCollection, fetchCollections };
}