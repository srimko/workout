# Fix: Gestion des Drawers/Sheets en mode PWA Standalone

## Problème identifié

En mode `display: standalone` dans le manifest d'une PWA, les événements tactiles sont gérés différemment par l'OS natif :

- **Mode Browser/Minimal-UI** : Tous les événements JavaScript standard sont disponibles
- **Mode Standalone** : Certains événements sont filtrés ou gérés nativement par l'OS
  - Les événements `click` sur l'overlay peuvent ne pas se déclencher
  - Les événements `touchstart/touchend` peuvent être interceptés
  - Le comportement de swipe peut être modifié

### Symptômes
- Le drawer/sheet ne se ferme pas quand on clique sur l'overlay
- Le geste de swipe pour fermer ne fonctionne pas correctement
- L'interface semble "gelée" ou non-responsive

## Solution implémentée

Création de wrappers PWA-compatibles qui forcent la gestion correcte des événements tactiles :

### 1. PWASheet (`components/ui/pwa-sheet.tsx`)
- Gestion explicite des événements `touchstart` et `click` sur l'overlay
- Support du swipe directionnel pour fermer le sheet
- Overlay personnalisé avec `touchAction: 'auto'`

### 2. PWADrawer (`components/ui/pwa-drawer.tsx`)
- Amélioration de la gestion tactile pour la librairie `vaul`
- Détection de swipe avec seuils configurables
- Support multi-directionnel (top, right, bottom, left)

### 3. Mise à jour du Sidebar (`components/ui/sidebar.tsx`)
- Utilisation automatique de `PWASheet` en mode mobile
- Pas de changement pour le mode desktop

## Utilisation

### Pour les Sheets (ex: Sidebar mobile)

Le composant `Sidebar` a été automatiquement mis à jour. Aucune modification nécessaire.

### Pour les Drawers personnalisés

**Avant :**
```tsx
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer"

<Drawer open={open} onOpenChange={setOpen}>
  <DrawerTrigger>Ouvrir</DrawerTrigger>
  <DrawerContent>
    {/* Contenu */}
  </DrawerContent>
</Drawer>
```

**Après (option 1 - Wrapper simple) :**
```tsx
import { PWADrawer } from "@/components/ui/pwa-drawer"

<PWADrawer
  open={open}
  onOpenChange={setOpen}
  direction="bottom"
  title="Mon Drawer"
  description="Description optionnelle"
>
  {/* Contenu */}
</PWADrawer>
```

**Après (option 2 - Drawer complexe avec trigger) :**
Si vous avez besoin d'un DrawerTrigger, continuez à utiliser le Drawer standard :
```tsx
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer"

<Drawer open={open} onOpenChange={setOpen}>
  <DrawerTrigger asChild>
    <Button>Ouvrir</Button>
  </DrawerTrigger>
  <DrawerContent>
    {/* Le Drawer standard fonctionne toujours,
        mais PWADrawer offre une meilleure compatibilité PWA */}
  </DrawerContent>
</Drawer>
```

## Props des nouveaux composants

### PWASheet
```tsx
interface PWASheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  children: React.ReactNode
  side?: "top" | "right" | "bottom" | "left"  // défaut: "left"
  className?: string
  title?: string
  description?: string
}
```

### PWADrawer
```tsx
interface PWADrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  children: React.ReactNode
  direction?: "top" | "right" | "bottom" | "left"  // défaut: "bottom"
  className?: string
  title?: string
  description?: string
  dismissible?: boolean                // défaut: true
  shouldScaleBackground?: boolean      // défaut: true
}
```

## Différences mode Standalone vs Browser

| Aspect | Browser | Standalone (avant fix) | Standalone (après fix) |
|--------|---------|------------------------|------------------------|
| Clic sur overlay | ✅ Fonctionne | ❌ Ne fonctionne pas | ✅ Fonctionne |
| Swipe pour fermer | ✅ Fonctionne | ⚠️ Inconsistent | ✅ Fonctionne |
| Événements touch | ✅ Standard | ⚠️ Filtrés par OS | ✅ Forcés |
| Performance | ✅ Bonne | ✅ Bonne | ✅ Bonne |

## Tests recommandés

1. **Tester en mode Browser** : `http://localhost:3000`
   - Vérifier que le drawer s'ouvre et se ferme normalement

2. **Tester en mode PWA Standalone** :
   - Sur iOS : Ajouter à l'écran d'accueil
   - Sur Android : Installer l'app
   - Vérifier que le drawer se ferme en :
     - Cliquant sur l'overlay
     - Swipant vers le bas/haut/gauche/droite selon la direction

3. **Tester le swipe** :
   - Swipe dans la bonne direction (min 80px)
   - Vérifier que le swipe dans la mauvaise direction ne ferme pas
   - Vérifier que le scroll vertical fonctionne toujours

## Configuration du Manifest

Le fichier `app/manifest.ts` reste en mode `standalone` pour une expérience native optimale :

```ts
{
  display: "standalone",  // Garde ce mode pour une vraie app PWA
  // ... autres options
}
```

Alternatives possibles (mais moins recommandées pour une PWA) :
- `"browser"` : Mode navigateur standard (pas de problème mais moins "app-like")
- `"minimal-ui"` : Barre d'URL minimale
- `"fullscreen"` : Plein écran (problèmes similaires au standalone)

## Compatibilité

- ✅ iOS Safari (standalone mode)
- ✅ Android Chrome (standalone mode)
- ✅ Desktop browsers (tous modes)
- ✅ Mode browser classique
- ✅ Mode minimal-ui

## Notes techniques

### Pourquoi ce problème existe ?

En mode `standalone`, les navigateurs tentent de donner une expérience native :
- L'OS intercepte certains gestes (pull-to-refresh, edge swipes, etc.)
- Les événements JavaScript sont filtrés pour éviter les conflits
- Le modèle de rendu peut différer légèrement

### Comment le fix fonctionne ?

1. **Overlay personnalisé** : Crée un overlay avec `touchAction: 'auto'` pour forcer la propagation des événements
2. **Event Listeners directs** : Écoute directement les événements sur `document` au lieu de déléguer
3. **Passive listeners** : Utilise `{ passive: false }` pour `touchmove` afin de pouvoir `preventDefault()`
4. **Détection de swipe** : Calcule manuellement les deltas et applique des seuils

## Contributions futures

Si vous trouvez des cas où le drawer ne se ferme pas correctement :
1. Vérifier le mode d'affichage (standalone vs browser)
2. Tester sur différents OS (iOS vs Android)
3. Ajuster les seuils de swipe si nécessaire (actuellement 80-100px)
