"use client";

import dynamic from "next/dynamic";
import type { Buteco } from "@/types/buteco";

const ButecoMap = dynamic(
  () => import("@/components/buteco-map").then((mod) => mod.ButecoMap),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full bg-muted animate-pulse rounded-lg flex items-center justify-center">
        <span className="text-muted-foreground">Carregando mapa...</span>
      </div>
    ),
  }
);

interface ButecoMapClientProps {
  allButecos: Buteco[];
}

export function ButecoMapClient({ allButecos }: ButecoMapClientProps) {
  return <ButecoMap allButecos={allButecos} />;
}
