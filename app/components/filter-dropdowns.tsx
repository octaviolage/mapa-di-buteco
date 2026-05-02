'use client'

import { ChevronDown, X, Filter } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import { useButecosStore } from '@/store/butecos-store'

export function FilterDropdowns() {
  const {
    filters,
    setCity,
    setSuburbs,
    setDistricts,
    availableCities,
    availableSuburbs,
    availableDistricts,
    resetFilters,
  } = useButecosStore()

  const cities = availableCities()
  const suburbs = availableSuburbs()
  // const districts = availableDistricts()

  const hasActiveFilters = filters.city || filters.suburbs.length > 0 || filters.districts.length > 0

  const toggleSuburb = (suburb: string) => {
    const newSuburbs = filters.suburbs.includes(suburb)
      ? filters.suburbs.filter((s) => s !== suburb)
      : [...filters.suburbs, suburb]
    setSuburbs(newSuburbs)
  }

  // const toggleDistrict = (district: string) => {
  //   const newDistricts = filters.districts.includes(district)
  //     ? filters.districts.filter((d) => d !== district)
  //     : [...filters.districts, district]
  //   setDistricts(newDistricts)
  // }

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {/* City Filter */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant={filters.city ? "secondary" : "outline"} size="sm" className="gap-1">
            <span className="truncate max-w-25">
              {filters.city || 'Cidade'}
            </span>
            <ChevronDown className="h-4 w-4 shrink-0"/>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-56 max-h-72 overflow-y-auto">
          <DropdownMenuCheckboxItem
            checked={!filters.city}
            onCheckedChange={() => setCity(null)}
          >
            Todas as cidades
          </DropdownMenuCheckboxItem>
          <DropdownMenuSeparator />
          {cities.map((city) => (
            <DropdownMenuCheckboxItem
              key={city}
              checked={filters.city === city}
              onCheckedChange={() => setCity(city)}
            >
              {city}
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* District Filter (Regional) */}
      {/* <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant={filters.districts.length > 0 ? "secondary" : "outline"} 
            size="sm" 
            className="gap-1"
            disabled={!filters.city}
          >
            <span className="truncate max-w-25">
              {filters.districts.length > 0 
                ? `Regional (${filters.districts.length})`
                : 'Regional'}
            </span>
            <ChevronDown className="h-4 w-4 shrink-0" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-56 max-h-72 overflow-y-auto">
          {districts.length === 0 ? (
            <div className="px-2 py-1.5 text-sm text-muted-foreground">
              Selecione uma cidade primeiro
            </div>
          ) : (
            districts.map((district) => (
              <DropdownMenuCheckboxItem
                key={district}
                checked={filters.districts.includes(district)}
                onCheckedChange={() => toggleDistrict(district)}
              >
                {district}
              </DropdownMenuCheckboxItem>
            ))
          )}
        </DropdownMenuContent>
      </DropdownMenu> */}

      {/* Suburb Filter (Bairro) */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant={filters.suburbs.length > 0 ? "secondary" : "outline"} 
            size="sm" 
            className="gap-1"
            disabled={!filters.city}
          >
            <span className="truncate max-w-25">
              {filters.suburbs.length > 0 
                ? `Bairro (${filters.suburbs.length})`
                : 'Bairro'}
            </span>
            <ChevronDown className="h-4 w-4 shrink-0" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-56 max-h-72 overflow-y-auto">
          {suburbs.length === 0 ? (
            <div className="px-2 py-1.5 text-sm text-muted-foreground">
              Selecione uma cidade primeiro
            </div>
          ) : (
            suburbs.map((suburb) => (
              <DropdownMenuCheckboxItem
                key={suburb}
                checked={filters.suburbs.includes(suburb)}
                onCheckedChange={() => toggleSuburb(suburb)}
              >
                {suburb}
              </DropdownMenuCheckboxItem>
            ))
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Clear Filters */}
      {hasActiveFilters && (
        <Button variant="ghost" size="sm" onClick={resetFilters} className="gap-1">
          <X className="h-4 w-4" />
          Limpar
        </Button>
      )}
    </div>
  )
}

export function MobileFilters() {
  const {
    filters,
    setCity,
    setSuburbs,
    setDistricts,
    availableCities,
    availableSuburbs,
    availableDistricts,
    resetFilters,
  } = useButecosStore()

  const cities = availableCities()
  const suburbs = availableSuburbs()
  // const districts = availableDistricts()

  const hasActiveFilters = filters.city || filters.suburbs.length > 0 || filters.districts.length > 0
  const activeFilterCount = (filters.city ? 1 : 0) + 
    (filters.suburbs.length > 0 ? 1 : 0) + 
    (filters.districts.length > 0 ? 1 : 0)

  const toggleSuburb = (suburb: string) => {
    const newSuburbs = filters.suburbs.includes(suburb)
      ? filters.suburbs.filter((s) => s !== suburb)
      : [...filters.suburbs, suburb]
    setSuburbs(newSuburbs)
  }

  // const toggleDistrict = (district: string) => {
  //   const newDistricts = filters.districts.includes(district)
  //     ? filters.districts.filter((d) => d !== district)
  //     : [...filters.districts, district]
  //   setDistricts(newDistricts)
  // }

  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
      {/* Filter Button with count */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="gap-1 shrink-0">
            <Filter className="h-4 w-4" />
            Filtros
            {activeFilterCount > 0 && (
              <Badge variant="secondary" className="ml-1 h-5 w-5 p-0 flex items-center justify-center">
                {activeFilterCount}
              </Badge>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-72 p-4">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Cidade</label>
              <div className="flex flex-wrap gap-1">
                <Badge 
                  variant={!filters.city ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => setCity(null)}
                >
                  Todas
                </Badge>
                {cities.map((city) => (
                  <Badge
                    key={city}
                    variant={filters.city === city ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => setCity(city)}
                  >
                    {city}
                  </Badge>
                ))}
              </div>
            </div>

            {/* {filters.city && districts.length > 0 && (
              <div>
                <label className="text-sm font-medium mb-2 block">Regional</label>
                <div className="flex flex-wrap gap-1">
                  {districts.map((district) => (
                    <Badge
                      key={district}
                      variant={filters.districts.includes(district) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => toggleDistrict(district)}
                    >
                      {district}
                    </Badge>
                  ))}
                </div>
              </div>
            )} */}

            {filters.city && suburbs.length > 0 && (
              <div>
                <label className="text-sm font-medium mb-2 block">Bairro</label>
                <div className="flex flex-wrap gap-1 max-h-32 overflow-y-auto">
                  {suburbs.map((suburb) => (
                    <Badge
                      key={suburb}
                      variant={filters.suburbs.includes(suburb) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => toggleSuburb(suburb)}
                    >
                      {suburb}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {hasActiveFilters && (
              <Button variant="ghost" size="sm" onClick={resetFilters} className="w-full">
                <X className="h-4 w-4 mr-1" />
                Limpar filtros
              </Button>
            )}
          </div>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Quick filter chips */}
      {filters.city && (
        <Badge variant="secondary" className="shrink-0 gap-1">
          {filters.city}
          <X className="h-3 w-3 cursor-pointer" onClick={() => setCity(null)} />
        </Badge>
      )}
      {/* {filters.districts.map((district) => (
        <Badge key={district} variant="secondary" className="shrink-0 gap-1">
          {district}
          <X 
            className="h-3 w-3 cursor-pointer" 
            onClick={() => setDistricts(filters.districts.filter(d => d !== district))} 
          />
        </Badge>
      ))} */}
      {filters.suburbs.map((suburb) => (
        <Badge key={suburb} variant="secondary" className="shrink-0 gap-1">
          {suburb}
          <X 
            className="h-3 w-3 cursor-pointer" 
            onClick={() => setSuburbs(filters.suburbs.filter(s => s !== suburb))} 
          />
        </Badge>
      ))}
    </div>
  )
}
