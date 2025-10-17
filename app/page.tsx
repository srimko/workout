'use client';

import { useState } from "react";
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


export default function Home() {

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
  
  function handleSubmit(event: any) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    console.log(data);

    setSeance([...seance, data]);
    form.reset();
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

        <div className="flex mt-4">
          <Button type="submit">Ajouter</Button>
        </div>
      </form>

      {
        seance.length > 0 &&
        <Table className="flex flex-col justify-center py-2 max-w-2xl m-auto">
          <TableCaption>Séance</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-200 text-left">Machine/Exercice</TableHead>
              <TableHead className="w-200 text-left">Poids</TableHead>
              <TableHead className="w-200 text-left">Série</TableHead>
              <TableHead className="w-200 text-left">Répétition</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            { seance.map((item, index) => (
              <TableRow key={index}>
                <TableCell className="w-200 text-left">{item.exercice}</TableCell>
                <TableCell className="w-200 text-left">{item.weight} kg</TableCell>
                <TableCell className="w-200 text-left">{item.serie}</TableCell>
                <TableCell className="w-200 text-left">{item.repetition}</TableCell>
              </TableRow>
            )) }
          </TableBody>
        </Table>
      }
      
    </>
  );
}
