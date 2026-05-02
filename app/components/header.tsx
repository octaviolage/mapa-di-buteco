'use client'

import { useState } from 'react'
import { Menu, Search, X, MapPin, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet'
import { useButecosStore } from '@/store/butecos-store'
import { useEffect, useRef } from 'react'
import { FilterDropdowns } from './filter-dropdowns'

export function Header() {
  const { filters, setSearch } = useButecosStore()
  const [localSearch, setLocalSearch] = useState(filters.search)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const debounceRef = useRef<NodeJS.Timeout | null>(null)
  
  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
    }
    debounceRef.current = setTimeout(() => {
      setSearch(localSearch)
    }, 300)
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current)
      }
    }
  }, [localSearch, setSearch])

  return (
    <header className="sticky top-0 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center gap-4 px-4">
        {/* Mobile Menu */}
        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <SheetTrigger asChild className="lg:hidden">
            <Button variant="ghost" size="icon" className="shrink-0">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-80 p-6 z-1000">
            <SheetTitle className="sr-only">Menu de navegação</SheetTitle>
            <div className="flex items-center gap-2 mb-8">
              <MapPin className="h-6 w-6 text-primary" />
              <span className="font-bold text-xl">Mapa di Buteco</span>
            </div>
            <nav className="flex flex-col gap-4">
              <a href="/sobre" className="text-lg font-medium hover:text-primary transition-colors">
                Sobre
              </a>
              <a 
                href="https://comidadibuteco.com.br" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-lg font-medium hover:text-primary transition-colors inline-flex items-center gap-2"
              >
                Ir para o site oficial
                <ExternalLink className="h-4 w-4" />
              </a>
            </nav>
          </SheetContent>
        </Sheet>

        {/* Logo */}
        <a href="/" className="flex items-center gap-2">
          <MapPin className="h-6 w-6 text-primary" />
          <span className="font-bold text-lg lg:text-xl hidden sm:inline">Mapa di Buteco</span>
          <span className="font-bold text-lg sm:hidden">MdB</span>
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-6 ml-6 p-6">
          <a href="/sobre" className="text-sm font-medium hover:text-primary transition-colors">
            Sobre
          </a>
          <a 
            href="https://comidadibuteco.com.br/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-sm font-medium hover:text-primary transition-colors inline-flex items-center gap-1"
          >
            Ir para o site oficial
            <ExternalLink className="h-3 w-3" />
          </a>
        </nav>

        {/* Search Bar */}
        <div className="flex-1 flex items-center justify-center max-w-xl">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Buscar buteco..."
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              className="pl-10 pr-10 h-10 w-full"
            />
            {localSearch && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
                onClick={() => setLocalSearch('')}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Desktop Filters */}
        <div className="hidden lg:flex items-center gap-2">
          <FilterDropdowns />
        </div>
      </div>
    </header>
  )
}
