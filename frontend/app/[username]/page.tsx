"use client";

import { useEffect, useState } from "react";
import { api } from "@/services/api";
import { useParams } from "next/navigation";
import Link from "next/link";

export default function UserProfilePage() {
  const { username } = useParams();

  const [user, setUser] = useState<any>(null);
  const [photos, setPhotos] = useState<any[]>([]);
  const [followers, setFollowers] = useState<any[]>([]);
  const [following, setFollowing] = useState<any[]>([]);
  const [me, setMe] = useState<any>(null);

  const [showFollowers, setShowFollowers] = useState(false);
  const [showFollowing, setShowFollowing] = useState(false);

  const [error, setError] = useState("");
  const [selectedPhoto,setSelectedPhoto] = useState<any>(null);

  const fetchFollowers = async (userId: string) => {
    try {
      const f = await api.get(`/users/followers/${userId}`);
      setFollowers(f.data);

      const fg = await api.get(`/users/following/${userId}`);
      setFollowing(fg.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token");

      const meRes = await api.get("/users/me", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setMe(meRes.data);

      const userRes = await api.get(`/users/username/${username}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUser(userRes.data);

      const photosRes = await api.get(`/photos/user/${userRes.data.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setPhotos(photosRes.data);

      fetchFollowers(userRes.data.id);
    } catch (err) {
      console.error(err);
      setError("Error cargando perfil");
    }
  };

  useEffect(() => {
    if (username) fetchData();
  }, [username]);

  const isFollowing = (targetId: string) => {
    if (!me) return false;
    return me.id !== targetId && followers.some((f) => f.id === me.id);
  };

  const handleFollow = async (targetId: string) => {
    const token = localStorage.getItem("token");

    await api.post(
      `/users/follow/${targetId}`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );

    fetchFollowers(targetId);
  };

  const handleUnfollow = async (targetId: string) => {
    const token = localStorage.getItem("token");

    await api.delete(`/users/unfollow/${targetId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    fetchFollowers(targetId);
  };

  if (error) return <p>{error}</p>;
  if (!user || !me) return <p>Cargando...</p>;

  const isMyProfile = user.id === me.id;

const handleLike = async (photoId: string) => {
  try {
    const token = localStorage.getItem("token");

    const res = await api.post(`/photos/like/${photoId}`, {}, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const newLikes = res.data.likes;

    // actualizar grid
    setPhotos(prev =>
      prev.map(p =>
        p.id === photoId
          ? { ...p, like_count: newLikes }
          : p
      )
    );

    // actualizar modal
    if (selectedPhoto && selectedPhoto.id === photoId) {
      setSelectedPhoto({
        ...selectedPhoto,
        like_count: newLikes
      });
    }

  } catch (err) {
    console.error(err);
  } 
};

  return (
    <div style={{ padding: 40, maxWidth: 900, margin: "auto" }}>
      {/* HEADER */}
      <h1>{user.username}</h1>

      <p>{user.bio || "Sin bio"}</p>

      {/* ACTION BUTTON */}
      {isMyProfile ? (
        <Link href="/profile">
          <button
            style={{
              marginBottom: 20,
              padding: "6px 16px",
              backgroundColor: "black",
              color: "white",
              border: "none",
              borderRadius: 6,
              cursor: "pointer",
            }}
          >
            Editar perfil
          </button>
        </Link>
      ) : (
        <button
          onClick={() =>
            isFollowing(user.id)
              ? handleUnfollow(user.id)
              : handleFollow(user.id)
          }
          style={{
            marginBottom: 20,
            padding: "6px 16px",
            backgroundColor: isFollowing(user.id) ? "red" : "green",
            color: "white",
            border: "none",
            borderRadius: 6,
            cursor: "pointer",
          }}
        >
          {isFollowing(user.id) ? "Dejar de seguir" : "Seguir"}
        </button>
      )}

      {/* STATS */}
      <div style={{ display: "flex", gap: 20, marginBottom: 20 }}>
        <div>
          <strong>{photos.length}</strong> fotos
        </div>

        <button
          onClick={() => {
            setShowFollowers(!showFollowers);
            setShowFollowing(false);
          }}
        >
          <strong>{followers.length}</strong> seguidores
        </button>

        <button
          onClick={() => {
            setShowFollowing(!showFollowing);
            setShowFollowers(false);
          }}
        >
          <strong>{following.length}</strong> siguiendo
        </button>
      </div>

      {/* FOLLOWERS LIST */}
      {showFollowers && (
        <div
          style={{
            background: "#111",
            color: "white",
            padding: 15,
            borderRadius: 8,
            marginBottom: 20,
          }}
        >
          {followers.map((u) => (
            <div key={u.id} style={{ padding: "6px 0" }}>
              {u.username}
            </div>
          ))}
        </div>
      )}

      {/* FOLLOWING LIST */}
      {showFollowing && (
        <div
          style={{
            background: "#111",
            color: "white",
            padding: 15,
            borderRadius: 8,
            marginBottom: 20,
          }}
        >
          {following.map((u) => (
            <div key={u.id} style={{ padding: "6px 0" }}>
              {u.username}
            </div>
          ))}
        </div>
      )}

      {/* PHOTOS */}
      <h2>Fotos</h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(150px,1fr))",
          gap: 12,
        }}
      >
        {photos.map((photo) => (

  <div
    key={photo.id}
    style={{cursor:"pointer"}}
  >

    <img
      src={photo.image_url}
      onClick={()=>setSelectedPhoto(photo)}
      style={{
        width:"100%",
        borderRadius:6,
        aspectRatio:"1/1",
        objectFit:"cover"
      }}
    />

    <div
      style={{
        display:"flex",
        justifyContent:"space-between",
        marginTop:4,
        fontSize:14
      }}
    >

      <button
        onClick={()=>handleLike(photo.id)}
        style={{
          border:"none",
          background:"none",
          cursor:"pointer"
        }}
      >
        ❤️
      </button>

      <span>
        {photo.like_count || 0}
      </span>

    </div>

  </div>

))}

{selectedPhoto && (

<div
  onClick={()=>setSelectedPhoto(null)}
  style={{
    position:"fixed",
    inset:0,
    background:"rgba(0,0,0,0.85)",
    display:"flex",
    alignItems:"center",
    justifyContent:"center",
    zIndex:1000
  }}
>

<div
  onClick={(e)=>e.stopPropagation()}
  style={{maxWidth:"90vw"}}
>

<img
  src={selectedPhoto.image_url}
  style={{
    maxHeight:"80vh",
    borderRadius:10
  }}
/>

<div
  style={{
    marginTop:10,
    display:"flex",
    justifyContent:"space-between",
    color:"white"
  }}
>

<button
  onClick={()=>handleLike(selectedPhoto.id)}
  style={{
    background:"none",
    border:"none",
    fontSize:20,
    cursor:"pointer",
    color:"white"
  }}
>
❤️
</button>

<span>
{selectedPhoto?.like_count || 0} likes
</span>

</div>

</div>

</div>

)}

      </div>
    </div>
  );
}