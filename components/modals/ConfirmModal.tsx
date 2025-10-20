/**
 * 🎓 COMPOSANT : ConfirmModal
 *
 * OBJECTIF :
 * ----------
 * Créer un modal de confirmation RÉUTILISABLE qui demande à l'utilisateur
 * de confirmer ou annuler une action.
 *
 * DIFFÉRENCE AVEC AlertModal :
 * ----------------------------
 * - AlertModal : Info uniquement, pas d'action
 * - ConfirmModal : Demande une action (Confirmer / Annuler)
 *
 * CAS D'USAGE TYPIQUES :
 * ----------------------
 * - Supprimer un élément : "Êtes-vous sûr de vouloir supprimer ?"
 * - Vider des données : "Voulez-vous vraiment vider la séance ?"
 * - Quitter sans sauvegarder : "Des modifications non sauvegardées seront perdues"
 *
 * EXEMPLE D'UTILISATION :
 * ----------------------
 * const deleteModal = useModal();
 *
 * <ConfirmModal
 *   isOpen={deleteModal.isOpen}
 *   close={deleteModal.close}
 *   title="Supprimer la séance ?"
 *   description="Cette action est irréversible"
 *   onConfirm={() => {
 *     deletWorkout(id);
 *     deleteModal.close();
 *   }}
 *   confirmText="Supprimer"
 *   cancelText="Annuler"
 *   variant="destructive"
 * />
 */

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

export interface ConfirmModalProps {
    isOpen: boolean;
    close: () => void;
    title: string;
    description: string;
    onConfirm: () => void;
    onCancel?: () => void;
    confirmText?: string;
    cancelText?: string;
    variant?: 'default' | 'destructive' | 'success';
}

