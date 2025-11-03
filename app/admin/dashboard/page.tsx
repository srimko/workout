import { getAllUsers, getGlobalStats, getUserWithWorkouts } from "@/lib/actions/admin"
import { UserWorkoutsTable } from "@/components/admin/UserWorkoutsTable"

export default async function AdminDashboardPage() {
  let users = await getAllUsers()
  const stats = await getGlobalStats()

  users = users.filter((user) => !["wadmin"].includes(user.display_name))

  const usersWorkouts = await Promise.all(users.map((user) => getUserWithWorkouts(user.id)))

  return (
    <div className="space-y-6 p-6">
      {/* Header avec stats */}
      <div>
        <h1 className="text-3xl font-bold">Dashboard Admin</h1>
        <p className="text-gray-500 mt-2">Gérez les utilisateurs et leurs workouts</p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-card border rounded-lg p-4">
          <p className="text-sm text-gray-500">Total Utilisateurs</p>
          <p className="text-2xl font-bold">{stats.total_users}</p>
        </div>
        <div className="bg-card border rounded-lg p-4">
          <p className="text-sm text-gray-500">Workouts Aujourd'hui</p>
          <p className="text-2xl font-bold">{stats.workouts_today}</p>
        </div>
        <div className="bg-card border rounded-lg p-4">
          <p className="text-sm text-gray-500">Sets Aujourd'hui</p>
          <p className="text-2xl font-bold">{stats.sets_today}</p>
        </div>
        <div className="bg-card border rounded-lg p-4">
          <p className="text-sm text-gray-500">Utilisateurs Actifs</p>
          <p className="text-2xl font-bold">{stats.active_users}</p>
        </div>
      </div>

      {/* Users list */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Utilisateurs et leurs Workouts</h2>
        {usersWorkouts.map((user) => (
          <UserWorkoutsTable key={user.id} user={user} />
        ))}
      </div>
    </div>
  )
}
