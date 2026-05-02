'use client'

import { List, Map } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useButecosStore } from '@/store/butecos-store'

export function MobileToggle() {
  const { viewMode, setViewMode, filteredButecos } = useButecosStore()
  const count = filteredButecos().length

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-1000 lg:hidden">
      <div className="bg-background border rounded-full shadow-lg flex items-center p-1 gap-1">
        <Button
          variant={viewMode === 'list' ? 'default' : 'ghost'}
          size="sm"
          className="rounded-full gap-2 px-4"
          onClick={() => setViewMode('list')}
        >
          <List className="h-4 w-4" />
          Lista ({count})
        </Button>
        <Button
          variant={viewMode === 'map' ? 'default' : 'ghost'}
          size="sm"
          className="rounded-full gap-2 px-4"
          onClick={() => setViewMode('map')}
        >
          <Map className="h-4 w-4" />
          Mapa
        </Button>
      </div>
    </div>
  )
}
