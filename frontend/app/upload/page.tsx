"use client";

import UploadPhoto from "@/components/profile/UploadPhoto";

export default function UploadPage() {
  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold mb-6">Subir Foto</h1>
      <UploadPhoto />
    </div>
  );
}