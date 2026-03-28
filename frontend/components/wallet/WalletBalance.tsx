"use client";

import { useEffect, useState } from "react";
import { api } from "@/services/api";

export default function WalletBalance() {
  const [balance, setBalance] = useState<number | null>(null);

  useEffect(() => {
    const fetchWallet = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;
        const res = await api.get("/wallet", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBalance(res.data.balance ?? 0);
      } catch (err) {}
    };
    fetchWallet();
  }, []);

  if (balance === null) return null;

  return (
    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-violet-500/10 border border-violet-400/30 rounded-full">
      <span className="text-violet-400 text-xs font-medium">
        ⭐ {balance} fanblys
      </span>
    </div>
  );
}
