import { Avatar } from "@/components/ui/avatar"
import { Card, CardDescription } from "@/components/ui/card"

export default async function AdminUserPage() {
  return (
    <div>
      <h1>Admin User Page</h1>

      <Card>
        <CardDescription>
          <Avatar></Avatar>
          <div>
            <p>Name</p>
            <p>Email</p>
            <p>Last conncetion</p>
          </div>
          <div>Personal stats</div>
        </CardDescription>
      </Card>

      <div>
        <h2>Workouts List</h2>
        {/* Ici faire un accordion */}
        {/* Date, durée, statut (en cours/terminé) Nombre de sets Liste des sets avec : 
        Numéro de série
        Exercice (nom + catégorie) 
        Poids (kg) 
        Répétitions 
        Actions : Éditer, Supprimer */}
        <ul>
          <li>Workout1</li>
          <li>Workout2</li>
          <li>Workout3</li>
        </ul>
      </div>
    </div>
  )
}
