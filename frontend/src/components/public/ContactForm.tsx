"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Send } from "lucide-react";
import { contactCreateSchema, ContactCreateFormData } from "@/forms/contact.schema";
import { useContactForm } from "@/hooks/useContactForm";
import { Input } from "@/components/shared/Input";
import { Button } from "@/components/shared/Button";

interface ContactFormProps {
  bienId: string;
  bienTitre?: string;
}

export const ContactForm = ({ bienId, bienTitre }: ContactFormProps) => {
  const { envoyer, isSubmitting, isSuccess, error, reset } = useContactForm();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset: resetForm,
  } = useForm<ContactCreateFormData>({
    resolver: zodResolver(contactCreateSchema),
    defaultValues: {
      bien_id: bienId,
      nom_visiteur: "",
      email_visiteur: "",
      telephone_visiteur: "",
      message: "",
    },
  });

  const onSubmit = async (data: ContactCreateFormData) => {
    const ok = await envoyer({
      ...data,
      bien_id: bienId,
      telephone_visiteur: data.telephone_visiteur || null,
    });
    if (ok) {
      resetForm();
    }
  };

  if (isSuccess) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
        <p className="font-semibold text-green-800 mb-2">Message envoyé !</p>
        <p className="text-sm text-green-700 mb-4">
          Le propriétaire recevra votre demande et vous contactera bientôt.
        </p>
        <Button variant="ghost" onClick={reset} size="sm">
          Envoyer un autre message
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <h3 className="text-lg font-bold text-imo-dark">Contacter le propriétaire</h3>
      {bienTitre && (
        <p className="text-sm text-gray-600">
          À propos de : <strong>{bienTitre}</strong>
        </p>
      )}

      <Input
        label="Votre nom"
        placeholder="Jean Dupont"
        error={errors.nom_visiteur?.message}
        {...register("nom_visiteur")}
      />

      <Input
        label="Votre email"
        type="email"
        placeholder="jean@example.com"
        error={errors.email_visiteur?.message}
        {...register("email_visiteur")}
      />

      <Input
        label="Votre téléphone (optionnel)"
        type="tel"
        placeholder="+509 XXXX-XXXX"
        error={errors.telephone_visiteur?.message}
        {...register("telephone_visiteur")}
      />

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-imo-dark">Message</label>
        <textarea
          rows={4}
          placeholder="Bonjour, je suis intéressé par ce bien..."
          className={`w-full px-3 py-2 border rounded-lg outline-none transition-all bg-white text-imo-dark placeholder:text-gray-400 resize-none ${
            errors.message
              ? "border-red-500 focus:ring-2 focus:ring-red-200"
              : "border-imo-gray focus:border-imo-green focus:ring-2 focus:ring-imo-green/20"
          }`}
          {...register("message")}
        />
        {errors.message && <span className="text-xs text-red-500">{errors.message.message}</span>}
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <Button type="submit" variant="primary" fullWidth isLoading={isSubmitting}>
        <Send size={16} />
        Envoyer le message
      </Button>
    </form>
  );
};