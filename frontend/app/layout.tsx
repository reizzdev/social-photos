// app/layout.tsx
"use client";

import "./globals.css";
import Link from "next/link";
import { useEffect, useState } from "react";
import { api } from "@/services/api";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem("token");

      if (!token) return;

      try {
        const res = await api.get("/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUser(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    loadUser();
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    location.reload();
  };

  return (
    <html lang="es">
      <body>

        <header className="navbar">

          <div className="nav-left">

            <Link href="/" className="logo">
              SocialApp
            </Link>

            <Link href="/">Explorar</Link>

          </div>

          <div className="nav-center">

            <input
              placeholder="Buscar usuario o tag..."
              className="search"
            />

          </div>

          <div className="nav-right">

            {user ? (
              <>
                <Link href="/upload">Subir</Link>

                <Link href={`/profile`}>
                  {user.username}
                </Link>

                <button onClick={logout} className="logout">
                  Salir
                </button>
              </>
            ) : (
              <>
                <Link href="/login">Login</Link>
                <Link href="/register">Registro</Link>
              </>
            )}

          </div>

        </header>

        <main className="main">{children}</main>

      </body>
    </html>
  );
}