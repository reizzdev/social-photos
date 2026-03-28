"use client";

import { useState, useEffect } from "react";
import { Collection } from "@/types/collection";
import CollectionCard from "./CollectionCard";

interface Props {
  collections: Collection[];
  currentUser?: any;
  following?: string[];
  onDelete?: (id: string) => void;
  onTogglePrivacy?: (id: string) => void;
  onFollow?: (userId: string) => void;
}

export default function CollectionFeed({
  collections,
  currentUser,
  following: initialFollowing,
  onDelete,
  onTogglePrivacy,
  onFollow: externalOnFollow,
}: Props) {
  const [following, setFollowing] = useState<string[]>(initialFollowing ?? []);

  useEffect(() => {
    setFollowing(initialFollowing ?? []);
  }, [initialFollowing]);

  const handleFollow = (userId: string) => {
    setFollowing((prev) => (prev.includes(userId) ? prev : [...prev, userId]));
    externalOnFollow?.(userId);
  };
  if (collections.length === 0) {
    return (
      <p className="text-center text-neutral-400 text-sm mt-16">
        No hay colecciones aún
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {collections.map((collection) => (
        <CollectionCard
          key={collection.id}
          collection={collection}
          currentUser={currentUser}
          following={following}
          onFollow={handleFollow}
          onDelete={onDelete}
          onTogglePrivacy={onTogglePrivacy}
        />
      ))}
    </div>
  );
}
