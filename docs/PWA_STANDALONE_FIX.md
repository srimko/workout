# Fix: Gestion des Drawers/Sheets en mode PWA Standalone

## Problèmes identifiés

### Problème 1 : Événements en mode standalone
En mode `display: standalone` dans le manifest d'une PWA, les événements tactiles sont gérés différemment par l'OS natif :
- Les événements `click` sur l'overlay peuvent ne pas se déclencher
- Les événements `touchstart/touchend` peuvent être interceptés
- Le comportement de swipe peut être modifié

### Problème 2 : Scroll qui "percole"
Quand on scroll dans une zone scrollable du drawer et qu'on atteint le bord, le scroll se propage à la page derrière :
- L'utilisateur perd le contexte
- L'UX est dégradée
- Comportement incohérent entre modes browser et standalone

## Solution implémentée

### Architecture en 3 couches

**Couche 1 - Vaul (Drawer)**
- ✅ Body scroll lock automatique intégré
- ✅ Gestion sophistiquée des touch events
- ✅ Props `scrollLockTimeout`, `modal`, `shouldScaleBackground`

**Couche 2 - CSS**
- `overscroll-behavior: contain` → empêche scroll percole
- `-webkit-overflow-scrolling: touch` → momentum scrolling iOS
- Classes utilitaires dans `globals.css`

