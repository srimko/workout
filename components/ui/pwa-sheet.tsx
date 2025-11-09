"use client"

import * as React from "react"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"

/**
 * PWA-compatible Sheet wrapper that ensures proper touch event handling
 * in standalone display mode.
 *
 * En mode standalone, certains événements sont gérés différemment par l'OS.
 * Ce wrapper force la gestion correcte des événements tactiles pour fermer le drawer.
 */

interface PWASheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  children: React.ReactNode
  side?: "top" | "right" | "bottom" | "left"
  className?: string
  title?: string
  description?: string
}

export function PWASheet({
  open,
  onOpenChange,
  children,
  side = "left",
  className,
  title,
  description,
}: PWASheetProps) {
  const overlayRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    if (!open) return

    // Force la gestion des événements tactiles sur l'overlay
    const handleTouchStart = (e: TouchEvent) => {
      const target = e.target as HTMLElement

      // Si le touch est sur l'overlay (pas sur le contenu du sheet)
      if (target.hasAttribute('data-pwa-overlay')) {
        e.stopPropagation()
        onOpenChange(false)
      }
    }

    // Gestion du clic souris (pour desktop)
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement

      if (target.hasAttribute('data-pwa-overlay')) {
        e.stopPropagation()
        onOpenChange(false)
      }
    }

    // Support du swipe pour fermer le drawer
    let touchStartX = 0
    let touchStartY = 0
    const handleSwipeStart = (e: TouchEvent) => {
      touchStartX = e.touches[0].clientX
      touchStartY = e.touches[0].clientY
    }

    const handleSwipeEnd = (e: TouchEvent) => {
      const touchEndX = e.changedTouches[0].clientX
      const touchEndY = e.changedTouches[0].clientY
      const deltaX = touchEndX - touchStartX
      const deltaY = touchEndY - touchStartY

      // Swipe horizontal de 100px minimum
      const minSwipeDistance = 100
      const maxVerticalDeviation = 50

      if (Math.abs(deltaY) > maxVerticalDeviation) return

      // Swipe vers la gauche pour fermer si side="left"
      if (side === "left" && deltaX < -minSwipeDistance) {
        onOpenChange(false)
      }
      // Swipe vers la droite pour fermer si side="right"
      else if (side === "right" && deltaX > minSwipeDistance) {
        onOpenChange(false)
      }
      // Swipe vers le haut pour fermer si side="bottom"
      else if (side === "bottom" && deltaY < -minSwipeDistance) {
        onOpenChange(false)
      }
      // Swipe vers le bas pour fermer si side="top"
      else if (side === "top" && deltaY > minSwipeDistance) {
        onOpenChange(false)
      }
    }

    document.addEventListener('touchstart', handleTouchStart, { passive: true })
    document.addEventListener('click', handleClick)
    document.addEventListener('touchstart', handleSwipeStart, { passive: true })
    document.addEventListener('touchend', handleSwipeEnd, { passive: true })

    return () => {
      document.removeEventListener('touchstart', handleTouchStart)
      document.removeEventListener('click', handleClick)
      document.removeEventListener('touchstart', handleSwipeStart)
      document.removeEventListener('touchend', handleSwipeEnd)
    }
  }, [open, onOpenChange, side])

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      {/* Overlay personnalisé avec gestion des événements tactiles */}
      {open && (
        <div
          ref={overlayRef}
          data-pwa-overlay
          className="fixed inset-0 z-50 bg-black/50"
          style={{ touchAction: 'auto' }}
        />
      )}

      <SheetContent side={side} className={className}>
        {(title || description) && (
          <SheetHeader>
            {title && <SheetTitle>{title}</SheetTitle>}
            {description && <SheetDescription>{description}</SheetDescription>}
          </SheetHeader>
        )}
        {children}
      </SheetContent>
    </Sheet>
  )
}