export function ConfirmModal({ isOpen, close, title, description, onConfirm, onCancel, confirmText = 'Confirmer', cancelText = 'Annuler', variant = 'default'}: ConfirmModalProps) {
    const [isLoading, setIsLoading] = useState(false);

    const handleConfirm = async () => {
        setIsLoading(true);
        await onConfirm();
        setIsLoading(false);
        close();
    }

    return (
        <Dialog open={isOpen} onOpenChange={close}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{ title }</DialogTitle>
                    <DialogDescription>
                        { description }
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button onClick={ handleConfirm }>{isLoading ? "Chargement..." : confirmText}</Button>
                    <Button onClick={() => onCancel ? onCancel() : close()} variant="outline" >{ cancelText }</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

// TODO 1: Importer les composants Dialog de shadcn/ui
// Conseil : Cette fois on a besoin de DialogFooter en plus !
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
// import { Button } from "@/components/ui/button"

/**
 * TODO 2: Définir l'interface ConfirmModalProps
 *
 * RÉFLEXION : Quelles props sont nécessaires pour ce modal ?
 *
 * Props obligatoires :
 * - isOpen: boolean              → Modal ouvert ou fermé
 * - close: () => void            → Fonction pour fermer
 * - title: string                → Ex: "Supprimer ?"
 * - description: string          → Ex: "Action irréversible"
 * - onConfirm: () => void        → Fonction appelée quand on clique "Confirmer"
 *
 * Props optionnelles (avec valeurs par défaut) :
 * - onCancel?: () => void        → Fonction appelée quand on clique "Annuler"
 *                                   (Par défaut, juste close)
 * - confirmText?: string         → Texte du bouton confirmer (défaut: "Confirmer")
 * - cancelText?: string          → Texte du bouton annuler (défaut: "Annuler")
 * - variant?: 'default' | 'destructive'  → Style du bouton confirmer
 *
 * Syntaxe :
 * interface ConfirmModalProps {
 *   // ... à compléter
 * }
 */

/**
 * TODO 3: Créer le composant ConfirmModal
 *
 * STRUCTURE DE BASE :
 * -------------------
 * export function ConfirmModal({
 *   isOpen,
 *   close,
 *   title,
 *   description,
 *   onConfirm,
 *   onCancel,
 *   confirmText = "Confirmer",    // Valeur par défaut
 *   cancelText = "Annuler",       // Valeur par défaut
 *   variant = "default"           // Valeur par défaut
 * }: ConfirmModalProps) {
 *   return (
 *     <Dialog open={isOpen} onOpenChange={close}>
 *       <DialogContent>
 *         <DialogHeader>
 *           <DialogTitle>{title}</DialogTitle>
 *           <DialogDescription>{description}</DialogDescription>
 *         </DialogHeader>
 *
 *         <DialogFooter>
 *           // TODO: Ajouter les boutons Annuler et Confirmer
 *         </DialogFooter>
 *       </DialogContent>
 *     </Dialog>
 *   );
 * }
 */

/**
 * TODO 4: Créer les boutons dans DialogFooter
 *
 * LOGIQUE DES BOUTONS :
 * ---------------------
 * 1. Bouton "Annuler" :
 *    - variant="outline" (style moins visible)
 *    - onClick appelle onCancel si fourni, sinon close
 *    - Affiche {cancelText}
 *
 * 2. Bouton "Confirmer" :
 *    - variant={variant} (peut être "destructive" pour les suppressions)
 *    - onClick appelle onConfirm
 *    - Affiche {confirmText}
 *
 * QUESTION : Pourquoi appeler onConfirm mais pas close automatiquement ?
 * RÉPONSE : Parce que onConfirm peut être asynchrone (fetch API).
 *           On laisse l'utilisateur du composant décider quand fermer.
 *
 * Syntaxe :
 * <DialogFooter>
 *   <Button
 *     variant="outline"
 *     onClick={onCancel || close}
 *   >
 *     {cancelText}
 *   </Button>
 *
 *   <Button
 *     variant={variant}
 *     onClick={onConfirm}
 *   >
 *     {confirmText}
 *   </Button>
 * </DialogFooter>
 */

/**
 * 💡 AMÉLIORATION : Gérer le chargement
 *
 * Si onConfirm est une fonction async, on peut ajouter un état de chargement :
 *
 * const [isLoading, setIsLoading] = useState(false);
 *
 * const handleConfirm = async () => {
 *   setIsLoading(true);
 *   await onConfirm();
 *   setIsLoading(false);
 *   close();
 * };
 *
 * <Button disabled={isLoading} onClick={handleConfirm}>
 *   {isLoading ? "Chargement..." : confirmText}
 * </Button>
 */

/**
 * 🎯 EXERCICES DE RÉFLEXION :
 *
 * 1. Pourquoi avoir confirmText et cancelText comme props ?
 *    → Flexibilité : "Supprimer" vs "Confirmer" vs "Oui" selon le contexte
 *
 * 2. Que se passe-t-il si on ne passe pas onCancel ?
 *    → Le bouton Annuler ferme juste le modal (close)
 *
 * 3. Pourquoi variant = "default" et pas "destructive" par défaut ?
 *    → Principe de moindre surprise : par défaut, on veut un style neutre
 *    → L'utilisateur choisit explicitement "destructive" pour les actions dangereuses
 *
 * 4. Comment utiliser ce composant pour supprimer une séance ?
 *    → const deleteModal = useModal();
 *    → <ConfirmModal
 *        {...deleteModal}
 *        title="Supprimer la séance ?"
 *        description="Cette action est irréversible"
 *        onConfirm={async () => {
 *          await workoutsApi.delete(workoutId);
 *          deleteModal.close();
 *        }}
 *        variant="destructive"
 *        confirmText="Supprimer"
 *      />
 */

/**
 * 🏗️ ARCHITECTURE : Comprendre le flux
 *
 * 1. L'utilisateur clique sur un bouton "Supprimer"
 *    → onClick={deleteModal.open}
 *
 * 2. Le modal s'ouvre
 *    → isOpen passe à true
 *
 * 3. L'utilisateur clique "Confirmer"
 *    → onConfirm est appelé
 *    → La fonction de suppression s'exécute
 *    → deleteModal.close() ferme le modal
 *
 * 4. L'utilisateur clique "Annuler" ou le fond
 *    → close est appelé
 *    → isOpen passe à false
 *    → Le modal se ferme
 */

/**
 * 📝 ÉTAPE SUIVANTE :
 * ------------------
 * Une fois ce fichier complété, allez dans app/page.tsx et remplacez
 * vos deux Dialog par <AlertModal> et <ConfirmModal> !
 */
