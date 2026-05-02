'use client'

import Image from 'next/image'
import { MapPin, ExternalLink } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import type { Buteco } from '@/types/buteco'
import { useButecosStore } from '@/store/butecos-store'
import { cn } from '@/lib/utils'

interface ButecoCardProps {
  buteco: Buteco
  priority?: boolean
}

export function ButecoCard({ buteco, priority = false }: ButecoCardProps) {
  const { selectedButeco, highlightedButeco, setSelectedButeco, setHighlightedButeco } = useButecosStore()
  
  const isSelected = selectedButeco?.name === buteco.name
  const isHighlighted = highlightedButeco?.name === buteco.name

  const handleClick = () => {
    setSelectedButeco(buteco, 'list')
  }

  const handleMouseEnter = () => {
    setHighlightedButeco(buteco)
  }

  const handleMouseLeave = () => {
    setHighlightedButeco(null)
  }

  return (
    <Card 
      className={cn(
        "overflow-hidden cursor-pointer transition-all duration-200 hover:shadow-lg",
        isSelected && "ring-2 ring-primary shadow-lg",
        isHighlighted && !isSelected && "ring-1 ring-primary/50 shadow-md"
      )}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="relative aspect-16/10 overflow-hidden">
        <Image
          src={buteco.photo}
          alt={buteco.name}
          fill
          priority={priority}
          className="object-cover transition-transform duration-300 hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute top-3 left-3 flex gap-2">
          {buteco.district && (
            <Badge className="bg-primary text-primary-foreground">
              {buteco.district}
            </Badge>
          )}
        </div>
      </div>
      
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg line-clamp-1 mb-2 text-balance">
          {buteco.name}
        </h3>
        
        <div className="flex items-start gap-2 text-muted-foreground text-sm mb-3">
          <MapPin className="h-4 w-4 shrink-0 mt-0.5" />
          <span className="line-clamp-2">{buteco.address}</span>
        </div>

        <div className="flex items-center justify-between gap-2">
          <div className="flex gap-1 flex-wrap">
            {buteco.suburb && (
              <Badge variant="secondary" className="text-xs">
                {buteco.suburb}
              </Badge>
            )}
            {buteco.city && (
              <Badge variant="outline" className="text-xs">
                {buteco.city}
              </Badge>
            )}
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            className="shrink-0"
            onClick={(e) => {
              e.stopPropagation()
              window.open(buteco.details_url, '_blank')
            }}
          >
            <ExternalLink className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export function ButecoCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <Skeleton className="aspect-16/10 w-full" />
      <CardContent className="p-4 space-y-3">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <div className="flex gap-2">
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-5 w-20" />
        </div>
      </CardContent>
    </Card>
  )
}
