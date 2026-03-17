"use client";

import { Collection } from "@/types/collection";
import CollectionCard from "./CollectionCard";

interface Props {
  collections: Collection[];
  currentUser?: any;
  following?: string[];
  onDelete?: (id: string) => void;
  onTogglePrivacy?: (id: string) => void;
}

export default function CollectionFeed({ collections, currentUser, following, onDelete, onTogglePrivacy }: Props) {
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
          onDelete={onDelete}
          onTogglePrivacy={onTogglePrivacy}
        />
      ))}
    </div>
  );
}