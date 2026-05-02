import { Metadata } from 'next'
import Link from 'next/link'
import { MapPin, ExternalLink, ArrowLeft, Info, Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export const metadata: Metadata = {
  title: 'Sobre - Mapa di Buteco',
  description: 'Conheça o Mapa di Buteco, uma ferramenta independente para ajudar você a encontrar butecos participantes do Comida di Buteco.',
}

export default function SobrePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
        <div className="container flex h-16 items-center gap-4 px-4">
          <Link href="/" className="flex items-center gap-2">
            <MapPin className="h-6 w-6 text-primary" />
            <span className="font-bold text-lg lg:text-xl">Mapa di Buteco</span>
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="container px-4 py-8 max-w-3xl mx-auto">
        <Link href="/">
          <Button variant="ghost" className="mb-6 -ml-2">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar para o mapa
          </Button>
        </Link>

        <h1 className="text-3xl font-bold mb-8 text-balance">Sobre o Mapa di Buteco</h1>

        {/* About the tool */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="h-5 w-5 text-primary" />
              Sobre esta ferramenta
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>
              O <strong className="text-foreground">Mapa di Buteco</strong> é uma ferramenta desenvolvida de forma 
              <strong className="text-foreground"> completamente independente</strong> do evento Comida di Buteco.
            </p>
            <p>
              Esta ferramenta <strong className="text-foreground">não busca substituir o site oficial</strong> do evento. 
              Nosso objetivo é simplesmente ajudar os usuários a encontrarem os butecos participantes 
              mais próximos de sua região de forma rápida e intuitiva, utilizando um mapa interativo.
            </p>
            <p>
              Aqui você pode filtrar os butecos por cidade e bairro, além de visualizar 
              a localização exata de cada estabelecimento no mapa.
            </p>
          </CardContent>
        </Card>

        {/* About the event */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-primary" />
              Sobre o Comida di Buteco
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>
              O <strong className="text-foreground">Comida di Buteco</strong> é um dos maiores festivais 
              gastronômicos do Brasil, celebrando a cultura dos butecos e bares tradicionais. 
              Durante o evento, estabelecimentos participantes criam petiscos especiais que são 
              avaliados pelo público e por um júri técnico.
            </p>
            <p>
              O festival acontece em diversas cidades brasileiras e é uma ótima oportunidade para 
              conhecer novos sabores e apoiar os bares locais.
            </p>
            <div className="pt-2">
              <a
                href="https://comidadibuteco.com.br/o-comida-di-buteco/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="outline" className="gap-2">
                  Saiba mais sobre o evento
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </a>
            </div>
          </CardContent>
        </Card>

        {/* Official site link */}
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="py-6">
            <p className="text-center text-muted-foreground mb-4">
              Para informações oficiais, regulamento e votação, acesse o site oficial do evento:
            </p>
            <div className="flex justify-center">
              <a
                href="https://comidadibuteco.com.br/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button className="gap-2">
                  Acessar site oficial
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </a>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
