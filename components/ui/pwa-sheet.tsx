"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"

/**
 * PWA-compatible Sheet wrapper optimisé pour mode standalone.
 *
 * Contrairement à Vaul, Radix Dialog (Sheet) ne gère PAS automatiquement
 * le body scroll lock. Ce wrapper ajoute :
 * - Body scroll lock manuel (overflow: hidden)
 * - overscroll-behavior: contain pour empêcher scroll percole
 * - Événements tactiles custom pour standalone (clic overlay, swipe)
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
  const contentRef = React.useRef<HTMLDivElement>(null)

  // Body scroll lock (Radix ne le fait pas automatiquement)
  React.useEffect(() => {
    if (!open) return

    // Sauvegarder l'état actuel
    const originalOverflow = document.body.style.overflow
    const originalOverscrollBehavior = document.body.style.overscrollBehavior

    // Bloquer le scroll du body
    document.body.style.overflow = 'hidden'
    document.body.style.overscrollBehavior = 'none'

    return () => {
      // Restaurer l'état original
      document.body.style.overflow = originalOverflow
      document.body.style.overscrollBehavior = originalOverscrollBehavior
    }
  }, [open])

  // Enhanced touch handling for standalone mode
  React.useEffect(() => {
    if (!open) return

    // Support du swipe pour fermer
    let touchStartX = 0
    let touchStartY = 0
    let isSwiping = false

    const handleSwipeStart = (e: TouchEvent) => {
      const target = e.target as HTMLElement
      if (contentRef.current?.contains(target)) {
        touchStartX = e.touches[0].clientX
        touchStartY = e.touches[0].clientY
        isSwiping = true
      }
    }

    const handleSwipeEnd = (e: TouchEvent) => {
      if (!isSwiping) {
        isSwiping = false
        return
      }

      const touchEndX = e.changedTouches[0].clientX
      const touchEndY = e.changedTouches[0].clientY
      const deltaX = touchEndX - touchStartX
      const deltaY = touchEndY - touchStartY

      const minSwipeDistance = 100
      const maxVerticalDeviation = 50

      if (Math.abs(deltaY) > maxVerticalDeviation) {
        isSwiping = false
        return
      }

      // Swipe directionnel pour fermer
      if (side === "left" && deltaX < -minSwipeDistance) {
        onOpenChange(false)
      } else if (side === "right" && deltaX > minSwipeDistance) {
        onOpenChange(false)
      } else if (side === "bottom" && deltaY < -minSwipeDistance) {
        onOpenChange(false)
      } else if (side === "top" && deltaY > minSwipeDistance) {
        onOpenChange(false)
      }

      isSwiping = false
    }

    document.addEventListener('touchstart', handleSwipeStart, { passive: true })
    document.addEventListener('touchend', handleSwipeEnd, { passive: true })

    return () => {
      document.removeEventListener('touchstart', handleSwipeStart)
      document.removeEventListener('touchend', handleSwipeEnd)
    }
  }, [open, onOpenChange, side])

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        ref={contentRef}
        side={side}
        className={cn("overscroll-contain", className)}
      >
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
