import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button"

import { Profile, Exercise } from "@/lib/types";
// import { useWhyDidYouUpdate } from "@/lib/hooks/useWhyDidYouUpdate";

export interface SetModalProps {
    isOpen: boolean;
    close: () => void;
    title: string;
    description: string;
    profile?: Profile;
    onConfirm: (data : {
        exerciceId: number,
        weight: number,
        serie: number,
        repetition: number
    }) => void | Promise<void>;
    onCancel?: () => void;
    confirmText?: string;
    cancelText?: string;
    exercises: Exercise[];
    variant?: 'default' | 'destructive' | 'success';
}

export function SetModal({ isOpen, close, title, description, profile, onConfirm, onCancel, confirmText = 'Confirmer', cancelText = 'Annuler', variant = 'default', exercises}: SetModalProps) {
    // useWhyDidYouUpdate('SetModal', { isOpen, close, title, description, profile, onConfirm, onCancel, confirmText, cancelText, variant, exercises});
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        exerciceId: '',
        weight: '',
        serie: '',
        repetition: ''
    })

    const handleConfirm = async () => {
        if (!formData.exerciceId || !formData.weight || !formData.serie || !formData.repetition) {
            alert("Veuillez remplir tous les champs")
            return
        }

        setIsLoading(true)

        await onConfirm({
            exerciceId: parseInt(formData.exerciceId),
            weight: parseInt(formData.weight),
            serie: parseInt(formData.serie),
            repetition: parseInt(formData.repetition),
        })

        setIsLoading(false)

        setFormData({
            exerciceId: '',
            weight: '',
            serie: '',
            repetition: '',
        })

        close()
    }

    return (
        <Dialog open={isOpen} onOpenChange={close}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{ title } - { profile && profile.display_name }</DialogTitle>
                    <DialogDescription>
                        { description }
                    </DialogDescription>
                </DialogHeader>
                <form className="flex flex-col justify-center py-2 max-w-2xl m-auto">      
                    <div className="grid w-full items-center gap-3 mb-4">
                        <Label htmlFor="exercice">Exercice</Label>
                        <Select 
                            name="exercice"
                            value={formData.exerciceId}
                            onValueChange={(value) => setFormData({...formData, exerciceId: value})}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select an exercice" />
                            </SelectTrigger>
                            <SelectContent>
                                { exercises.map(exercise => (
                                    <SelectItem key={ exercise.id.toString() } value={ exercise.id.toString() }>
                                        { exercise.name } - { exercise.machine }
                                    </SelectItem>
                                )) }
                            </SelectContent>
                        </Select>

                        <div className="flex justify-between w-full gap-6">
                            <div className="grid w-full items-center gap-3 mb-4">
                                <Label htmlFor="weight">Poids (kg)</Label>
                                <Input type="number" name="weight" min="2.5" step="1.25" value={formData.weight} onChange={(e) => setFormData({...formData, weight: e.target.value})} />
                            </div>
                            <div className="grid w-full items-center gap-3 mb-4">
                                <Label htmlFor="serie">Série</Label>
                                <Input type="number" name="serie" min="1" value={formData.serie} onChange={(e) => setFormData({...formData, serie: e.target.value})}/>
                            </div>

                            <div className="grid w-full items-center gap-3 mb-4">
                                <Label htmlFor="repetition">Répétitions</Label>
                                <Input type="number" name="repetition" min="1" value={formData.repetition} onChange={(e) => setFormData({...formData, repetition: e.target.value})}/>
                            </div>
                        </div>
                    </div>
                </form>
                <DialogFooter>
                    <Button onClick={ handleConfirm }>{isLoading ? "Chargement..." : confirmText}</Button>
                    <Button onClick={() => onCancel ? onCancel() : close()} variant="outline" >{ cancelText }</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}