**Couche 3 - Wrappers PWA**
- PWADrawer : Complète Vaul pour cas standalone
- PWASheet : Body lock manuel + événements standalone (Radix n'a pas de scroll lock)

### Fichiers modifiés/créés

1. **`app/globals.css`**
   ```css
   .overscroll-contain {
     overscroll-behavior: contain;
     -webkit-overflow-scrolling: touch;
   }
   ```

2. **`components/ui/drawer.tsx`**
   - Props Vaul par défaut :
     - `scrollLockTimeout={100}` (100ms après scroll avant drag)
     - `shouldScaleBackground={true}` (effet visuel)
     - `modal={true}` (comportement modal explicite)

3. **`components/ui/pwa-drawer.tsx`**
   - Wrapper optimisé tirant parti de Vaul
   - Événements tactiles custom pour standalone
   - Classe `overscroll-contain` appliquée automatiquement

4. **`components/ui/pwa-sheet.tsx`**
   - Body scroll lock manuel (Radix ne le fait pas)
   - Événements tactiles pour standalone
   - Classe `overscroll-contain` appliquée automatiquement

5. **`components/ui/sidebar.tsx`**
   - Utilise PWASheet en mode mobile
   - Pas de changement pour desktop

6. **`components/Drawers/components/DrawerWorkoutDetails.tsx`**
   - Classe `overscroll-contain` sur zone scrollable

## Utilisation

### Drawer (avec props Vaul optimisées)

Le composant `Drawer` de base a maintenant des valeurs par défaut optimisées :

```tsx
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer"

// Utilisation standard - props Vaul automatiquement appliquées
<Drawer open={open} onOpenChange={setOpen}>
  <DrawerTrigger>Ouvrir</DrawerTrigger>
  <DrawerContent>
    <div className="overflow-y-auto max-h-[60vh] overscroll-contain">
      {/* Contenu scrollable */}
    </div>
  </DrawerContent>
</Drawer>
```

### PWADrawer (pour standalone avancé)

Utilise PWADrawer si tu veux forcer la gestion standalone :

```tsx
import { PWADrawer } from "@/components/ui/pwa-drawer"

<PWADrawer
  open={open}
  onOpenChange={setOpen}
  direction="bottom"
  title="Mon Drawer"
  description="Description optionnelle"
  scrollLockTimeout={100}  // Déjà par défaut
>
  {/* Contenu - overscroll-contain appliqué automatiquement */}
</PWADrawer>
```

### PWASheet (pour Sheet/Sidebar mobile)

```tsx
import { PWASheet } from "@/components/ui/pwa-sheet"

<PWASheet
  open={open}
  onOpenChange={setOpen}
  side="left"
  title="Sidebar"
>
  {/* Contenu - body lock et overscroll-contain automatiques */}
</PWASheet>
```

## Props Vaul importantes

### scrollLockTimeout (défaut: 100)
Temps en ms après un scroll avant de pouvoir drag le drawer. Évite les conflits scroll/drag.

```tsx
<Drawer scrollLockTimeout={100}> {/* 100ms après scroll */}
```

### modal (défaut: true)
Force le comportement modal. **Ne jamais mettre à `false` avec du contenu scrollable** (bug connu Vaul).

```tsx
<Drawer modal={true}> {/* Toujours true */}
```

### shouldScaleBackground (défaut: true)
Effet visuel de scale sur le background.

```tsx
<Drawer shouldScaleBackground={true}>
```

### direction
Direction d'ouverture du drawer.

```tsx
<Drawer direction="bottom"> {/* "top" | "right" | "bottom" | "left" */}
```

## Classes CSS utilitaires

### .overscroll-contain
Empêche le scroll de percorer vers le parent.

```tsx
<div className="overflow-y-auto max-h-[60vh] overscroll-contain">
  {/* Zone scrollable qui ne percole pas */}
</div>
```

### .overscroll-none
Bloque complètement l'overscroll.

```tsx
<div className="overscroll-none">
  {/* Aucun overscroll possible */}
</div>
```

## Différences mode Browser vs Standalone

| Aspect | Browser | Standalone (avant) | Standalone (après) |
|--------|---------|-------------------|-------------------|
| Clic overlay | ✅ | ❌ | ✅ |
| Swipe fermer | ✅ | ⚠️ Inconsistent | ✅ |
| Scroll percole | ⚠️ Possible | ⚠️ Fréquent | ✅ Bloqué |
| Body scroll lock | ⚠️ Variable | ❌ | ✅ |

## Tests recommandés

### 1. Mode Browser (`http://localhost:3000`)
- ✅ Drawer s'ouvre et se ferme
- ✅ Swipe fonctionne
- ✅ Scroll dans drawer ne percole pas
- ✅ Clic overlay ferme le drawer

### 2. Mode PWA Standalone
**iOS** : Ajouter à l'écran d'accueil
**Android** : Installer l'app

Tester :
- ✅ Clic overlay ferme le drawer
- ✅ Swipe directionnel ferme le drawer
- ✅ Scroll dans zone scrollable ne percole pas
- ✅ Body est locké quand drawer ouvert
- ✅ Scroll vertical fonctionne dans le drawer

### 3. Zone scrollable spécifique
- ✅ Scroll dans `DrawerWorkoutDetails` ne percole pas
- ✅ Arriver en haut/bas ne ferme pas le drawer
- ✅ Momentum scrolling iOS fonctionne

## Architecture technique

### Vaul (Drawer)
```
Vaul Root
  ├─ scrollLockTimeout={100}  ← Gère conflit scroll/drag
  ├─ modal={true}              ← Force comportement modal
  ├─ shouldScaleBackground     ← Effet visuel
  └─ Body scroll lock AUTO     ← Vaul le fait nativement
```

### Radix Dialog (Sheet)
```
Sheet
  ├─ Pas de scroll lock natif  ← On le fait manuellement
  ├─ PWASheet wrapper          ← Body lock + events
  └─ overscroll-contain        ← CSS anti-percole
```

### CSS Layers
```css
/* Zone scrollable */
.overflow-y-auto.overscroll-contain {
  overscroll-behavior: contain;  ← Stop propagation
  -webkit-overflow-scrolling: touch;  ← iOS momentum
}

/* Body quand Sheet ouvert (PWASheet) */
body {
  overflow: hidden;  ← Bloque scroll
  overscroll-behavior: none;  ← Aucun overscroll
}
```

## Pourquoi cette approche ?

### ✅ Tire parti de Vaul
- Vaul fait déjà 90% du travail pour les Drawers
- Ne réinvente pas la roue
- Bénéficie des mises à jour Vaul

### ✅ Complète avec CSS minimal
- `overscroll-behavior: contain` sur zones scrollables
- Pas de `touch-action: none` agressif (bloque zoom/navigation)
- Classes utilitaires réutilisables

### ✅ Wrappers légers
- PWADrawer : Complète Vaul pour standalone
- PWASheet : Ajoute ce que Radix ne fait pas
- Code minimal, maintenance facile

### ✅ Pas d'effet secondaire
- Zoom fonctionne toujours
- Navigation iOS/Android préservée
- Performance optimale

## Configuration du Manifest

Le fichier `app/manifest.ts` reste en mode `standalone` :

```ts
{
  display: "standalone",  // Mode optimal pour PWA
}
```

## Compatibilité

- ✅ iOS Safari (standalone mode)
- ✅ Android Chrome (standalone mode)
- ✅ Desktop browsers (tous modes)
- ✅ Mode browser classique
- ✅ Mode minimal-ui

## Bugs connus Vaul à éviter

⚠️ **Ne JAMAIS utiliser `modal={false}` avec du contenu scrollable**
- Bug connu Vaul ([issue #168](https://github.com/emilkowalski/vaul/issues/168))
- Le drawer ne se ferme plus correctement
- Toujours utiliser `modal={true}` (notre défaut)

## Contributions futures

Pour ajouter des zones scrollables dans un drawer :
1. Ajouter `className="overflow-y-auto overscroll-contain"`
2. Définir une hauteur max (`max-h-[60vh]`)
3. Tester en mode standalone

Pour les nouveaux Sheets :
1. Utiliser `PWASheet` pour le mode mobile
2. Le body scroll lock est automatique
3. La classe `overscroll-contain` est appliquée

## Ressources

- [Vaul Documentation](https://www.npmjs.com/package/vaul)
- [overscroll-behavior MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/overscroll-behavior)
- [PWA display modes](https://web.dev/learn/pwa/app-design/)
