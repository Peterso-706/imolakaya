"use client";

import { useEffect, useState } from "react";
import { biensService } from "@/services/biens.service";

export default function StatsSection() {
  const [stats, setStats] = useState({ biens: 0, ventes: 0, locations: 0 });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [all, ventes, locations] = await Promise.all([
          biensService.rechercher({ taille: 1 }),
          biensService.rechercher({ taille: 1, type_operation: "VENTE" as any }),
          biensService.rechercher({ taille: 1, type_operation: "LOCATION" as any }),
        ]);
        setStats({
          biens: all.total,
          ventes: ventes.total,
          locations: locations.total,
        });
      } catch {
        // silencieux
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const items = [
    { label: "Biens disponibles", value: stats.biens, color: "text-imo-green" },
    { label: "À vendre", value: stats.ventes, color: "text-imo-yellow" },
    { label: "À louer", value: stats.locations, color: "text-imo-green" },
  ];

  return (
    <section className="bg-white py-12 border-y border-imo-gray">
      <div className="container-app">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
          {items.map((item) => (
            <div key={item.label}>
              <div className={`text-4xl font-bold ${item.color} mb-2`}>
                {isLoading ? "—" : item.value.toLocaleString("fr-FR")}
              </div>
              <div className="text-sm text-gray-600">{item.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}