-- ============================================
-- Migration: Sync existing auth users to profiles
-- Description: Creates profiles for all existing auth users that don't have one
-- ============================================

-- ============================================
-- FUNCTION: Sync all existing auth users to profiles
-- ============================================
CREATE OR REPLACE FUNCTION sync_auth_users_to_profiles()
RETURNS TABLE(
  auth_user_id UUID,
  user_email TEXT,
  profile_created BOOLEAN,
  message TEXT
) AS $$
DECLARE
  user_record RECORD;
  profile_exists BOOLEAN;
  new_display_name TEXT;
BEGIN
  -- Parcourir tous les utilisateurs auth
  FOR user_record IN
    SELECT u.id, u.email, u.raw_user_meta_data
    FROM auth.users u
  LOOP
    -- V�rifier si un profil existe d�j� pour cet utilisateur
    SELECT EXISTS(
      SELECT 1 FROM profiles WHERE auth_id = user_record.id
    ) INTO profile_exists;

    IF NOT profile_exists THEN
      -- Cr�er le display_name depuis metadata ou email
      new_display_name := COALESCE(
        user_record.raw_user_meta_data->>'display_name',
        split_part(user_record.email, '@', 1)
      );

      -- Cr�er le profil
      INSERT INTO profiles (auth_id, display_name)
      VALUES (user_record.id, new_display_name);

      -- Retourner le r�sultat
      auth_user_id := user_record.id;
      user_email := user_record.email;
      profile_created := TRUE;
      message := 'Profile created with display_name: ' || new_display_name;
      RETURN NEXT;
    ELSE
      -- Profil existe d�j�
      auth_user_id := user_record.id;
      user_email := user_record.email;
      profile_created := FALSE;
      message := 'Profile already exists';
      RETURN NEXT;
    END IF;
  END LOOP;

  RETURN;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- EXECUTION: Run the sync
-- ============================================
-- Ex�cuter la synchronisation et afficher les r�sultats
SELECT * FROM sync_auth_users_to_profiles();

-- ============================================
-- CLEANUP (optionnel)
-- ============================================
-- Supprimer la fonction apr�s utilisation si tu veux
-- DROP FUNCTION IF EXISTS sync_auth_users_to_profiles();
