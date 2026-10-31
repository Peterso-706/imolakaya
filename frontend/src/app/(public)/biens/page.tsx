"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Filters } from "@/components/public/Filters";
import { PropertyGrid } from "@/components/public/PropertyGrid";
import { Pagination } from "@/components/shared/Pagination";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { useBiens } from "@/hooks/useBiens";
import { BienSearchParams } from "@/types/bien";

function BiensContent() {
  const searchParams = useSearchParams();
  const initialParams: BienSearchParams = {
    q: searchParams.get("q") || undefined,
    type_operation: (searchParams.get("type_operation") as any) || undefined,
    page: 1,
    taille: 20,
  };

  const { data, isLoading, error, params, updateParams, changePage } = useBiens(initialParams);

  return (
    <div className="container-app py-8">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-imo-dark">Tous les biens</h1>
        <p className="text-sm text-gray-600">
          {data ? `${data.total} bien(s) trouvé(s)` : "Recherchez parmi nos propriétés"}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <Filters initialParams={params} onApply={(newParams) => updateParams(newParams)} />
        </div>
        <div className="lg:col-span-3">
          {isLoading && <LoadingSpinner size="lg" />}
          {error && <p className="text-red-600 text-sm">{error}</p>}
          {!isLoading && !error && data && (
            <>
              <PropertyGrid biens={data.items} />
              <Pagination
                currentPage={data.page}
                totalPages={data.pages}
                onPageChange={changePage}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function BiensPage() {
  return (
    <Suspense fallback={<LoadingSpinner size="lg" />}>
      <BiensContent />
    </Suspense>
  );
}