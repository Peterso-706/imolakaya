// frontend/src/hooks/usePagination.ts
"use client";

import { useState } from "react";

export const usePagination = (initialPage = 1, initialTaille = 20) => {
  const [page, setPage] = useState(initialPage);
  const [taille, setTaille] = useState(initialTaille);

  const nextPage = () => setPage((p) => p + 1);
  const prevPage = () => setPage((p) => Math.max(1, p - 1));
  const goToPage = (p: number) => setPage(Math.max(1, p));
  const reset = () => setPage(1);

  return { page, taille, setPage, setTaille, nextPage, prevPage, goToPage, reset };
};