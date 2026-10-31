"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  LayoutDashboard,
  Users,
  UserCog,
  Building2,
  Megaphone,
  CreditCard,
  Briefcase,
  UserPlus,
  FolderTree,
  MapPin,
  BarChart3,
  ShieldCheck,
  Settings,
  LogOut,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const groupes = [
  {
    titre: "Vue d'ensemble",
    liens: [
      { href: "/admin/dashboard", label: "Tableau de bord", icon: LayoutDashboard },
    ],
  },
  {
    titre: "Utilisateurs",
    liens: [
      { href: "/admin/utilisateurs", label: "Utilisateurs", icon: Users },
      { href: "/admin/proprietaires", label: "Propriétaires", icon: UserCog },
    ],
  },
  {
    titre: "Immobilier",
    liens: [
      { href: "/admin/biens", label: "Biens", icon: Building2 },
      { href: "/admin/annonces", label: "Annonces", icon: Megaphone },
    ],
  },
  {
    titre: "Finances",
    liens: [
      { href: "/admin/paiements", label: "Paiements", icon: CreditCard },
    ],
  },
  {
    titre: "Structure",
    liens: [
      { href: "/admin/agences", label: "Agences", icon: Briefcase },
      { href: "/admin/employes", label: "Employés", icon: UserPlus },
      { href: "/admin/categories", label: "Catégories", icon: FolderTree },
      { href: "/admin/localisations", label: "Localisations", icon: MapPin },
    ],
  },
  {
    titre: "Supervision",
    liens: [
      { href: "/admin/rapports", label: "Rapports", icon: BarChart3 },
      { href: "/admin/audit", label: "Journal d'audit", icon: ShieldCheck },
      { href: "/admin/parametres", label: "Paramètres", icon: Settings },
    ],
  },
];

export default function AdminSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { logout } = useAuth();

  return (
    <>
      <button
        className="lg:hidden fixed top-4 left-4 z-50 bg-imo-dark text-white p-2 rounded-lg shadow-lg"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Menu"
      >
        {isOpen ? <X size={22} /> : <Menu size={22} />}
      </button>

      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        className={`fixed lg:sticky top-0 left-0 h-screen w-64 bg-imo-dark text-white z-40 flex flex-col transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="p-5 border-b border-imo-green-800">
          <Link href="/admin/dashboard" className="text-xl font-bold text-imo-green">
            ImoLakaya
          </Link>
          <p className="text-xs text-gray-400 mt-1">Administration</p>
        </div>

        <nav className="flex-1 overflow-y-auto p-3 space-y-4">
          {groupes.map((groupe) => (
            <div key={groupe.titre}>
              <p className="px-3 mb-1 text-[10px] font-semibold text-gray-500 uppercase tracking-wider">
                {groupe.titre}
              </p>
              <div className="flex flex-col gap-0.5">
                {groupe.liens.map((lien) => {
                  const Icon = lien.icon;
                  const actif = pathname === lien.href || pathname.startsWith(lien.href + "/");
                  return (
                    <Link
                      key={lien.href}
                      href={lien.href}
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition ${
                        actif
                          ? "bg-imo-green text-white"
                          : "text-gray-300 hover:bg-imo-green-800 hover:text-white"
                      }`}
                    >
                      <Icon size={16} />
                      {lien.label}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="p-3 border-t border-imo-green-800">
          <button
            onClick={() => logout(true)}
            className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm font-medium text-red-300 hover:bg-red-600 hover:text-white transition"
          >
            <LogOut size={16} />
            Déconnexion
          </button>
        </div>
      </aside>
    </>
  );
}