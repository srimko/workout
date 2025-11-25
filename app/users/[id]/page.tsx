"use client"

import { Check, Minus, Moon, Pencil, Plus, Sun, X } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { TagsInput } from "@/components/ui/tags-input"
import { updateProfile } from "@/lib/actions/profiles"
import { useTheme } from "@/lib/providers/ThemeProvider"
import type { Profile } from "@/lib/types"
import { createClient } from "@/utils/supabase/client"

type EditableField = keyof Omit<Profile, "id" | "auth_id" | "created_at" | "updated_at">

export default function UserPage() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [editingField, setEditingField] = useState<EditableField | null>(null)
  const [tempValue, setTempValue] = useState<any>(null)
  const [saving, setSaving] = useState(false)

  const supabase = createClient()
  const { currentTheme, colorMode, themes, colorModes, changeTheme, changeColorMode } = useTheme()

  useEffect(() => {
    async function getUser() {
      try {
        const { data } = await supabase.from("profiles").select().single()
        setProfile(data)
      } catch (error) {
        console.error("Erreur lors de la récupération du profile:", error)
      } finally {
        setLoading(false)
      }
    }

    getUser()
  }, [supabase])

  const startEditing = (field: EditableField, currentValue: any) => {
    setEditingField(field)
    setTempValue(currentValue)
  }

  const cancelEditing = () => {
    setEditingField(null)
    setTempValue(null)
  }

  const saveField = async (field: EditableField, value: any) => {
    if (!profile) return

    setSaving(true)
    try {
      const result = await updateProfile(profile.id, { [field]: value })

      if (result.success && result.profile) {
        setProfile(result.profile)
        setEditingField(null)
        setTempValue(null)
        toast.success("Mis à jour", {
          description: "Votre profil a été mis à jour avec succès",
          duration: 1000,
        })
      } else {
        throw new Error(result.error || "Erreur lors de la mise à jour")
      }
    } catch (error: any) {
      toast.error("Erreur", {
        description: error.message || "Impossible de mettre à jour le profil",
        duration: 1000,
      })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-base text-muted-foreground">Chargement...</p>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen gap-4 px-4">
        <p className="text-base text-muted-foreground">Profil non trouvé</p>
        <Link href="/users">
          <Button variant="outline" className="min-h-[44px]">
            Retour aux profils
          </Button>
        </Link>
      </div>
    )
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const translateSex = (sex: string | null) => {
    if (!sex) return "Non renseigné"
    if (sex === "male") return "Homme"
    if (sex === "female") return "Femme"
    return "Autre"
  }

  const translateDominantHand = (hand: string | null) => {
    if (!hand) return "Non renseigné"
    if (hand === "right") return "Droite"
    if (hand === "left") return "Gauche"
    return "Ambidextre"
  }

  const translateExperience = (exp: string | null) => {
    if (!exp) return "Non renseigné"
    if (exp === "beginner") return "Débutant"
    if (exp === "intermediate") return "Intermédiaire"
    if (exp === "advanced") return "Avancé"
    if (exp === "expert") return "Expert"
    return exp
  }

  return (
    <div className="container mx-auto py-6 max-w-2xl">
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16 shrink-0">
              <AvatarImage
                src={`https://api.dicebear.com/7.x/initials/svg?seed=${profile.display_name}`}
              />
              <AvatarFallback>{getInitials(profile.display_name)}</AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <CardTitle className="text-2xl truncate">{profile.display_name}</CardTitle>
              <CardDescription className="text-sm">
                Membre depuis {new Date(profile.created_at).toLocaleDateString()}
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="px-0">
          <Accordion type="single" collapsible className="w-full">
            {/* Informations personnelles */}
            <AccordionItem value="personal" className="border-b px-6">
              <AccordionTrigger className="text-base font-semibold py-4 hover:no-underline">
                Informations personnelles
              </AccordionTrigger>
              <AccordionContent className="space-y-4 pb-6">
                {/* Display Name */}
                <EditableFieldRow
                  label="Nom d'affichage"
                  value={profile.display_name}
                  isEditing={editingField === "display_name"}
                  onEdit={() => startEditing("display_name", profile.display_name)}
                  onCancel={cancelEditing}
                  onSave={() => saveField("display_name", tempValue)}
                  saving={saving}
                  renderDisplay={() => (
                    <p className="text-base font-medium">{profile.display_name}</p>
                  )}
                  renderEdit={() => (
                    <Input
                      type="text"
                      value={tempValue}
                      onChange={(e) => setTempValue(e.target.value)}
                      className="text-base"
                      placeholder="Votre nom"
                    />
                  )}
                />

                {/* Birthday */}
                <EditableFieldRow
                  label="Date de naissance"
                  value={profile.birthday}
                  isEditing={editingField === "birthday"}
                  onEdit={() => startEditing("birthday", profile.birthday)}
                  onCancel={cancelEditing}
                  onSave={() => saveField("birthday", tempValue)}
                  saving={saving}
                  renderDisplay={() => (
                    <p className="text-base font-medium">
                      {profile.birthday
                        ? new Date(profile.birthday).toLocaleDateString()
                        : "Non renseigné"}
                    </p>
                  )}
                  renderEdit={() => (
                    <Input
                      type="date"
                      value={tempValue || ""}
                      onChange={(e) => setTempValue(e.target.value)}
                      className="text-base"
                    />
                  )}
                />

                {/* Sex */}
                <EditableFieldRow
                  label="Sexe"
                  value={profile.sex}
                  isEditing={editingField === "sex"}
                  onEdit={() => startEditing("sex", profile.sex)}
                  onCancel={cancelEditing}
                  onSave={() => saveField("sex", tempValue)}
                  saving={saving}
                  renderDisplay={() => (
                    <p className="text-base font-medium">{translateSex(profile.sex)}</p>
                  )}
                  renderEdit={() => (
                    <div className="flex flex-wrap gap-2">
                      {["male", "female", "other"].map((sex) => (
                        <Button
                          key={sex}
                          type="button"
                          variant={tempValue === sex ? "default" : "outline"}
                          onClick={() => setTempValue(sex)}
                          className="min-h-[44px] text-base flex-1"
                        >
                          {translateSex(sex)}
                        </Button>
                      ))}
                    </div>
                  )}
                />

                {/* Height */}
                <EditableFieldRow
                  label="Taille (cm)"
                  value={profile.height_cm}
                  isEditing={editingField === "height_cm"}
                  onEdit={() => startEditing("height_cm", profile.height_cm || 170)}
                  onCancel={cancelEditing}
                  onSave={() => saveField("height_cm", tempValue)}
                  saving={saving}
                  renderDisplay={() => (
                    <p className="text-base font-medium">
                      {profile.height_cm ? `${profile.height_cm} cm` : "Non renseigné"}
                    </p>
                  )}
                  renderEdit={() => (
                    <StepperInput
                      value={tempValue}
                      onChange={setTempValue}
                      min={100}
                      max={250}
                      step={1}
                      unit="cm"
                    />
                  )}
                />

                {/* Weight */}
                <EditableFieldRow
                  label="Poids (kg)"
                  value={profile.weight_kg}
                  isEditing={editingField === "weight_kg"}
                  onEdit={() => startEditing("weight_kg", profile.weight_kg || 70)}
                  onCancel={cancelEditing}
                  onSave={() => saveField("weight_kg", tempValue)}
                  saving={saving}
                  renderDisplay={() => (
                    <p className="text-base font-medium">
                      {profile.weight_kg ? `${profile.weight_kg} kg` : "Non renseigné"}
                    </p>
                  )}
                  renderEdit={() => (
                    <StepperInput
                      value={tempValue}
                      onChange={setTempValue}
                      min={30}
                      max={200}
                      step={0.5}
                      unit="kg"
                    />
                  )}
                />

                {/* Dominant Hand */}
                <EditableFieldRow
                  label="Main dominante"
                  value={profile.dominant_hand}
                  isEditing={editingField === "dominant_hand"}
                  onEdit={() => startEditing("dominant_hand", profile.dominant_hand)}
                  onCancel={cancelEditing}
                  onSave={() => saveField("dominant_hand", tempValue)}
                  saving={saving}
                  renderDisplay={() => (
                    <p className="text-base font-medium">
                      {translateDominantHand(profile.dominant_hand)}
                    </p>
                  )}
                  renderEdit={() => (
                    <div className="flex flex-wrap gap-2">
                      {["left", "right", "ambidextrous"].map((hand) => (
                        <Button
                          key={hand}
                          type="button"
                          variant={tempValue === hand ? "default" : "outline"}
                          onClick={() => setTempValue(hand)}
                          className="min-h-[44px] text-base flex-1"
                        >
                          {translateDominantHand(hand)}
                        </Button>
                      ))}
                    </div>
                  )}
                />
              </AccordionContent>
            </AccordionItem>

            {/* Profil sportif */}
            <AccordionItem value="training" className="border-b px-6">
              <AccordionTrigger className="text-base font-semibold py-4 hover:no-underline">
                Profil sportif
              </AccordionTrigger>
              <AccordionContent className="space-y-4 pb-6">
                <EditableFieldRow
                  label="Niveau d'expérience"
                  value={profile.training_experience}
                  isEditing={editingField === "training_experience"}
                  onEdit={() => startEditing("training_experience", profile.training_experience)}
                  onCancel={cancelEditing}
                  onSave={() => saveField("training_experience", tempValue)}
                  saving={saving}
                  renderDisplay={() => (
                    <p className="text-base font-medium">
                      {translateExperience(profile.training_experience)}
                    </p>
                  )}
                  renderEdit={() => (
                    <div className="flex flex-col gap-2">
                      {["beginner", "intermediate", "advanced", "expert"].map((level) => (
                        <Button
                          key={level}
                          type="button"
                          variant={tempValue === level ? "default" : "outline"}
                          onClick={() => setTempValue(level)}
                          className="min-h-[44px] text-base justify-start"
                        >
                          {translateExperience(level)}
                        </Button>
                      ))}
                    </div>
                  )}
                />
              </AccordionContent>
            </AccordionItem>

            {/* Objectifs */}
            <AccordionItem value="goals" className="border-b px-6">
              <AccordionTrigger className="text-base font-semibold py-4 hover:no-underline">
                Objectifs
              </AccordionTrigger>
              <AccordionContent className="space-y-4 pb-6">
                <EditableFieldRow
                  label="Mes objectifs"
                  value={profile.goals}
                  isEditing={editingField === "goals"}
                  onEdit={() => startEditing("goals", profile.goals || [])}
                  onCancel={cancelEditing}
                  onSave={() => saveField("goals", tempValue)}
                  saving={saving}
                  renderDisplay={() =>
                    profile.goals && profile.goals.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {profile.goals.map((goal, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center rounded-full bg-secondary px-3 py-1.5 text-sm font-medium"
                          >
                            {goal}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-base text-muted-foreground">Aucun objectif défini</p>
                    )
                  }
                  renderEdit={() => (
                    <TagsInput
                      value={tempValue || []}
                      onChange={setTempValue}
                      placeholder="Ajouter un objectif (Entrée ou virgule)"
                    />
                  )}
                />
              </AccordionContent>
            </AccordionItem>

            {/* Blessures */}
            <AccordionItem value="injuries" className="border-b px-6">
              <AccordionTrigger className="text-base font-semibold py-4 hover:no-underline">
                Blessures
              </AccordionTrigger>
              <AccordionContent className="space-y-4 pb-6">
                <EditableFieldRow
                  label="Blessures signalées"
                  value={profile.injuries}
                  isEditing={editingField === "injuries"}
                  onEdit={() => startEditing("injuries", profile.injuries || [])}
                  onCancel={cancelEditing}
                  onSave={() => saveField("injuries", tempValue)}
                  saving={saving}
                  renderDisplay={() =>
                    profile.injuries && profile.injuries.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {profile.injuries.map((injury, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center rounded-full bg-destructive/10 px-3 py-1.5 text-sm font-medium text-destructive"
                          >
                            {injury}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-base text-muted-foreground">Aucune blessure signalée</p>
                    )
                  }
                  renderEdit={() => (
                    <TagsInput
                      value={tempValue || []}
                      onChange={setTempValue}
                      placeholder="Ajouter une blessure (Entrée ou virgule)"
                    />
                  )}
                />
              </AccordionContent>
            </AccordionItem>

            {/* Thème */}
            <AccordionItem value="theme" className="px-6">
              <AccordionTrigger className="text-base font-semibold py-4 hover:no-underline">
                Apparence
              </AccordionTrigger>
              <AccordionContent className="space-y-6 pb-6">
                {/* Mode couleur (Dark/Light) */}
                <div className="space-y-2">
                  <Label className="text-sm text-muted-foreground">Mode</Label>
                  <div className="grid grid-cols-2 gap-3">
                    {colorModes.map((mode) => (
                      <Card
                        key={mode.mode}
                        className={`cursor-pointer transition-all hover:shadow-md ${
                          colorMode === mode.mode
                            ? "border-primary border-2 bg-primary/5"
                            : "border-border hover:border-primary/50"
                        }`}
                        onClick={() => {
                          changeColorMode(mode.mode)
                          toast.success("Mode modifié", {
                            description: `Le mode "${mode.label}" a été appliqué`,
                            duration: 2000,
                          })
                        }}
                      >
                        <CardHeader className="pb-3">
                          <div className="flex flex-col items-center gap-2 text-center">
                            {mode.mode === "light" ? (
                              <Sun className="h-8 w-8 text-primary" />
                            ) : (
                              <Moon className="h-8 w-8 text-primary" />
                            )}
                            <div className="space-y-1">
                              <CardTitle className="text-base">{mode.label}</CardTitle>
                              {colorMode === mode.mode && (
                                <Check className="h-4 w-4 mx-auto text-primary" />
                              )}
                            </div>
                          </div>
                        </CardHeader>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Thème de couleur */}
                <div className="space-y-2">
                  <Label className="text-sm text-muted-foreground">Thème de l'application</Label>
                  <div className="grid gap-3">
                    {themes.map((theme) => (
                      <Card
                        key={theme.name}
                        className={`cursor-pointer transition-all hover:shadow-md ${
                          currentTheme === theme.name
                            ? "border-primary border-2 bg-primary/5"
                            : "border-border hover:border-primary/50"
                        }`}
                        onClick={() => {
                          changeTheme(theme.name)
                          toast.success("Thème modifié", {
                            description: `Le thème "${theme.label}" a été appliqué`,
                            duration: 2000,
                          })
                        }}
                      >
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-base">{theme.label}</CardTitle>
                            {currentTheme === theme.name && (
                              <Check className="h-5 w-5 text-primary" />
                            )}
                          </div>
                          <CardDescription className="text-sm">{theme.description}</CardDescription>
                        </CardHeader>
                      </Card>
                    ))}
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <div className="text-sm text-muted-foreground px-6 pt-4">
            <p>Dernière mise à jour: {new Date(profile.updated_at).toLocaleString()}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Reusable component for editable fields
interface EditableFieldRowProps {
  label: string
  value: any
  isEditing: boolean
  onEdit: () => void
  onCancel: () => void
  onSave: () => void
  saving: boolean
  renderDisplay: () => React.ReactNode
  renderEdit: () => React.ReactNode
}

function EditableFieldRow({
  label,
  isEditing,
  onEdit,
  onCancel,
  onSave,
  saving,
  renderDisplay,
  renderEdit,
}: EditableFieldRowProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label className="text-sm text-muted-foreground">{label}</Label>
        {!isEditing && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onEdit}
            className="min-h-[36px] min-w-[36px] p-2"
            aria-label={`Modifier ${label}`}
          >
            <Pencil className="h-4 w-4" />
          </Button>
        )}
      </div>

      {isEditing ? (
        <>
          {renderEdit()}
          <div className="flex gap-2 pt-2">
            <Button
              onClick={onSave}
              disabled={saving}
              className="flex-1 min-h-[44px] text-base gap-2"
            >
              <Check className="h-4 w-4" />
              {saving ? "Enregistrement..." : "Sauvegarder"}
            </Button>
            <Button
              variant="outline"
              onClick={onCancel}
              disabled={saving}
              className="min-h-[44px] min-w-[44px] p-2"
              aria-label="Annuler"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </>
      ) : (
        renderDisplay()
      )}
    </div>
  )
}

// Stepper input component for numbers
interface StepperInputProps {
  value: number
  onChange: (value: number) => void
  min: number
  max: number
  step: number
  unit?: string
}

function StepperInput({ value, onChange, min, max, step, unit }: StepperInputProps) {
  const decrement = () => {
    const newValue = Math.max(min, value - step)
    onChange(Number(newValue.toFixed(1)))
  }

  const increment = () => {
    const newValue = Math.min(max, value + step)
    onChange(Number(newValue.toFixed(1)))
  }

  return (
    <div className="flex items-center gap-3">
      <Button
        type="button"
        variant="outline"
        onClick={decrement}
        disabled={value <= min}
        className="min-h-[44px] min-w-[44px] p-0"
        aria-label="Diminuer"
      >
        <Minus className="h-4 w-4" />
      </Button>

      <div className="flex-1 text-center">
        <Input
          type="number"
          value={value}
          onChange={(e) => {
            const newValue = parseFloat(e.target.value)
            if (!Number.isNaN(newValue) && newValue >= min && newValue <= max) {
              onChange(newValue)
            }
          }}
          min={min}
          max={max}
          step={step}
          className="text-base text-center"
        />
      </div>

      <Button
        type="button"
        variant="outline"
        onClick={increment}
        disabled={value >= max}
        className="min-h-[44px] min-w-[44px] p-0"
        aria-label="Augmenter"
      >
        <Plus className="h-4 w-4" />
      </Button>

      {unit && <span className="text-base text-muted-foreground min-w-[40px]">{unit}</span>}
    </div>
  )
}
