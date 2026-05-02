'use client'

import { create } from 'zustand'
import type { Buteco, FilterState } from '@/types/buteco'

interface ButecosState {
  butecos: Buteco[]
  filters: FilterState
  selectedButeco: Buteco | null
  highlightedButeco: Buteco | null
  viewMode: 'list' | 'map'
  selectionSource: 'list' | 'map' | null
  
  // Actions
  setButecos: (butecos: Buteco[]) => void
  setSearch: (search: string) => void
  setCity: (city: string | null) => void
  setSuburbs: (suburbs: string[]) => void
  setDistricts: (districts: string[]) => void
  setSelectedButeco: (buteco: Buteco | null, source?: 'list' | 'map') => void
  setHighlightedButeco: (buteco: Buteco | null) => void
  setViewMode: (mode: 'list' | 'map') => void
  resetFilters: () => void
  
  // Computed
  filteredButecos: () => Buteco[]
  availableCities: () => string[]
  availableSuburbs: () => string[]
  availableDistricts: () => string[]
}

const initialFilters: FilterState = {
  search: '',
  city: null,
  suburbs: [],
  districts: [],
}

export const useButecosStore = create<ButecosState>((set, get) => ({
  butecos: [],
  filters: initialFilters,
  selectedButeco: null,
  highlightedButeco: null,
  viewMode: 'list',
  selectionSource: null,

  setButecos: (butecos) => set({ butecos }),
  
  setSearch: (search) => set((state) => ({
    filters: { ...state.filters, search }
  })),
  
  setCity: (city) => set((state) => ({
    filters: { ...state.filters, city, suburbs: [], districts: [] }
  })),
  
  setSuburbs: (suburbs) => set((state) => ({
    filters: { ...state.filters, suburbs }
  })),
  
  setDistricts: (districts) => set((state) => ({
    filters: { ...state.filters, districts }
  })),
  
  setSelectedButeco: (selectedButeco, source = 'list') => {
    // Detecta se está no mobile pelo tamanho da tela
    if (typeof window !== 'undefined') {
      const isMobile = window.innerWidth < 1024;
      const { viewMode, setViewMode } = get();
      if (isMobile && viewMode === 'list' && selectedButeco && source === 'list') {
        setViewMode('map');
      }
    }
    set({
      selectedButeco,
      selectionSource: selectedButeco ? source : null,
    });
  },
  
  setHighlightedButeco: (highlightedButeco) => set({ highlightedButeco }),
  
  setViewMode: (viewMode) => set({ viewMode }),
  
  resetFilters: () => set({ filters: initialFilters }),

  filteredButecos: () => {
    const { butecos, filters } = get()
    
    return butecos.filter((buteco) => {
      // Filter by search term
      if (filters.search) {
        const searchLower = filters.search.toLowerCase()
        const nameMatch = buteco.name.toLowerCase().includes(searchLower)
        const addressMatch = buteco.address.toLowerCase().includes(searchLower)
        if (!nameMatch && !addressMatch) return false
      }
      
      // Filter by city
      if (filters.city && buteco.city !== filters.city) {
        return false
      }
      
      // Filter by suburbs (multi-select)
      if (filters.suburbs.length > 0) {
        if (!buteco.suburb || !filters.suburbs.includes(buteco.suburb)) {
          return false
        }
      }
      
      // Filter by districts (multi-select)
      if (filters.districts.length > 0) {
        if (!buteco.district || !filters.districts.includes(buteco.district)) {
          return false
        }
      }
      
      return true
    })
  },

  availableCities: () => {
    const { butecos } = get()
    const cities = new Set<string>()
    butecos.forEach((b) => {
      if (b.city) cities.add(b.city)
    })
    return Array.from(cities).sort()
  },

  availableSuburbs: () => {
    const { butecos, filters } = get()
    const suburbs = new Set<string>()
    butecos.forEach((b) => {
      if (b.suburb && (!filters.city || b.city === filters.city)) {
        suburbs.add(b.suburb)
      }
    })
    return Array.from(suburbs).sort()
  },

  availableDistricts: () => {
    const { butecos, filters } = get()
    const districts = new Set<string>()
    butecos.forEach((b) => {
      if (b.district && (!filters.city || b.city === filters.city)) {
        districts.add(b.district)
      }
    })
    return Array.from(districts).sort()
  },
}))
