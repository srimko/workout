"use client"

import * as React from "react"
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerOverlay,
} from "@/components/ui/drawer"

/**
 * PWA-compatible Drawer wrapper that ensures proper touch event handling
 * in standalone display mode.
 *
 * Le composant Drawer de base (vaul) peut avoir des problèmes en mode standalone
 * car certains événements tactiles sont gérés différemment par l'OS.
 * Ce wrapper force la gestion correcte des événements.
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
}: PWADrawerProps) {
  const overlayRef = React.useRef<HTMLDivElement>(null)
  const contentRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    if (!open) return

    // Amélioration de la gestion des événements tactiles pour PWA standalone
    const handleTouchOnOverlay = (e: TouchEvent) => {
      const target = e.target as HTMLElement

      // Si le touch est directement sur l'overlay et que dismissible est true
      if (dismissible && target.hasAttribute('data-pwa-drawer-overlay')) {
        e.preventDefault()
        e.stopPropagation()
        onOpenChange(false)
      }
    }

    // Gestion du clic souris (pour desktop et mode browser)
    const handleClickOnOverlay = (e: MouseEvent) => {
      const target = e.target as HTMLElement

      if (dismissible && target.hasAttribute('data-pwa-drawer-overlay')) {
        e.stopPropagation()
        onOpenChange(false)
      }
    }

    // Amélioration du swipe pour fermer le drawer en mode standalone
    let touchStartY = 0
    let touchStartX = 0
    let isSwiping = false

    const handleSwipeStart = (e: TouchEvent) => {
      const target = e.target as HTMLElement

      // Ne démarrer le swipe que si on touche le contenu du drawer
      if (contentRef.current?.contains(target)) {
        touchStartX = e.touches[0].clientX
        touchStartY = e.touches[0].clientY
        isSwiping = true
      }
    }

    const handleSwipeMove = (e: TouchEvent) => {
      if (!isSwiping || !dismissible) return

      const touchCurrentY = e.touches[0].clientY
      const touchCurrentX = e.touches[0].clientX
      const deltaY = touchCurrentY - touchStartY
      const deltaX = touchCurrentX - touchStartX

      // Prévenir le scroll par défaut pendant le swipe
      if (Math.abs(deltaY) > 10 || Math.abs(deltaX) > 10) {
        // Ne pas empêcher le scroll si on swipe vers le haut sur un drawer bottom
        if (!(direction === "bottom" && deltaY < 0)) {
          e.preventDefault()
        }
      }
    }

    const handleSwipeEnd = (e: TouchEvent) => {
      if (!isSwiping || !dismissible) {
        isSwiping = false
        return
      }

      const touchEndX = e.changedTouches[0].clientX
      const touchEndY = e.changedTouches[0].clientY
      const deltaX = touchEndX - touchStartX
      const deltaY = touchEndY - touchStartY

      const minSwipeDistance = 80
      const maxCrossAxisDeviation = 100

      // Swipe vers le bas pour fermer si direction="bottom"
      if (direction === "bottom" && deltaY > minSwipeDistance && Math.abs(deltaX) < maxCrossAxisDeviation) {
        onOpenChange(false)
      }
      // Swipe vers le haut pour fermer si direction="top"
      else if (direction === "top" && deltaY < -minSwipeDistance && Math.abs(deltaX) < maxCrossAxisDeviation) {
        onOpenChange(false)
      }
      // Swipe vers la droite pour fermer si direction="right"
      else if (direction === "right" && deltaX > minSwipeDistance && Math.abs(deltaY) < maxCrossAxisDeviation) {
        onOpenChange(false)
      }
      // Swipe vers la gauche pour fermer si direction="left"
      else if (direction === "left" && deltaX < -minSwipeDistance && Math.abs(deltaY) < maxCrossAxisDeviation) {
        onOpenChange(false)
      }

      isSwiping = false
    }

    // Ajout des listeners avec options appropriées
    document.addEventListener('touchstart', handleTouchOnOverlay, { passive: true })
    document.addEventListener('click', handleClickOnOverlay)
    document.addEventListener('touchstart', handleSwipeStart, { passive: true })
    document.addEventListener('touchmove', handleSwipeMove, { passive: false })
    document.addEventListener('touchend', handleSwipeEnd, { passive: true })

    return () => {
      document.removeEventListener('touchstart', handleTouchOnOverlay)
      document.removeEventListener('click', handleClickOnOverlay)
      document.removeEventListener('touchstart', handleSwipeStart)
      document.removeEventListener('touchmove', handleSwipeMove)
      document.removeEventListener('touchend', handleSwipeEnd)
    }
  }, [open, onOpenChange, direction, dismissible])

  return (
    <Drawer
      open={open}
      onOpenChange={onOpenChange}
      dismissible={dismissible}
      shouldScaleBackground={shouldScaleBackground}
      direction={direction}
    >
      {/* Overlay personnalisé pour meilleure gestion en PWA */}
      {open && (
        <div
          ref={overlayRef}
          data-pwa-drawer-overlay
          className="fixed inset-0 z-50 bg-black/50"
          style={{ touchAction: 'auto' }}
        />
      )}

      <DrawerContent ref={contentRef} className={className}>
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
