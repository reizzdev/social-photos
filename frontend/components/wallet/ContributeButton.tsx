"use client";

import { useState } from "react";
import { api } from "@/services/api";

interface Props {
  collectionId: string;
  goalAmount: number;
  currentAmount: number;
  completed: boolean;
  minContribution?: number;
  onContribute?: (newAmount: number) => void;
}

export default function ContributeButton({
  collectionId,
  goalAmount,
  currentAmount,
  completed,
  minContribution = 2,
  onContribute,
}: Props) {
  const [amount, setAmount] = useState(minContribution);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [open, setOpen] = useState(false);

  const handleContribute = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        setMessage("Inicia sesión para aportar");
        return;
      }
      const res = await api.post(
        "/wallet/contribute",
        { collection_id: collectionId, amount },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setMessage(`✅ Aportaste ${amount} fanblys. Saldo: ${res.data.new_balance}`);
      onContribute?.(currentAmount + amount);
      setOpen(false);
    } catch (err: any) {
      setMessage(err?.response?.data?.message || "Error al aportar");
    } finally {
      setLoading(false);
    }
  };

  if (completed)
    return (
      <div className="px-4 py-2 text-xs text-green-500 font-medium text-center">
        ✅ Meta completada
      </div>
    );

  return (
    <div className="px-4 pb-3">
      {message && (
        <p className="text-xs text-center mb-2 text-violet-400">{message}</p>
      )}
      {!open ? (
        <button
          onClick={() => setOpen(true)}
          className="w-full py-2 bg-violet-500 hover:bg-violet-600 text-white text-xs font-medium rounded-xl transition"
        >
          ⭐ Aportar desde {minContribution} fanblys
        </button>
      ) : (
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setAmount((v) => Math.max(minContribution, v - 1))}
              className="w-8 h-8 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 font-bold hover:bg-neutral-200 transition"
            >
              −
            </button>
            <span className="flex-1 text-center text-sm font-medium text-neutral-900 dark:text-white">
              {amount} fanblys
            </span>
            <button
              onClick={() => setAmount((v) => v + 1)}
              className="w-8 h-8 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 font-bold hover:bg-neutral-200 transition"
            >
              +
            </button>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setOpen(false)}
              className="flex-1 py-1.5 rounded-xl text-xs border border-neutral-200 dark:border-neutral-700 text-neutral-500 hover:bg-neutral-100 transition"
            >
              Cancelar
            </button>
            <button
              onClick={handleContribute}
              disabled={loading}
              className="flex-1 py-1.5 rounded-xl text-xs bg-violet-500 hover:bg-violet-600 disabled:opacity-40 text-white font-medium transition"
            >
              {loading ? "Aportando..." : "Confirmar"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}