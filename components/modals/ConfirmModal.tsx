import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

export interface ConfirmModalProps {
  isOpen: boolean
  close: () => void
  title: string
  description: string
  onConfirm: () => void
  onCancel?: () => void
  confirmText?: string
  cancelText?: string
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
}

export function ConfirmModal({
  isOpen,
  close,
  title,
  description,
  onConfirm,
  onCancel,
  confirmText = "Confirmer",
  cancelText = "Annuler",
  variant = "default",
}: ConfirmModalProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleConfirm = async () => {
    setIsLoading(true)
    await onConfirm()
    setIsLoading(false)
    close()
  }

  return (
    <Dialog open={isOpen} onOpenChange={close}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button onClick={handleConfirm} variant={variant}>
            {isLoading ? "Chargement..." : confirmText}
          </Button>
          <Button onClick={() => (onCancel ? onCancel() : close())} variant="outline">
            {cancelText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
