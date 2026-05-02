'use client'


import { useState, useEffect } from 'react';
import { ButecoCard, ButecoCardSkeleton } from './buteco-card';
import { useButecosStore } from '@/store/butecos-store';
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription } from '@/components/ui/empty';
import { UtensilsCrossed } from 'lucide-react';

interface ButecoListProps {
  allButecos: any[];
  initialButecos: any[];
}

export function ButecoList({ allButecos, initialButecos }: ButecoListProps) {
  const { filteredButecos, filters, setButecos } = useButecosStore();
  const [visibleCount, setVisibleCount] = useState(initialButecos.length);
  const butecos = filteredButecos();

  // Inicializa o store com todos os butecos (SSR hydration)
  useEffect(() => {
    setButecos(allButecos);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Aplica lazy load apenas na lista (não no mapa)
  const visibleButecos = butecos.slice(0, visibleCount);
  const hasMore = visibleCount < butecos.length;

  // Handler para carregar mais itens
  const handleLoadMore = () => {
    setVisibleCount((prev) => Math.min(prev + 20, butecos.length));
  };

  // Infinite scroll (opcional, pode ser removido se preferir só botão)
  useEffect(() => {
    if (!hasMore) return;
    const onScroll = () => {
      const scrollY = window.scrollY || window.pageYOffset;
      const windowHeight = window.innerHeight;
      const docHeight = document.body.offsetHeight;
      if (scrollY + windowHeight >= docHeight - 200) {
        handleLoadMore();
      }
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, [hasMore, butecos.length]);

  if (butecos.length === 0) {
    return (
      <Empty className="min-h-[300px]">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <UtensilsCrossed className="h-6 w-6" />
          </EmptyMedia>
          <EmptyTitle>Nenhum buteco encontrado</EmptyTitle>
          <EmptyDescription>
            {filters.search || filters.city || filters.suburbs.length > 0 || filters.districts.length > 0
              ? "Tente ajustar os filtros para encontrar mais resultados"
              : "Carregando butecos..."}
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {visibleButecos.map((buteco, index) => (
          <ButecoCard key={`${buteco.name}-${index}`} buteco={buteco} priority={index < 3} />
        ))}
      </div>
      {hasMore && (
        <div className="flex justify-center mt-4">
          <button
            className="px-4 py-2 rounded bg-primary text-white hover:bg-primary/80 transition"
            onClick={handleLoadMore}
          >
            Carregar mais
          </button>
        </div>
      )}
    </>
  );
}

export function ButecoListSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <ButecoCardSkeleton key={i} />
      ))}
    </div>
  )
}
