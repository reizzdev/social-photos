"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/services/api";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleRegister = async () => {
    try {
      await api.post("/auth/register", {
        username,
        email,
        password,
      });

      setMessage("Registro exitoso 🎉, redirigiendo al login...");
      setTimeout(() => router.push("/login"), 1500);
    } catch (err: any) {
      console.error(err);
      setMessage(err.response?.data?.message || "Error en el registro");
    }
  };

  return (
    <div style={{ padding: 40 }}>
      <h1>Registrarse</h1>

      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        style={{ display: "block", marginBottom: 10, width: 300 }}
      />

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ display: "block", marginBottom: 10, width: 300 }}
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ display: "block", marginBottom: 10, width: 300 }}
      />

      <button onClick={handleRegister} style={{ padding: "5px 15px" }}>
        Registrar
      </button>

      <p>{message}</p>
    </div>
  );
}