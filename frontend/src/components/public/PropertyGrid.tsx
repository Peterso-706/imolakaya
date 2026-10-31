import { BienReadDetail } from "@/types/bien";
import { PropertyCard } from "./PropertyCard";
import { EmptyState } from "@/components/shared/EmptyState";

interface PropertyGridProps {
  biens: BienReadDetail[];
  emptyTitle?: string;
  emptyDescription?: string;
}

export const PropertyGrid = ({ biens, emptyTitle = "Aucun bien trouvé", emptyDescription = "Essayez de modifier vos critères de recherche." }: PropertyGridProps) => {
  if (!biens || biens.length === 0) {
    return <EmptyState title={emptyTitle} description={emptyDescription} />;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {biens.map((bien) => (
        <PropertyCard key={bien.id} bien={bien} />
      ))}
    </div>
  );
};