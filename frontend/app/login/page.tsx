"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/services/api";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    try {
      const res = await api.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.access_token);
      router.push("/");
    } catch (err) {
      console.error(err);
      setError("Email o contraseña incorrectos");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-2xl p-8 w-full max-w-sm">
        <h1 className="text-xl font-medium text-neutral-900 dark:text-white mb-1">
          Iniciar sesión
        </h1>
        <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-6">
          Bienvenido de vuelta
        </p>

        <div className="flex flex-col gap-3">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2.5 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-transparent text-sm focus:outline-none focus:border-neutral-500"
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2.5 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-transparent text-sm focus:outline-none focus:border-neutral-500"
          />

          {error && <p className="text-xs text-red-500">{error}</p>}

          <button
            onClick={handleLogin}
            className="w-full py-2.5 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-lg text-sm font-medium hover:opacity-90 transition mt-1"
          >
            Iniciar sesión
          </button>
        </div>

        <p className="text-xs text-neutral-400 text-center mt-5">
          ¿No tienes cuenta?{" "}
          <a
            href="/register"
            className="text-neutral-600 dark:text-neutral-300 hover:underline"
          >
            Regístrate
          </a>
        </p>
      </div>
    </div>
  );
}
