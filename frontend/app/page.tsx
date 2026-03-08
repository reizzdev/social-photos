"use client";

import { useEffect, useState, useRef } from "react";
import { api } from "@/services/api";
import Link from "next/link";

export default function PhotosPage() {
  const [photos, setPhotos] = useState<any[]>([]);
  const [following, setFollowing] = useState<string[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [selectedPhoto, setSelectedPhoto] = useState<any>(null);

  const gridRef = useRef<HTMLDivElement>(null);
  const [openTags, setOpenTags] = useState<number | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await api.get("/photos");
        setPhotos(res.data);

        const token = localStorage.getItem("token");

        if (token) {
          const me = await api.get("/users/me", {
            headers: { Authorization: `Bearer ${token}` },
          });

          setCurrentUser(me.data);

          const followingRes = await api.get(`/users/following/${me.data.id}`);
          const ids = followingRes.data.map((u: any) => u.id);

          setFollowing(ids);
        }
      } catch (err) {
        console.error(err);
      }
    };

    loadData();
  }, []);

  const handleFollow = async (userId: string) => {
    try {
      const token = localStorage.getItem("token");

      await api.post(
        `/users/follow/${userId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setFollowing((prev) => [...prev, userId]);
    } catch (err) {
      console.error(err);
    }
  };

  const handleLike = async (photoId: string) => {
    try {
      const token = localStorage.getItem("token");
///api.post(`/photos/like/${photoId}`
      const res = await api.post(`/photos/like/${photoId}`,{},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setPhotos((prev) =>
        prev.map((p) =>
          p.id === photoId ? { ...p, like_count: res.data.likes } : p
        )
      );

      if (selectedPhoto && selectedPhoto.id === photoId) {
        setSelectedPhoto({ ...selectedPhoto, like_count: res.data.likes });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const setMasonry = () => {
    const grid = gridRef.current;
    if (!grid) return;

    const rowHeight = 10;
    const rowGap = 20;

    const allItems = Array.from(grid.children) as HTMLElement[];

    allItems.forEach((item) => {
      const img = item.querySelector("img") as HTMLImageElement;

      if (!img) return;

      const span = Math.ceil(
        (img.getBoundingClientRect().height + rowGap) / (rowHeight + rowGap)
      );

      item.style.gridRowEnd = `span ${span}`;
    });
  };

  useEffect(() => {
    const timeout = setTimeout(() => setMasonry(), 100);

    window.addEventListener("resize", setMasonry);

    return () => {
      clearTimeout(timeout);
      window.removeEventListener("resize", setMasonry);
    };
  }, [photos]);

  return (
    <div style={{ padding: 40 }}>
      <h1 style={{ marginBottom: 20 }}>Galería de Fotos</h1>

      <div
        ref={gridRef}
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
          gridAutoRows: 10,
          gap: 20,
        }}
      >
        {photos.map((photo) => {
          const isOwner = currentUser?.id === photo.user_id;
          const followsUser = following.includes(photo.user_id);
          const shouldBlur = photo.censored && !followsUser && !isOwner;

          return (
            <div key={photo.id} className="photo-card">
              <div className="image-wrapper">
                <img
                  src={photo.image_url}
                  alt="foto"
                  onLoad={setMasonry}
                  onClick={() => setSelectedPhoto(photo)}
                  className={shouldBlur ? "censored" : ""}
                  style={{ cursor: "pointer" }}
                />

                {shouldBlur && (
                  <div className="censor-overlay text-black">
                    <button onClick={() => handleFollow(photo.user_id)}>
                      Seguir para ver
                    </button>
                  </div>
                )}
              </div>

              <div className="photo-footer">
                <Link
  href={`/${photo.users?.username}`}
  style={{ fontWeight: "bold", cursor: "pointer" }}
>
  {photo.users?.username}
</Link>

                <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                  <button onClick={() => handleLike(photo.id)}>❤️</button>
                  <span>{photo.like_count}</span>
                </div>

                <button
                  className="tag-button"
                  onClick={() =>
                    setOpenTags(openTags === photo.id ? null : photo.id)
                  }
                >
                  etiquetas
                </button>
              </div>

              <div
                className={`tags-overlay ${openTags === photo.id ? "show" : ""}`}
              >
                {photo.photo_tags?.map((pt: any) => (
                  <Link
                    key={pt.tag_id}
                    href={`/tag/${pt.tags.name}`}
                    className="tag"
                  >
                    #{pt.tags.name}
                  </Link>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {selectedPhoto && (
        <div
          onClick={() => setSelectedPhoto(null)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.85)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: "90%",
              maxHeight: "90%",
              textAlign: "center",
            }}
          >
            <img
              src={selectedPhoto.image_url}
              style={{
                maxHeight: "80vh",
                borderRadius: 10,
              }}
            />

            <div
              style={{
                marginTop: 15,
                display: "flex",
                justifyContent: "center",
                gap: 15,
                alignItems: "center",
                color: "white",
                fontSize: 18,
              }}
            >
              <button onClick={() => handleLike(selectedPhoto.id)}>❤️</button>
              <span>{selectedPhoto.like_count}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}