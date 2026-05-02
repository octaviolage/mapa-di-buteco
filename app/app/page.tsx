
import { ButecoMapClient } from '@/components/buteco-map-client'
import { Header } from '@/components/header'
import { ButecoList } from '@/components/buteco-list'
import { MobileFilters } from '@/components/filter-dropdowns'
import { MobileToggle } from '@/components/mobile-toggle'
import { FeedbackButton } from '@/components/feedback-button'
import type { Buteco } from '@/types/buteco'
import { promises as fs } from 'fs';
import path from 'path';

export default async function HomePage() {
  // Carrega todos os butecos do JSON (SSR) usando fs
  const filePath = path.join(process.cwd(), 'data', 'butecos.json');
  const fileContents = await fs.readFile(filePath, 'utf-8');
  const allButecos: Buteco[] = JSON.parse(fileContents);
  const INITIAL_LIST_SIZE = 20;
  const initialButecos = allButecos.slice(0, INITIAL_LIST_SIZE);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      {/* Mobile Filters */}
      <div className="lg:hidden px-4 py-3 border-b bg-background sticky top-16 z-40">
        <MobileFilters />
      </div>

      {/* Stats bar */}
      <div className="px-4 py-3 border-b bg-muted/30">
        <div className="container">
          <p className="text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">{allButecos.length} butecos</span>
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
            block
          `}
          style={{ maxHeight: 'calc(100vh - 110px)' }}
        >
          <ButecoList allButecos={allButecos} initialButecos={initialButecos} />
        </div>

        {/* Map Section - Desktop: always visible, Mobile: toggle */}
        <div 
          className={`
            lg:w-1/2 lg:min-w-[40%] lg:sticky
            block
          `}
          style={{ height: 'calc(100vh - 110px)' }}
        >
          <div className="h-full p-4 pt-0 lg:pt-4">
            <ButecoMapClient allButecos={allButecos} />
          </div>
        </div>
      </main>

      {/* Mobile Toggle */}
      <MobileToggle />

      {/* Feedback Button */}
      <FeedbackButton />
    </div>
  );
}
