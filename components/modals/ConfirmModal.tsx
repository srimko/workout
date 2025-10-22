import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

export interface ConfirmModalProps {
    isOpen: boolean;
    close: () => void;
    title: string;
    description: string;
    onConfirm: () => void;
    onCancel?: () => void;
    confirmText?: string;
    cancelText?: string;
    variant?: 'default' | 'destructive' | 'success';
}

export function ConfirmModal({ isOpen, close, title, description, onConfirm, onCancel, confirmText = 'Confirmer', cancelText = 'Annuler', variant = 'default'}: ConfirmModalProps) {
    const [isLoading, setIsLoading] = useState(false);

    const handleConfirm = async () => {
        setIsLoading(true);
        await onConfirm();
        setIsLoading(false);
        close();
    }

    return (
        <Dialog open={isOpen} onOpenChange={close}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{ title }</DialogTitle>
                    <DialogDescription>
                        { description }
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button onClick={ handleConfirm }>{isLoading ? "Chargement..." : confirmText}</Button>
                    <Button onClick={() => onCancel ? onCancel() : close()} variant="outline" >{ cancelText }</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}