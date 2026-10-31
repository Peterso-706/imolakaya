import React from "react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-2 mt-8 flex-wrap">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-1 rounded-lg border border-imo-gray text-sm font-medium text-imo-dark disabled:opacity-50 hover:bg-imo-gray-light transition"
      >
        Précédent
      </button>
      <span className="text-sm text-imo-dark px-3">
        Page <strong>{currentPage}</strong> sur {totalPages}
      </span>
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-1 rounded-lg border border-imo-gray text-sm font-medium text-imo-dark disabled:opacity-50 hover:bg-imo-gray-light transition"
      >
        Suivant
      </button>
    </div>
  );
};