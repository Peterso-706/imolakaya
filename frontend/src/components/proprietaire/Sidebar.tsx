"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  LayoutDashboard,
  Building2,
  Megaphone,
  CreditCard,
  MessageSquare,
  Bell,
  Heart,
  User,
  LogOut,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const liens = [
  { href: "/proprietaire/dashboard", label: "Tableau de bord", icon: LayoutDashboard },
  { href: "/proprietaire/biens", label: "Mes biens", icon: Building2 },
  { href: "/proprietaire/annonces", label: "Mes annonces", icon: Megaphone },
  { href: "/proprietaire/paiements", label: "Mes paiements", icon: CreditCard },
  { href: "/proprietaire/contacts", label: "Mes contacts", icon: MessageSquare },
  { href: "/proprietaire/notifications", label: "Notifications", icon: Bell },
  { href: "/proprietaire/favoris", label: "Favoris", icon: Heart },
  { href: "/proprietaire/profil", label: "Mon profil", icon: User },
];

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { logout } = useAuth();

  const NavLinks = () => (
    <nav className="flex flex-col gap-1">
      {liens.map((lien) => {
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
            <Icon size={18} />
            {lien.label}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <>
      {/* Bouton mobile pour ouvrir le menu */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 bg-imo-dark text-white p-2 rounded-lg shadow-lg"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Menu"
      >
        {isOpen ? <X size={22} /> : <Menu size={22} />}
      </button>

      {/* Overlay mobile */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:sticky top-0 left-0 h-screen w-64 bg-imo-dark text-white z-40 flex flex-col transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="p-5 border-b border-imo-green-800">
          <Link href="/" className="text-xl font-bold text-imo-green">
            ImoLakaya
          </Link>
          <p className="text-xs text-gray-400 mt-1">Espace propriétaire</p>
        </div>

        <div className="flex-1 overflow-y-auto p-3">
          <NavLinks />
        </div>

        <div className="p-3 border-t border-imo-green-800">
          <button
            onClick={() => logout(true)}
            className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm font-medium text-red-300 hover:bg-red-600 hover:text-white transition"
          >
            <LogOut size={18} />
            Déconnexion
          </button>
        </div>
      </aside>
    </>
  );
}