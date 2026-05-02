"use client"

import { useState } from "react"
import { MessageCircle, AlertTriangle, Bug, MessageSquare, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const feedbackOptions = [
  {
    label: "Relatar informação incorreta",
    href: "https://forms.gle/HXUmrEDeQsoBG73L6",
    icon: AlertTriangle,
  },
  {
    label: "Relatar erro",
    href: "https://forms.gle/abnv3s2ZUfLgA9Kq9",
    icon: Bug,
  },
  {
    label: "Sugestões, elogios, dúvidas ou reclamações",
    href: "https://forms.gle/GM8TzQxV54GEMP717",
    icon: MessageSquare,
  },
]

export function FeedbackButton() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="fixed bottom-20 right-4 z-50 md:bottom-6 md:right-6">
      {/* Options menu */}
      <div
        className={cn(
          "absolute bottom-14 right-0 flex flex-col gap-2 transition-all duration-200",
          isOpen
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 translate-y-2 pointer-events-none"
        )}
      >
        {feedbackOptions.map((option) => (
          <a
            key={option.href}
            href={option.href}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 bg-card text-card-foreground shadow-lg rounded-lg px-4 py-3 hover:bg-secondary transition-colors whitespace-nowrap text-sm font-medium border border-border"
            onClick={() => setIsOpen(false)}
          >
            <option.icon className="h-4 w-4 text-primary shrink-0" />
            <span>{option.label}</span>
          </a>
        ))}
      </div>

      {/* Main button */}
      <Button
        size="icon"
        className={cn(
          "h-12 w-12 rounded-full shadow-lg transition-transform",
          isOpen ? "rotate-0 bg-muted text-muted-foreground hover:bg-muted" : "bg-primary text-primary-foreground hover:bg-primary/90"
        )}
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? "Fechar menu de feedback" : "Abrir menu de feedback"}
      >
        {isOpen ? (
          <X className="h-5 w-5" />
        ) : (
          <MessageCircle className="h-5 w-5" />
        )}
      </Button>
    </div>
  )
}
