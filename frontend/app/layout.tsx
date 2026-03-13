// app/layout.tsx
"use client";

import "./globals.css";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { api } from "@/services/api";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const pathname = usePathname();

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

  const isActive = (href: string) => pathname === href;

  return (
    <html lang="es">
      <body className="flex min-h-screen bg-white dark:bg-neutral-950">

        {/* Sidebar izquierdo */}
        <aside className="w-60 flex-shrink-0 border-r border-neutral-200 dark:border-neutral-800 flex flex-col px-4 py-6 sticky top-0 h-screen">

          {/* Logo */}
          <Link href="/" className="text-lg font-semibold text-neutral-900 dark:text-white mb-8 px-2">
            SocialApp
          </Link>

          {/* Nav links */}
          <nav className="flex flex-col gap-1 flex-1">
            <Link
              href="/"
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition ${
                isActive("/")
                  ? "bg-violet-500/10 text-violet-500 font-medium"
                  : "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-white"
              }`}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
              Explorar
            </Link>

            {user && (
              <>
                <Link
                  href="/upload"
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition ${
                    isActive("/upload")
                      ? "bg-violet-500/10 text-violet-500 font-medium"
                      : "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-white"
                  }`}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
                  </svg>
                  Subir foto
                </Link>

                <Link
                  href={`/${user.username}`}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition ${
                    pathname === `/${user.username}`
                      ? "bg-violet-500/10 text-violet-500 font-medium"
                      : "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-white"
                  }`}
                >
                  <img
                    src={user.avatar_url || "/default-avatar.png"}
                    className="w-5 h-5 rounded-full object-cover"
                  />
                  {user.username}
                </Link>
              </>
            )}

            {!user && (
              <>
                <Link
                  href="/login"
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-white transition"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/>
                  </svg>
                  Iniciar sesión
                </Link>

                <Link
                  href="/register"
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-white transition"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/>
                  </svg>
                  Registrarse
                </Link>
              </>
            )}
          </nav>

          {/* Logout abajo */}
          {user && (
            <button
              onClick={logout}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-neutral-400 hover:bg-red-500/10 hover:text-red-400 transition"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
              </svg>
              Cerrar sesión
            </button>
          )}
        </aside>

        {/* Contenido principal */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>

      </body>
    </html>
  );
}