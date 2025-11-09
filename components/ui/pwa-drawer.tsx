"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"

/**
 * PWA-compatible Drawer wrapper optimisé pour mode standalone.
 *
 * Combine :
 * - Vaul's built-in scroll lock (via scrollLockTimeout, modal, etc)
 * - overscroll-behavior: contain pour empêcher scroll percole
 * - Événements tactiles custom pour standalone (clic overlay, swipe)
 *
 * Vaul gère déjà le body scroll lock automatiquement, on complète juste
 * avec CSS et événements pour les cas edge en mode standalone.
 */

interface PWADrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  children: React.ReactNode
  direction?: "top" | "right" | "bottom" | "left"
  className?: string
  title?: string
  description?: string
  dismissible?: boolean
  shouldScaleBackground?: boolean
  scrollLockTimeout?: number
  modal?: boolean
}

export function PWADrawer({
  open,
  onOpenChange,
  children,
  direction = "bottom",
  className,
  title,
  description,
  dismissible = true,
  shouldScaleBackground = true,
  scrollLockTimeout = 100,
  modal = true,
}: PWADrawerProps) {
  const contentRef = React.useRef<HTMLDivElement>(null)

  // Enhanced swipe handling for standalone mode
  React.useEffect(() => {
    if (!open || !dismissible) return

    let touchStartY = 0
    let touchStartX = 0
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

      const minSwipeDistance = 80
      const maxCrossAxisDeviation = 100

      // Swipe directionnel pour fermer
      if (direction === "bottom" && deltaY > minSwipeDistance && Math.abs(deltaX) < maxCrossAxisDeviation) {
        onOpenChange(false)
      } else if (direction === "top" && deltaY < -minSwipeDistance && Math.abs(deltaX) < maxCrossAxisDeviation) {
        onOpenChange(false)
      } else if (direction === "right" && deltaX > minSwipeDistance && Math.abs(deltaY) < maxCrossAxisDeviation) {
        onOpenChange(false)
      } else if (direction === "left" && deltaX < -minSwipeDistance && Math.abs(deltaY) < maxCrossAxisDeviation) {
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
  }, [open, onOpenChange, direction, dismissible])

  return (
    <Drawer
      open={open}
      onOpenChange={onOpenChange}
      dismissible={dismissible}
      shouldScaleBackground={shouldScaleBackground}
      scrollLockTimeout={scrollLockTimeout}
      modal={modal}
      direction={direction}
    >
      <DrawerContent
        ref={contentRef}
        className={cn("overscroll-contain", className)}
      >
        {(title || description) && (
          <DrawerHeader>
            {title && <DrawerTitle>{title}</DrawerTitle>}
            {description && <DrawerDescription>{description}</DrawerDescription>}
          </DrawerHeader>
        )}
        {children}
      </DrawerContent>
    </Drawer>
  )
}
