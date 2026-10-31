// frontend/src/utils/validation.ts

export const validation = {
  email: (email: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  },

  telephone: (tel: string): boolean => {
    const cleaned = tel.replace(/\D/g, "");
    return cleaned.length >= 8 && cleaned.length <= 15;
  },

  motDePasse: (mdp: string): boolean => {
    return mdp.length >= 8;
  },

  requis: (valeur: string | null | undefined): boolean => {
    return !!valeur && valeur.trim().length > 0;
  },
};