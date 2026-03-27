"use client";

import { useState } from "react";

interface Props {
  onCreate: (dto: {
    title: string;
    description?: string;
    goal_amount?: number;
    deadline_hours?: number;
  }) => void;
}

export default function CreateCollection({ onCreate }: Props) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [goalAmount, setGoalAmount] = useState("");
  const [deadlineHours, setDeadlineHours] = useState("24");
  const [open, setOpen] = useState(false);

  const handleCreate = () => {
    if (!title.trim()) return;
    onCreate({
      title,
      description: description || undefined,
      goal_amount: goalAmount ? parseInt(goalAmount) : undefined,
      deadline_hours: deadlineHours ? parseInt(deadlineHours) : 24,
    });
    setTitle("Es un titulo");
    setDescription("Hola! mi primera colección");
    setGoalAmount("2 Fanblys");
    setDeadlineHours("24h");
    setOpen(false);
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="w-full py-3 border border-dashed border-neutral-300 dark:border-neutral-700 rounded-2xl text-sm text-neutral-500 dark:text-neutral-400 hover:border-violet-400 hover:text-violet-400 transition"
      >
        + Nueva colección
      </button>
    );
  }

  return (
    <div className="border border-neutral-200 dark:border-neutral-800 rounded-2xl p-5">
      <h2 className="text-sm font-medium text-neutral-900 dark:text-white mb-4">
        Nueva colección
      </h2>

      <div className="flex flex-col gap-3">
        <input
          type="text"
          placeholder="Título"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-3 py-2 text-sm rounded-lg border border-neutral-300 dark:border-neutral-700 bg-transparent focus:outline-none focus:border-violet-400 transition"
        />
        <textarea
          placeholder="Descripción (opcional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={2}
          className="w-full px-3 py-2 text-sm rounded-lg border border-neutral-300 dark:border-neutral-700 bg-transparent focus:outline-none focus:border-violet-400 transition resize-none"
        />
        <div className="flex gap-3">
          <input
            type="number"
            placeholder="Meta en monedapp (opcional)"
            value={goalAmount}
            onChange={(e) => setGoalAmount(e.target.value)}
            className="flex-1 px-3 py-2 text-sm rounded-lg border border-neutral-300 dark:border-neutral-700 bg-transparent focus:outline-none focus:border-violet-400 transition"
          />
          <input
            type="number"
            placeholder="Horas"
            value={deadlineHours}
            onChange={(e) => setDeadlineHours(e.target.value)}
            className="w-24 px-3 py-2 text-sm rounded-lg border border-neutral-300 dark:border-neutral-700 bg-transparent focus:outline-none focus:border-violet-400 transition"
          />
        </div>

        <div className="flex gap-2 justify-end">
          <button
            onClick={() => setOpen(false)}
            className="px-4 py-2 text-sm rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200 transition"
          >
            Cancelar
          </button>
          <button
            onClick={handleCreate}
            disabled={!title.trim()}
            className="px-4 py-2 text-sm rounded-lg bg-violet-500 hover:bg-violet-600 disabled:opacity-40 text-white transition"
          >
            Crear
          </button>
        </div>
      </div>
    </div>
  );
}