-- ============================================
-- Migration: Improve profile creation trigger with better error handling
-- Description: Adds exception handling to the profile creation trigger
-- ============================================

-- ============================================
-- FUNCTION: Auto-create profile on user signup (IMPROVED)
-- ============================================
CREATE OR REPLACE FUNCTION create_profile_for_new_user()
RETURNS TRIGGER AS $$
DECLARE
  new_display_name TEXT;
BEGIN
  -- Générer le display_name depuis les métadonnées ou l'email
  new_display_name := COALESCE(
    NEW.raw_user_meta_data->>'display_name',
    split_part(NEW.email, '@', 1),
    'User'  -- Fallback par défaut
  );

  -- Insérer le nouveau profil avec schéma explicite
  INSERT INTO public.profiles (auth_id, display_name)
  VALUES (NEW.id, new_display_name);

  RAISE LOG 'Profile created successfully for user %', NEW.id;

  RETURN NEW;
EXCEPTION
  WHEN unique_violation THEN
    -- Le profil existe déjà, pas grave
    RAISE LOG 'Profile already exists for user %', NEW.id;
    RETURN NEW;
  WHEN OTHERS THEN
    -- Logger l'erreur mais ne pas bloquer la création de l'utilisateur
    RAISE WARNING 'Failed to create profile for user %: % (SQLSTATE: %)', NEW.id, SQLERRM, SQLSTATE;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Le trigger existe déjà, pas besoin de le recréer
-- Il utilise déjà la fonction create_profile_for_new_user()

-- ============================================
-- IMPORTANT: Pour appliquer cette migration
-- ============================================
-- Exécute cette commande depuis le dashboard Supabase ou via CLI:
-- supabase migration up
