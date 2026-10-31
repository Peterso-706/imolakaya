"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

export const SearchBar = () => {
  const router = useRouter();
  const [q, setQ] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (q.trim()) params.set("q", q.trim());
    router.push(`/biens${params.toString() ? `?${params}` : ""}`);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg p-2 flex flex-col sm:flex-row gap-2 shadow-pop">
      <input
        type="text"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Ville, zone, mot-clé..."
        className="flex-1 px-4 py-3 text-imo-dark outline-none rounded-lg"
      />
      <button
        type="submit"
        className="bg-imo-green hover:bg-imo-green-600 text-white px-6 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition"
      >
        <Search size={18} />
        Rechercher
      </button>
    </form>
  );
};