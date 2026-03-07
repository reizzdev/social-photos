"use client";

import { useEffect, useState, useRef } from "react";
import { api } from "@/services/api";
import Link from "next/link";
export default function PhotosPage() {

  const [photos, setPhotos] = useState<any[]>([]);
  const [following, setFollowing] = useState<string[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);

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
            headers: { Authorization: `Bearer ${token}` }
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

      setFollowing(prev => [...prev, userId]);

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
                  className={shouldBlur ? "censored" : ""}
                />

                {shouldBlur && (

                  <div className="censor-overlay text-black">

                    <button
                      onClick={() => handleFollow(photo.user_id)}
                    >
                      Seguir para ver
                    </button>

                  </div>

                )}

              </div>

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

              <div className={`tags-overlay ${openTags === photo.id ? "show" : ""}`}>

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

.image-wrapper {
position: relative;
overflow: hidden;
}

.image-wrapper img {
width: 100%;
display: block;
transition: 0.2s;
}

.censored {
filter: blur(8px);
}

.censor-overlay {
position: absolute;
inset: 0;
display: flex;
align-items: center;
justify-content: center;
background: rgba(0,0,0,0.6);
}

.censor-overlay button {
background: white;
border: none;
padding: 8px 14px;
border-radius: 8px;
font-weight: bold;
cursor: pointer;
}

`}</style>

    </div>
  );

}