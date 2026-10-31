// frontend/src/lib/cn.ts
// Simple utilitaire pour fusionner des classes conditionnelles
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}