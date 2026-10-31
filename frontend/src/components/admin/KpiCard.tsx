import { ReactNode } from "react";
import Link from "next/link";

interface KpiCardProps {
  label: string;
  value: number | string;
  icon: ReactNode;
  href?: string;
  color?: "green" | "yellow" | "blue" | "purple" | "red";
}

const colorMap = {
  green: { bg: "bg-imo-green-50", text: "text-imo-green" },
  yellow: { bg: "bg-yellow-50", text: "text-yellow-600" },
  blue: { bg: "bg-blue-50", text: "text-blue-600" },
  purple: { bg: "bg-purple-50", text: "text-purple-600" },
  red: { bg: "bg-red-50", text: "text-red-600" },
};

export const KpiCard = ({
  label,
  value,
  icon,
  href,
  color = "green",
}: KpiCardProps) => {
  const c = colorMap[color];

  const contenu = (
    <div className="bg-white rounded-lg border border-imo-gray p-5 hover:shadow-pop transition-shadow">
      <div className={`w-10 h-10 rounded-lg ${c.bg} flex items-center justify-center mb-3 ${c.text}`}>
        {icon}
      </div>
      <div className="text-2xl font-bold text-imo-dark">{value}</div>
      <div className="text-xs text-gray-600 mt-1">{label}</div>
    </div>
  );

  if (href) return <Link href={href}>{contenu}</Link>;
  return contenu;
};