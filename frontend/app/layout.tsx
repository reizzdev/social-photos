// app/layout.tsx
import "./globals.css";
import Link from "next/link";

export const metadata = {
  title: "Social App",
  description: "Mini red social de fotos",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>
        <header style={{
          padding: 20,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: "#1E1E1E",
          color: "#fff",
        }}>
          <h1 style={{ margin: 0 }}>SocialApp</h1>
          <nav style={{ display: "flex", gap: 20 }}>
            <Link href="/register" style={{ color: "white" }}>Registro</Link>
            <Link href="/login" style={{ color: "white" }}>Login</Link>
            <Link href="/profile" style={{ color: "white" }}>Perfil</Link>
            <Link href="/upload" style={{ color: "white" }}>Subir Foto</Link>
            <Link href="/" style={{ color: "white" }}>Todas las Fotos</Link>
          </nav>
        </header>

        <main style={{ padding: 20 }}>{children}</main>
      </body>
    </html>
  );
}