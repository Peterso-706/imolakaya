"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Info } from "lucide-react";
import { referentielsService } from "@/services/referentiels.service";
import { CategorieRead } from "@/types/bien";
import { DataTable, Column } from "@/components/admin/DataTable";
import { Badge } from "@/components/shared/Badge";
import { Button } from "@/components/shared/Button";
import { Modal } from "@/components/shared/Modal";
import { Input } from "@/components/shared/Input";
import { useToast } from "@/contexts/ToastContext";
import { getErrorMessage } from "@/utils/errors";

export default function AdminCategoriesPage() {
  const { showToast } = useToast();
  const [categories, setCategories] = useState<CategorieRead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [editing, setEditing] = useState<CategorieRead | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Formulaire
  const [nom, setNom] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [icone, setIcone] = useState("");
  const [ordre, setOrdre] = useState(0);
  const [estActive, setEstActive] = useState(true);

  const charger = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Pas de GET /admin/categories : on utilise l'endpoint public
      const data = await referentielsService.listerCategoriesPubliques();
      setCategories(data);
    } catch (err: any) {
      setError(err.message || "Erreur lors du chargement");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    charger();
  }, []);

  const ouvrirCreation = () => {
    setEditing(null);
    setNom(""); setSlug(""); setDescription(""); setIcone(""); setOrdre(0); setEstActive(true);
    setIsOpen(true);
  };

  const ouvrirEdition = (cat: CategorieRead) => {
    setEditing(cat);
    setNom(cat.nom);
    setSlug(cat.slug);
    setDescription(cat.description || "");
    setIcone(cat.icone || "");
    setOrdre(cat.ordre);
    setEstActive(cat.est_active);
    setIsOpen(true);
  };

  const soumettre = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nom.trim() || !slug.trim()) {
      showToast("Nom et slug obligatoires", "error");
      return;
    }
    setIsSubmitting(true);
    try {
      if (editing) {
        await referentielsService.modifierCategorie(editing.id, {
          nom: nom.trim(),
          description: description.trim() || null,
          icone: icone.trim() || null,
          ordre,
          est_active: estActive,
        });
        showToast("Catégorie modifiée", "success");
      } else {
        await referentielsService.creerCategorie({
          nom: nom.trim(),
          slug: slug.trim(),
          description: description.trim() || null,
          icone: icone.trim() || null,
          ordre,
        });
        showToast("Catégorie créée", "success");
      }
      setIsOpen(false);
      charger();
    } catch (err) {
      showToast(getErrorMessage(err), "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const columns: Column<CategorieRead>[] = [
    {
      header: "Catégorie",
      accessor: (c) => (
        <div>
          <p className="font-semibold text-imo-dark">
            {c.icone && <span className="mr-1">{c.icone}</span>}
            {c.nom}
          </p>
          <p className="text-xs text-gray-500">/{c.slug}</p>
        </div>
      ),
    },
    {
      header: "Description",
      accessor: (c) => (
        <span className="text-sm text-gray-600 line-clamp-1">
          {c.description || "—"}
        </span>
      ),
    },
    {
      header: "Ordre",
      accessor: (c) => <span className="text-sm">{c.ordre}</span>,
    },
    {
      header: "Statut",
      accessor: (c) => (
        <Badge variant={c.est_active ? "success" : "danger"}>
          {c.est_active ? "Active" : "Inactive"}
        </Badge>
      ),
    },
    {
      header: "",
      className: "text-right",
      accessor: (c) => (
        <button
          onClick={() => ouvrirEdition(c)}
          className="inline-flex p-2 rounded-lg text-gray-500 hover:text-imo-green hover:bg-imo-green-50 transition"
        >
          <Pencil size={16} />
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-imo-dark">Catégories</h1>
          <p className="text-sm text-gray-600">
            {categories.length} catégorie(s) active(s)
          </p>
        </div>
        <Button variant="primary" onClick={ouvrirCreation}>
          <Plus size={16} /> Nouvelle catégorie
        </Button>
      </div>

      <div className="bg-blue-50 border border-blue-200 text-blue-800 rounded-lg p-4 flex gap-3">
        <Info size={20} className="flex-shrink-0 mt-0.5" />
        <div className="text-sm">
          <p className="font-semibold mb-1">Information technique</p>
          <p>
            Cette page affiche les catégories <strong>actives</strong> via l&apos;endpoint public
            (<code className="bg-white px-1 rounded">GET /public/categories</code>). Les catégories inactives
            ne sont visibles que par un endpoint admin dédié (à ajouter côté backend).
          </p>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={categories}
        isLoading={isLoading}
        error={error}
        keyExtractor={(c) => c.id}
        emptyTitle="Aucune catégorie"
        emptyDescription="Créez votre première catégorie de biens."
      />

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title={editing ? "Modifier la catégorie" : "Nouvelle catégorie"}
      >
        <form onSubmit={soumettre} className="space-y-4">
          <Input
            label="Nom *"
            value={nom}
            onChange={(e) => setNom(e.target.value)}
            placeholder="Maison"
          />
          <Input
            label="Slug *"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="maison"
            disabled={!!editing}
          />
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-imo-dark">Description</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description de la catégorie..."
              className="w-full px-3 py-2 border border-imo-gray rounded-lg outline-none focus:border-imo-green focus:ring-2 focus:ring-imo-green/20 resize-none"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Icône (emoji ou nom)"
              value={icone}
              onChange={(e) => setIcone(e.target.value)}
              placeholder="🏠"
            />
            <Input
              label="Ordre d'affichage"
              type="number"
              value={ordre}
              onChange={(e) => setOrdre(Number(e.target.value))}
            />
          </div>
          {editing && (
            <label className="flex items-center gap-3 cursor-pointer p-3 bg-imo-light rounded-lg">
              <input
                type="checkbox"
                checked={estActive}
                onChange={(e) => setEstActive(e.target.checked)}
                className="w-4 h-4 accent-imo-green"
              />
              <span className="text-sm text-imo-dark">Catégorie active</span>
            </label>
          )}
          <div className="flex gap-3 justify-end pt-2">
            <Button type="button" variant="ghost" onClick={() => setIsOpen(false)}>
              Annuler
            </Button>
            <Button type="submit" variant="primary" isLoading={isSubmitting}>
              {editing ? "Enregistrer" : "Créer"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}