"use client";

import { useEffect, useState, useRef } from "react";
import { api } from "@/services/api";

export default function PhotosPage() {
  const [photos, setPhotos] = useState<any[]>([]);
  const gridRef = useRef<HTMLDivElement>(null);
const [openTags, setOpenTags] = useState<number | null>(null);
  useEffect(() => {
    const getPhotos = async () => {
      try {
        const res = await api.get("/photos");
        setPhotos(res.data);
      } catch (err) {
        console.error("Error fetching photos:", err);
      }
    };

    getPhotos();
  }, []);

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
        (img.getBoundingClientRect().height + rowGap) /
          (rowHeight + rowGap)
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
        {photos.map((photo) => (
          <div key={photo.id} className="photo-card">
            <img
              src={photo.image_url}
              alt="foto"
              style={{ width: "100%", display: "block" }}
              onLoad={setMasonry}
            />

            {/* barra inferior */}
            <div className="photo-footer">
              <span>{photo.users?.username}</span>

          <button
  className="tag-button"
  onClick={() =>
    setOpenTags(openTags === photo.id ? null : photo.id)
  }
>
  etiquetas
</button>
            </div>

            {/* mini ventana */}
  <div className={`tags-overlay ${openTags === photo.id ? "show" : ""}`}>
              {photo.photo_tags?.map((pt: any) => (
                <button
                  key={pt.tag_id}
                  className="tag"
                  onClick={() => console.log(pt.tags.name)}
                >
                  #{pt.tags.name}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <style jsx>{`
        .photo-card {
          position: relative;
        }

        .photo-footer {
          display: flex;
          justify-content: space-between;
          padding: 6px 10px;
          background: rgba(0, 0, 0, 0.6);
          color: white;
          font-weight: bold;
        }

        .tag-button {
          cursor: pointer;
        }

        /* mini ventana flotante */
        .tags-overlay {
  position: absolute;
  top: 10px;
  left: 0;

  background: rgba(0,0,0,0.9);
  padding: 10px;
  margin: 0 10px;
  border-radius: 8px;

  display: flex;
  flex-wrap: wrap;
  gap: 6px;

  opacity: 0;
  transform: translateY(-5px);
  transition: 0.2s ease;

  pointer-events: none;
}

.tags-overlay.show {
  opacity: 1;
  transform: translateY(0);
  pointer-events: auto;
}

 .photo-card:has(.tag-button:hover) .tags-overlay {
  opacity: 1;
  transform: translateY(0px);
  pointer-events: auto;
}

        .tag {
          background: #ffffff22;
          border: none;
          color: white;
          padding: 4px 8px;
          border-radius: 6px;
          cursor: pointer;
          font-size: 13px;
          transition: 0.15s;
        }

        .tag:hover {
          background: #ffffff55;
        }
      `}</style>
    </div>
  );
}