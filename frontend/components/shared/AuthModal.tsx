"use client";

interface AuthModalProps {
  onClose: () => void;
}

export default function AuthModal({ onClose }: AuthModalProps) {
  return (
    <div
      className="fixed inset-0 bg-black/60 flex justify-center items-center z-[2000]"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-2xl p-8 w-80 text-center shadow-none"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-950 flex items-center justify-center mx-auto mb-5">
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-blue-500"
          >
            <rect x="3" y="11" width="18" height="11" rx="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
        </div>

        <h2 className="text-lg font-medium text-neutral-900 dark:text-white mb-2">
          Contenido privado
        </h2>
        <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-6 leading-relaxed">
          Crea una cuenta o inicia sesión para ver fotos privadas y seguir a
          otros usuarios.
        </p>

        <div className="flex flex-col gap-2 mb-4">
          <a href="/register">
            <button className="w-full py-2.5 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-lg text-sm font-medium hover:opacity-90 transition">
              Crear cuenta
            </button>
          </a>
          <a href="/login">
            <button className="w-full py-2.5 bg-transparent border border-neutral-300 dark:border-neutral-600 text-neutral-900 dark:text-white rounded-lg text-sm hover:bg-neutral-50 dark:hover:bg-neutral-800 transition">
              Iniciar sesión
            </button>
          </a>
        </div>

        <button
          onClick={onClose}
          className="text-xs text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 transition"
        >
          Cerrar
        </button>
      </div>
    </div>
  );
}
