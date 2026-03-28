"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/services/api";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const router = useRouter();

  const handleRegister = async () => {
    try {
      await api.post("/auth/register", { username, email, password });
      setIsError(false);
      setMessage("Registro exitoso, redirigiendo...");
      setTimeout(() => router.push("/login"), 1500);
    } catch (err: any) {
      console.error(err);
      setIsError(true);
      setMessage(err.response?.data?.message || "Error en el registro");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-2xl p-8 w-full max-w-sm">
        <h1 className="text-xl font-medium text-neutral-900 dark:text-white mb-1">
          Crear cuenta
        </h1>
        <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-6">
          Únete a la comunidad
        </p>

        <div className="flex flex-col gap-3">
          <input
            type="text"
            placeholder="Usuario"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-2.5 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-transparent text-sm focus:outline-none focus:border-neutral-500"
          />
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

          {message && (
            <p
              className={`text-xs ${isError ? "text-red-500" : "text-green-500"}`}
            >
              {message}
            </p>
          )}

          <button
            onClick={handleRegister}
            className="w-full py-2.5 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-lg text-sm font-medium hover:opacity-90 transition mt-1"
          >
            Registrarse
          </button>
        </div>

        <p className="text-xs text-neutral-400 text-center mt-5">
          ¿Ya tienes cuenta?{" "}
          <a
            href="/login"
            className="text-neutral-600 dark:text-neutral-300 hover:underline"
          >
            Inicia sesión
          </a>
        </p>
      </div>
    </div>
  );
}
