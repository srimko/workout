import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

export interface AlertModalProps {
    isOpen: boolean;
    close: () => void;
    title: string;
    description: string;
    variant?: 'default' | 'destructive' | 'success';
}

export function AlertModal({ isOpen, close, title, description, variant = 'default'}: AlertModalProps) {
    return (
        <Dialog open={isOpen} onOpenChange={close}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{ title }</DialogTitle>
                    <DialogDescription>
                        { description }
                    </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    )
}