"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, Search, User } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, logout } = useAuth();

  return (
    <header className="bg-imo-dark text-white sticky top-0 z-50 shadow-card">
      <div className="container-app h-16 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-imo-green">
          ImoLakaya
        </Link>

        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
          <Link href="/" className="hover:text-imo-green transition">Accueil</Link>
          <Link href="/biens" className="hover:text-imo-green transition">Biens</Link>
          <Link href="/rechercher" className="hover:text-imo-green transition">Rechercher</Link>
          <Link href="/a-propos" className="hover:text-imo-green transition">À propos</Link>
          <Link href="/contact" className="hover:text-imo-green transition">Contact</Link>
        </nav>

        <div className="hidden md:flex items-center space-x-4">
          <Link href="/rechercher" className="p-2 hover:text-imo-green transition" aria-label="Rechercher">
            <Search size={20} />
          </Link>
          {isAuthenticated ? (
            <>
              <Link href="/proprietaire/dashboard" className="flex items-center gap-2 bg-imo-green hover:bg-imo-green-600 text-white px-4 py-2 rounded-lg font-semibold transition">
                <User size={18} />
                <span>Mon espace</span>
              </Link>
              <button onClick={() => logout(true)} className="text-sm text-gray-300 hover:text-white transition">
                Déconnexion
              </button>
            </>
          ) : (
            <>
              <Link href="/proprietaire/connexion" className="flex items-center gap-2 bg-imo-green hover:bg-imo-green-600 text-white px-4 py-2 rounded-lg font-semibold transition">
                <User size={18} />
                <span>Connexion</span>
              </Link>
              <Link href="/proprietaire/inscription" className="bg-imo-yellow hover:bg-imo-yellow-dark text-imo-dark px-4 py-2 rounded-lg font-bold transition">
                S&apos;inscrire
              </Link>
            </>
          )}
        </div>

        <button className="md:hidden text-white" onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Menu">
          {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {isMenuOpen && (
        <div className="md:hidden bg-imo-dark border-t border-imo-green-800 pb-4">
          <nav className="flex flex-col space-y-3 px-4 pt-4 text-sm font-medium">
            <Link href="/" onClick={() => setIsMenuOpen(false)}>Accueil</Link>
            <Link href="/biens" onClick={() => setIsMenuOpen(false)}>Biens</Link>
            <Link href="/rechercher" onClick={() => setIsMenuOpen(false)}>Rechercher</Link>
            <Link href="/a-propos" onClick={() => setIsMenuOpen(false)}>À propos</Link>
            <Link href="/contact" onClick={() => setIsMenuOpen(false)}>Contact</Link>
            <hr className="border-imo-green-800 my-2" />
            {isAuthenticated ? (
              <>
                <Link href="/proprietaire/dashboard" onClick={() => setIsMenuOpen(false)} className="text-imo-green font-bold">
                  Mon espace
                </Link>
                <button onClick={() => { logout(true); setIsMenuOpen(false); }} className="text-left text-red-400">
                  Déconnexion
                </button>
              </>
            ) : (
              <>
                <Link href="/proprietaire/connexion" onClick={() => setIsMenuOpen(false)} className="bg-imo-green text-white text-center px-4 py-2 rounded-lg font-semibold">
                  Connexion
                </Link>
                <Link href="/proprietaire/inscription" onClick={() => setIsMenuOpen(false)} className="bg-imo-yellow text-imo-dark text-center px-4 py-2 rounded-lg font-bold">
                  S&apos;inscrire
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}