'use client'

import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Profile } from '@/lib/types'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import Link from 'next/link'

import { createClient } from "@/utils/supabase/client"

export default function UserPage() {
  const params = useParams()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  const supabase = createClient()
  
  useEffect(() => {
    async function getUser() {
      try {
        const { data } = await supabase.from('profiles').select().single()
        console.log(data)
        setProfile(data)
      } catch (error) {
        console.error('Erreur lors de la récupération du profile:', error)
      } finally {
        setLoading(false)
      }
    }

    getUser()
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-lg text-muted-foreground">Chargement...</p>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen gap-4">
        <p className="text-lg text-muted-foreground">Profil non trouvé</p>
        <Link href="/users">
          <Button variant="outline">Retour aux profils</Button>
        </Link>
      </div>
    )
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <div className="container mx-auto py-10 max-w-4xl">
      <div className="mb-6">
        <Link href="/users">
          <Button variant="ghost">← Retour aux profils</Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${profile.display_name}`} />
              <AvatarFallback>{getInitials(profile.display_name)}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-3xl">{profile.display_name}</CardTitle>
              <CardDescription>Membre depuis {new Date(profile.created_at).toLocaleDateString()}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-4">Informations personnelles</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Date de naissance</p>
                <p className="font-medium">{new Date(profile.birthday).toLocaleDateString()}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Sexe</p>
                <p className="font-medium">{profile.sex === 'male' ? 'Homme' : 'Femme'}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Taille</p>
                <p className="font-medium">{profile.height_cm} cm</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Poids</p>
                <p className="font-medium">{profile.weight_kg} kg</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Main dominante</p>
                <p className="font-medium">{profile.dominant_hand === 'right' ? 'Droite' : 'Gauche'}</p>
              </div>
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="text-lg font-semibold mb-4">Profil sportif</h3>
            <div className="space-y-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Niveau d'expérience</p>
                <p className="font-medium">
                  {profile.training_experience === 'beginner' && 'Débutant'}
                  {profile.training_experience === 'intermediate' && 'Intermédiaire'}
                  {profile.training_experience === 'advanced' && 'Avancé'}
                </p>
              </div>
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="text-lg font-semibold mb-4">Objectifs</h3>
            {profile.goals.length > 0 ? (
              <ul className="space-y-2">
                {profile.goals.map((goal, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <span className="text-primary">•</span>
                    <span>{goal}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground">Aucun objectif défini</p>
            )}
          </div>

          <Separator />

          <div>
            <h3 className="text-lg font-semibold mb-4">Blessures</h3>
            {profile.injuries.length > 0 ? (
              <ul className="space-y-2">
                {profile.injuries.map((injury, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <span className="text-destructive">•</span>
                    <span>{injury}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground">Aucune blessure signalée</p>
            )}
          </div>

          <Separator />

          <div className="text-sm text-muted-foreground">
            <p>Dernière mise à jour: {new Date(profile.updated_at).toLocaleString()}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
