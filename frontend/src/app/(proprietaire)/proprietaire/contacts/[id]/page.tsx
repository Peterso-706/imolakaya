"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Mail, Phone, Calendar } from "lucide-react";
import { contactsService } from "@/services/contacts.service";
import { ContactRead } from "@/types/interaction";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { Badge } from "@/components/shared/Badge";
import { formatDateHeure } from "@/utils/format";

export default function ContactDetailPage() {
  const params = useParams<{ id: string }>();
  const [contact, setContact] = useState<ContactRead | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!params?.id) return;
    (async () => {
      try {
        const data = await contactsService.getContact(params.id);
        setContact(data);
      } catch {
        setError("Contact introuvable.");
      } finally {
        setIsLoading(false);
      }
    })();
  }, [params?.id]);

  if (isLoading) return <LoadingSpinner size="lg" />;
  if (error || !contact) {
    return (
      <div className="text-center py-16">
        <p className="text-red-600 mb-4">{error || "Contact introuvable"}</p>
        <Link href="/proprietaire/contacts">
          <button className="text-imo-green font-semibold hover:underline">← Retour aux contacts</button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Link href="/proprietaire/contacts" className="inline-flex items-center gap-1 text-sm text-gray-600 hover:text-imo-green">
        <ArrowLeft size={14} /> Retour aux contacts
      </Link>
      <div className="bg-white rounded-lg border border-imo-gray p-6 space-y-4">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold text-imo-dark">{contact.nom_visiteur}</h1>
          <Badge variant="info">{contact.statut}</Badge>
        </div>
        <div className="flex flex-wrap gap-4 text-sm text-gray-600">
          <span className="flex items-center gap-1"><Mail size={14} /> {contact.email_visiteur}</span>
          {contact.telephone_visiteur && (
            <span className="flex items-center gap-1"><Phone size={14} /> {contact.telephone_visiteur}</span>
          )}
          <span className="flex items-center gap-1"><Calendar size={14} /> {formatDateHeure(contact.cree_le)}</span>
        </div>
        <div className="bg-imo-light rounded-lg p-4 text-sm text-gray-700 whitespace-pre-line">
          {contact.message}
        </div>
      </div>
    </div>
  );
}