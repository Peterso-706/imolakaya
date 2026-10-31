"use client";

import { useState } from "react";
import { Mail, Phone, Calendar, ChevronDown, ChevronUp } from "lucide-react";
import { ContactRead } from "@/types/interaction";
import { Badge } from "@/components/shared/Badge";
import { formatDateHeure } from "@/utils/format";

interface ContactListProps {
  contacts: ContactRead[];
}

const statutVariant = (statut: string): "success" | "warning" | "info" | "default" => {
  const map: Record<string, any> = {
    NOUVEAU: "warning",
    LU: "info",
    TRAITE: "success",
  };
  return map[statut] || "default";
};

const statutLabel = (statut: string): string => {
  const map: Record<string, string> = {
    NOUVEAU: "Nouveau",
    LU: "Lu",
    TRAITE: "Traité",
  };
  return map[statut] || statut;
};

export const ContactList = ({ contacts }: ContactListProps) => {
  const [ouvert, setOuvert] = useState<string | null>(null);

  return (
    <div className="bg-white rounded-lg border border-imo-gray overflow-hidden">
      <ul className="divide-y divide-imo-gray">
        {contacts.map((contact) => {
          const isOpen = ouvert === contact.id;
          return (
            <li key={contact.id} className="p-4">
              <div className="flex flex-col md:flex-row md:items-start gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <p className="font-semibold text-imo-dark">{contact.nom_visiteur}</p>
                    <Badge variant={statutVariant(contact.statut)}>
                      {statutLabel(contact.statut)}
                    </Badge>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Mail size={12} /> {contact.email_visiteur}
                    </span>
                    {contact.telephone_visiteur && (
                      <span className="flex items-center gap-1">
                        <Phone size={12} /> {contact.telephone_visiteur}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Calendar size={12} /> {formatDateHeure(contact.cree_le)}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setOuvert(isOpen ? null : contact.id)}
                  className="flex items-center gap-1 text-sm text-imo-green font-semibold hover:underline whitespace-nowrap"
                >
                  {isOpen ? (
                    <>Masquer <ChevronUp size={14} /></>
                  ) : (
                    <>Lire <ChevronDown size={14} /></>
                  )}
                </button>
              </div>

              {isOpen && (
                <div className="mt-3 bg-imo-light rounded-lg p-4 text-sm text-gray-700 whitespace-pre-line">
                  {contact.message}
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
};