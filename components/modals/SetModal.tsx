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
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
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
        exerciceId: exercises.length > 0 ? exercises[0].id.toString() : '',
        weight: '30',
        serie: '',
        repetition: ''
    })
    const [weightStep, setWeightStep] = useState(5)
    const weights = [1.25, 2.5, 5, 10, 20]

    const handleConfirm = async () => {
        console.log("🔍 DEBUG - formData:", formData)
        console.log("🔍 Validation:", {
            exerciceId: !formData.exerciceId ? "❌ VIDE" : "✅ OK",
            weight: !formData.weight ? "❌ VIDE" : "✅ OK",
            serie: !formData.serie ? "❌ VIDE" : "✅ OK",
            repetition: !formData.repetition ? "❌ VIDE" : "✅ OK"
        })

        if (!formData.exerciceId) {
            alert("Veuillez sélectionner un exercice")
            return
        }
        if (!formData.weight || !formData.serie || !formData.repetition) {
            alert("Veuillez remplir tous les champs (poids, série, répétitions)")
            return
        }

        setIsLoading(true)

        await onConfirm({
            exerciceId: parseInt(formData.exerciceId),
            weight: parseFloat(formData.weight),
            serie: parseInt(formData.serie),
            repetition: parseInt(formData.repetition),
        })

        setIsLoading(false)

        setFormData({
            exerciceId: '',
            weight: '30',
            serie: '',
            repetition: '',
        })

        close()
    }

    const handleClick = (symbol:string) => {
        const currentWeight = parseFloat(formData.weight) || 30
        let weight = 0
        if(symbol === 'minus') {
            weight = currentWeight - weightStep
        } else {
            weight = currentWeight + weightStep
        }

        setFormData({...formData, weight: weight.toString()})
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

                        <div>
                            <div className="flex gap-4 justify-center m-8">
                                <span
                                    className="flex justify-center items-center px-8 text-2xl border rounded-full cursor-pointer hover:bg-gray-100"
                                    onClick={ () => handleClick('minus')}
                                >-</span>
                                <div className="p-6 border rounded-lg bg-gray-300 text-black font-bold text-2xl">{ formData.weight }</div>
                                <span
                                    className="flex justify-center items-center px-8 text-2xl border rounded-full cursor-pointer hover:bg-gray-100"
                                    onClick={ () => handleClick('plus')}
                                >+</span>
                            </div>
                            <ul className="flex justify-center gap-3">
                                {
                                    weights.map((weight, index) => (
                                        <li
                                            key={ index }
                                            className={`text-sm text-white p-2 rounded-2xl cursor-pointer transition-colors ${weightStep === weight ? 'bg-blue-600' : 'bg-gray-500 hover:bg-gray-600'}`}
                                            onClick={() => setWeightStep(weight)}
                                        >{ weight } Kg</li>
                                    ))
                                }
                            </ul>
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