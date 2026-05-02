"use client";

import { ButecoList } from "@/components/buteco-list";
import { ButecoMapClient } from "@/components/buteco-map-client";
import { useButecosStore } from "@/store/butecos-store";
import type { Buteco } from "@/types/buteco";

interface MainContentClientProps {
  allButecos: Buteco[];
  initialButecos: Buteco[];
}

export function MainContentClient({ allButecos, initialButecos }: MainContentClientProps) {
  const { viewMode } = useButecosStore();
  return (
    <main className="flex-1 flex flex-col lg:flex-row">
      {/* List Section */}
      <div
        className={`
          flex-1 lg:w-1/2 lg:max-w-[60%] overflow-y-auto p-4
          ${viewMode === 'map' ? 'hidden lg:block' : 'block'}
        `}
        style={{ maxHeight: 'calc(100vh - 110px)' }}
      >
        <ButecoList allButecos={allButecos} initialButecos={initialButecos} />
      </div>

      {/* Map Section - Desktop: always visible, Mobile: toggle */}
      <div
        className={`
          lg:w-1/2 lg:min-w-[40%] lg:sticky
          ${viewMode === 'list' ? 'hidden lg:block' : 'block'}
        `}
        style={{ height: 'calc(100vh - 110px)' }}
      >
        <div className="h-full p-4 pt-0 lg:pt-4">
          <ButecoMapClient allButecos={allButecos} />
        </div>
      </div>
    </main>
  );
}
