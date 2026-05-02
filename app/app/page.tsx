'use client'

import { useEffect } from 'react'
import dynamic from 'next/dynamic'
import { Header } from '@/components/header'
import { ButecoList, ButecoListSkeleton } from '@/components/buteco-list'
import { MobileFilters } from '@/components/filter-dropdowns'
import { MobileToggle } from '@/components/mobile-toggle'
import { FeedbackButton } from '@/components/feedback-button'
import { useButecosStore } from '@/store/butecos-store'
import butecosData from '@/data/butecos.json'
import type { Buteco } from '@/types/buteco'

// Dynamic import for map to avoid SSR issues with Leaflet
const ButecoMap = dynamic(
  () => import('@/components/buteco-map').then((mod) => mod.ButecoMap),
  { 
    ssr: false,
    loading: () => (
      <div className="w-full h-full bg-muted animate-pulse rounded-lg flex items-center justify-center">
        <span className="text-muted-foreground">Carregando mapa...</span>
      </div>
    ),
  }
)

export default function HomePage() {
  const { setButecos, filteredButecos, viewMode } = useButecosStore()
  const butecos = filteredButecos()

  useEffect(() => {
    // Load butecos data on mount
    setButecos(butecosData as Buteco[])
  }, [setButecos])

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      {/* Mobile Filters */}
      {viewMode !== 'map' && (
        <div className="lg:hidden px-4 py-3 border-b bg-background sticky top-16 z-40">
          <MobileFilters />
        </div>
      )}

      {/* Stats bar */}
      <div className="px-4 py-3 border-b bg-muted/30">
        <div className="container">
          <p className="text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">{butecos.length} butecos</span>
            {' '}participantes do Comida di Buteco
          </p>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 flex flex-col lg:flex-row">
        {/* List Section */}
        <div 
          className={`
            flex-1 lg:w-1/2 lg:max-w-[60%] overflow-y-auto p-4
            ${viewMode === 'map' ? 'hidden lg:block' : 'block'}
          `}
          style={{ maxHeight: 'calc(100vh - 110px)' }}
        >
          <ButecoList />
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
            <ButecoMap />
          </div>
        </div>
      </main>

      {/* Mobile Toggle */}
      <MobileToggle />

      {/* Feedback Button */}
      <FeedbackButton />
    </div>
  )
}
