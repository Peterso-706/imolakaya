"use client";

import { useState } from "react";
import { Input } from "@/components/shared/Input";
import { Button } from "@/components/shared/Button";
import { Roles } from "@/utils/constants";
import { UtilisateurAdminUpdate, UtilisateurCreate } from "@/types/utilisateur";

interface UserFormProps {
  mode: "creation" | "edition";
  initial?: {
    email?: string;
    nom?: string;
    prenom?: string | null;
    telephone?: string | null;
    est_actif?: boolean;
    est_verifie?: boolean;
  };
  onSubmitCreation?: (payload: UtilisateurCreate, roles: string[]) => Promise<void>;
  onSubmitEdition?: (payload: UtilisateurAdminUpdate) => Promise<void>;
  isLoading?: boolean;
  error?: string | null;
}

export const UserForm = ({
  mode,
  initial,
  onSubmitCreation,
  onSubmitEdition,
  isLoading = false,
  error,
}: UserFormProps) => {
  const [email, setEmail] = useState(initial?.email || "");
  const [motDePasse, setMotDePasse] = useState("");
  const [nom, setNom] = useState(initial?.nom || "");
  const [prenom, setPrenom] = useState(initial?.prenom || "");
  const [telephone, setTelephone] = useState(initial?.telephone || "");
  const [estActif, setEstActif] = useState(initial?.est_actif ?? true);
  const [estVerifie, setEstVerifie] = useState(initial?.est_verifie ?? false);
  const [role, setRole] = useState<string>(Roles.PROPRIETAIRE);

  const [localError, setLocalError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    if (mode === "creation") {
      if (!email.trim() || !nom.trim() || !motDePasse.trim()) {
        setLocalError("Email, nom et mot de passe sont obligatoires.");
        return;
      }
      if (motDePasse.length < 8) {
        setLocalError("Le mot de passe doit contenir au moins 8 caractères.");
        return;
      }
      if (!onSubmitCreation) return;
      await onSubmitCreation(
        {
          email: email.trim(),
          mot_de_passe: motDePasse,
          nom: nom.trim(),
          prenom: prenom.trim() || null,
          telephone: telephone.trim() || null,
        },
        [role]
      );
    } else {
      if (!nom.trim()) {
        setLocalError("Le nom est obligatoire.");
        return;
      }
      if (!onSubmitEdition) return;
      await onSubmitEdition({
        nom: nom.trim(),
        prenom: prenom.trim() || null,
        telephone: telephone.trim() || null,
        est_actif: estActif,
        est_verifie: estVerifie,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-imo-gray p-5 space-y-4">
      <h2 className="font-bold text-imo-dark text-lg border-b border-imo-gray pb-3">
        {mode === "creation" ? "Nouvel utilisateur" : "Modifier l'utilisateur"}
      </h2>

      <Input
        label="Email *"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="utilisateur@example.com"
        disabled={mode === "edition"}
      />

      {mode === "creation" && (
        <Input
          label="Mot de passe * (minimum 8 caractères)"
          type="password"
          value={motDePasse}
          onChange={(e) => setMotDePasse(e.target.value)}
          placeholder="••••••••"
        />
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Nom *"
          value={nom}
          onChange={(e) => setNom(e.target.value)}
          placeholder="Dupont"
        />
        <Input
          label="Prénom"
          value={prenom}
          onChange={(e) => setPrenom(e.target.value)}
          placeholder="Jean"
        />
      </div>

      <Input
        label="Téléphone"
        type="tel"
        value={telephone}
        onChange={(e) => setTelephone(e.target.value)}
        placeholder="+509 XXXX-XXXX"
      />

      {mode === "creation" && (
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-imo-dark">Rôle *</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full px-3 py-2 border border-imo-gray rounded-lg outline-none focus:border-imo-green focus:ring-2 focus:ring-imo-green/20 bg-white text-imo-dark"
          >
            <option value={Roles.PROPRIETAIRE}>Propriétaire</option>
            <option value={Roles.EMPLOYE}>Employé d&apos;agence</option>
            <option value={Roles.ADMIN}>Administrateur</option>
            <option value={Roles.ADMIN_PRINCIPAL}>Administrateur principal</option>
          </select>
        </div>
      )}

      {mode === "edition" && (
        <div className="flex flex-col gap-3 p-3 bg-imo-light rounded-lg">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={estActif}
              onChange={(e) => setEstActif(e.target.checked)}
              className="w-4 h-4 accent-imo-green"
            />
            <span className="text-sm text-imo-dark">Compte actif</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={estVerifie}
              onChange={(e) => setEstVerifie(e.target.checked)}
              className="w-4 h-4 accent-imo-green"
            />
            <span className="text-sm text-imo-dark">Email vérifié</span>
          </label>
        </div>
      )}

      {(localError || error) && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-3 py-2 rounded-lg">
          {localError || error}
        </div>
      )}

      <Button type="submit" variant="primary" isLoading={isLoading}>
        {mode === "creation" ? "Créer l'utilisateur" : "Enregistrer les modifications"}
      </Button>
    </form>
  );
};