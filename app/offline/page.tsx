export default function OfflinePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">Hors ligne</h1>
        <p className="text-muted-foreground max-w-md">
          Vous êtes actuellement hors ligne. Vérifiez votre connexion internet et réessayez.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
        >
          Réessayer
        </button>
      </div>
    </div>
  )
}
