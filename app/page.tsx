'use client';

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectLabel,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,  
} from "@/components/ui/dialog"


export default function Home() {
  const STORAGE_KEY = "muscu_seances";

  const exercices = [
    {
      bodyPart: "Pectoraux",
      excercices: [
        "Banc",
        "Banc incliné",
        "Fly machine",
      ]
    },
    {
      bodyPart: "Dos",
      excercices: [
        "Tirage horizontal",
        "Tirage vertical",
        "Tirage assité un bras",
      ]
    },
    {
      bodyPart: "Épaules",
      excercices: [
        "Shoulder press machine",
        "Oiseau debout avec poids/haltères",
      ]
    },
    {
      bodyPart: "Biceps",
      excercices: [
        "Curl biceps assis à la machine",
        "Curl haltère incliné",
        "Curl biceps sur mur",
      ]
    },
  ]

  const [seance, setSeance] = useState<any[]>([]);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [openErrorModal, setOpenErrorModal] = useState<boolean>(false);

  // Charger les données depuis le localStorage au montage du composant
  useEffect(() => {
    try {
      const storedSeances = localStorage.getItem(STORAGE_KEY);
      if (storedSeances) {
        const parsedSeances = JSON.parse(storedSeances);
        setSeance(parsedSeances);
      }
    } catch (error) {
      console.error("Erreur lors du chargement des séances:", error);
    }
  }, []);

  // Sauvegarder les données dans le localStorage à chaque modification
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(seance));
    } catch (error) {
      console.error("Erreur lors de la sauvegarde des séances:", error);
    }
  }, [seance]);

  function handleSubmit(event: any) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);

    if(!formData.get("exercice") || !formData.get("weight") || !formData.get("serie") || !formData.get("repetition")) {
      setOpenModal(true);
      return
    }
    const data = Object.fromEntries(formData.entries());
    data.date = new Date().toLocaleString();

    setSeance([...seance, data]);
    form.reset();
  }

  function handleClearSeance() {
    setOpenErrorModal(true);
  }

  function emptySeance() {
    setSeance([]);
    localStorage.removeItem(STORAGE_KEY);
    setOpenErrorModal(false);
  }

  return (
    <>
      <form 
        className="flex flex-col justify-center py-2 max-w-2xl m-auto"
        onSubmit={handleSubmit}
      >
        <div className="grid w-full items-center gap-3 mb-4">
          <Label htmlFor="exercice">Exercice</Label>
          <Select name="exercice">
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select an exercice" />
            </SelectTrigger>
            <SelectContent>
              {
                exercices.map((exercice, index) => (
                  <SelectGroup key={exercice.bodyPart}>
                    <SelectLabel>{exercice.bodyPart}</SelectLabel>
                    {exercice.excercices.map((name) => (
                      <SelectItem key={name} value={name}>{name}</SelectItem>
                    ))}
                  </SelectGroup>
                ))
              }
            </SelectContent>
          </Select>
        </div>

        <div className="flex justify-between w-full gap-6">
          <div className="grid w-full items-center gap-3 mb-4">
            <Label htmlFor="weight">Poids (kg)</Label>
            <Input type="number" name="weight" min="2.5" step="1.25"/>
          </div>
          <div className="grid w-full items-center gap-3 mb-4">
            <Label htmlFor="serie">Série</Label>
            <Input type="number" name="serie" min="1"/>
          </div>

          <div className="grid w-full items-center gap-3 mb-4">
            <Label htmlFor="repetition">Répétitions</Label>
            <Input type="number" name="repetition" min="1"/>
          </div>
        </div>

        <div className="flex mt-4 gap-4">
          <Button type="submit">Ajouter</Button>
          {seance.length > 0 && (
            <Button type="button" variant="destructive" onClick={handleClearSeance}>
              Vider la séance
            </Button>
          )}
        </div>
      </form>

      {
        seance.length > 0 &&
        <Table className="flex flex-col justify-center py-2 max-w-2xl m-auto">
          <TableCaption>Séance</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-200 text-left">#</TableHead>
              <TableHead className="w-200 text-left">Machine/Exercice</TableHead>
              <TableHead className="w-200 text-left">Poids</TableHead>
              <TableHead className="w-200 text-left">Série</TableHead>
              <TableHead className="w-200 text-left">Répétition</TableHead>
              <TableHead className="w-200 text-left">Date - heure</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            { seance.map((item, index) => (
              <TableRow key={index}>
                <TableCell className="w-200 text-left">{index + 1}</TableCell>
                <TableCell className="w-200 text-left">{item.exercice}</TableCell>
                <TableCell className="w-200 text-left">{item.weight} kg</TableCell>
                <TableCell className="w-200 text-left">{item.serie}</TableCell>
                <TableCell className="w-200 text-left">{item.repetition}</TableCell>
                <TableCell className="w-200 text-left">{item.date}</TableCell>
              </TableRow>
            )) }
          </TableBody>
        </Table>
      }

      <Dialog defaultOpen={false} open={openModal} onOpenChange={setOpenModal}>
        {/* <DialogTrigger>Open</DialogTrigger> */}
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Erreur</DialogTitle>
            <DialogDescription>
              Veuillez remplir tous les champs du formulaire avant de soumettre.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      <Dialog defaultOpen={false} open={openErrorModal} onOpenChange={setOpenErrorModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Êtes-vous sûr de vouloir vider toute la séance ?</DialogTitle>
            <DialogDescription>
              Cette action est irréversible.
            </DialogDescription>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpenErrorModal(false)}>Annuler</Button>
              <Button variant="destructive" onClick={emptySeance}>Vider la séance</Button>
            </DialogFooter>
          </DialogHeader>
        </DialogContent>
      </Dialog>      
    </>
  );
}
