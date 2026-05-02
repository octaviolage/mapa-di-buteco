'use client'

import { ButecoCard, ButecoCardSkeleton } from './buteco-card'
import { useButecosStore } from '@/store/butecos-store'
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription } from '@/components/ui/empty'
import { UtensilsCrossed } from 'lucide-react'

export function ButecoList() {
  const { filteredButecos, filters } = useButecosStore()
  const butecos = filteredButecos()

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
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {butecos.map((buteco, index) => (
        <ButecoCard key={`${buteco.name}-${index}`} buteco={buteco} priority={index < 3} />
      ))}
    </div>
  )
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
