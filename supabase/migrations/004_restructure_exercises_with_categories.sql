-- ============================================
-- Migration: Restructure exercises with categories
-- Description: Creates categories table and restructures exercises table
-- ============================================

-- ============================================
-- STEP 1: Drop existing exercises table
-- ============================================
DROP TABLE IF EXISTS exercises CASCADE;

-- ============================================
-- STEP 2: Create categories table
-- ============================================
CREATE TABLE categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  image TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- STEP 3: Create new exercises table
-- ============================================
CREATE TABLE exercises (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  category_id TEXT NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
  image TEXT NOT NULL,
  description TEXT,
  is_active BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for faster queries
CREATE INDEX idx_exercises_category_id ON exercises(category_id);
CREATE INDEX idx_exercises_is_active ON exercises(is_active);

-- ============================================
-- STEP 4: Insert categories
-- ============================================
INSERT INTO categories (id, name, image) VALUES
  ('epaules', 'Épaules', 'https://www.docteur-fitness.com/wp-content/uploads/2021/08/presse-epaule.jpg'),
  ('biceps', 'Biceps', 'https://www.docteur-fitness.com/wp-content/uploads/2021/10/curl-biceps-poulie-basse-musculation.jpg'),
  ('pectoraux', 'Pectoraux', 'https://www.docteur-fitness.com/wp-content/uploads/2000/06/developpe-incline-machine-convergente-pectoraux.jpg'),
  ('dos', 'Dos', 'https://www.docteur-fitness.com/wp-content/uploads/2021/08/tirage-vertical-prise-serree-dos.jpg');

-- ============================================
-- STEP 5: Insert exercises from JSON
-- ============================================

-- Exercises for category: Épaules
INSERT INTO exercises (title, category_id, image, description, is_active) VALUES
  ('Élévation frontale sur banc incliné', 'epaules', 'https://www.docteur-fitness.com/wp-content/uploads/2023/08/elevation-frontale-banc-incline-exercice-epaule.jpg', 'Cette variante des élévations frontales cible spécifiquement les muscles deltoïdes antérieurs et les muscles du haut du dos (trapèzes). Cet exercice est particulièrement apprécié pour sa capacité à isoler et…', false),
  ('Développé épaules assis', 'epaules', 'https://www.docteur-fitness.com/wp-content/uploads/2023/05/developpe-epaules-assis-exercice-epaule-deltoide-halteres.jpg', 'Le développé épaules assis est un exercice de musculation original et exigeant qui cible le haut du corps, en particulier les muscles des épaules (et les triceps dans une moindre…', false),
  ('Russian twist avec développé épaules', 'epaules', 'https://www.docteur-fitness.com/wp-content/uploads/2023/07/russian-twist-avec-developpe-epaule-exercice-combine-abdos-deltoide-musculation-fonctionnelle.jpg', 'L''exercice avec développé épaules (en anglais Russian Twist with Overhead Press) est une combinaison dynamique entre le Russian Twist et le développé épaules, offrant une approche complète de renforcement musculaire.…', false),
  ('Développé militaire', 'epaules', 'https://www.docteur-fitness.com/wp-content/uploads/2021/08/developpe-militaire-epaules.jpg', 'Le développé militaire (military press) est un exercice qui permet de solliciter les muscles des épaules, des pectoraux, du haut du dos, des triceps et de la ceinture abdominale, ce…', false),
  ('Développé Arnold', 'epaules', 'https://www.docteur-fitness.com/wp-content/uploads/2021/08/developpe-arnold-epaules.jpg', 'Le développé Arnold (dumbbell Arnold press) est un exercice très efficace pour développer les muscles deltoïdes. Il s''agit d''une variante unique du développé épaules avec haltères, qui doit son nom…', false),
  ('Face pull', 'epaules', 'https://www.docteur-fitness.com/wp-content/uploads/2022/01/face-pull-exercice-epaules.jpg', 'Le face pull est un exercice d''isolation à la poulie qui permet de faire travailler principalement les épaules et secondairement le dos. Il cible spécifiquement les deltoïdes postérieurs (arrière des…', false),
  ('Élévations latérales à la poulie', 'epaules', 'https://www.docteur-fitness.com/wp-content/uploads/2022/02/elevations-laterales-poulie-exercice-deltoide.jpg', 'Les élévations latérales à la poulie sont une variante très appréciée pour l''entraînement des épaules. Il s''agit d''un exercice d''isolation permettant de cibler précisément les muscles deltoïdes. Les élévations latérales…', false),
  ('Élévations latérales à la machine/machine', 'epaules', 'https://www.docteur-fitness.com/wp-content/uploads/2022/03/elevation-laterale-machine-exercice-epaules.jpg', 'Les élévations latérales guidées à la machine permettent d''isoler et de développer efficacement le chef latéral du deltoïde afin de lui donner cette largeur tant recherchée.Bien que la version de…', false),
  ('Développé épaules avec haltères', 'epaules', 'https://www.docteur-fitness.com/wp-content/uploads/2022/02/developpe-epaule-halteres-exercice-musculation-deltoide.jpg', 'L''exercice du développé épaules avec haltères est un excellent choix pour l''entraînement des épaules. Il s''agit d''un exercice de base qui nécessite une bonne coordination.Bien sûr, il est aussi possible…', true),
  ('Développé épaules debout à la landmine', 'epaules', 'https://www.docteur-fitness.com/wp-content/uploads/2022/02/developpe-landmine-exercice-muscle-deltoide.jpg', 'Le développé à la landmine (en anglais landmine press) est un exercice de musculation qui consiste à lever une barre calée dans une « mine de terre ».Cet exercice fait travailler plusieurs…', false),
  ('Rotation externe de l''épaule à la poulie', 'epaules', 'https://www.docteur-fitness.com/wp-content/uploads/2022/04/rotation-externe-epaule-poulie-coiffe-rotateurs.jpg', 'Le muscle infra-épineux ou sous-épineux de l''épaule est responsable de la rotation externe de l''humérus et il est important pour la stabilisation de l''épaule. Les rotateurs de l''épaule sont essentiels…', false),
  ('Pec deck inversé', 'epaules', 'https://www.docteur-fitness.com/wp-content/uploads/2021/12/pec-deck-inverse-exercice-epaules.jpg', 'Le pec deck inversé (machine Reverse Fly ou reverse butterfly en anglais) est une variante sur machine des élévations latérales buste penché (exercice communément appelé « l''oiseau »), un exercice utilisé pour…', false),
  ('Élévations frontales', 'epaules', 'https://www.docteur-fitness.com/wp-content/uploads/2021/08/elevation-frontale-epaules.jpg', 'Les élévations frontales avec haltères (dumbbell front raise) sont un exercice de musculation qui cible les muscles des épaules, et plus particulièrement la partie antérieure des muscles.C''est un exercice dit…', false),
  ('Élévations latérales', 'epaules', 'https://www.docteur-fitness.com/wp-content/uploads/2000/08/elevations-laterales-epaules.jpg', 'Les élévations latérales (dumbbell lateral raise) sont un exercice de musculation pour les épaules qui consiste à élever une paire d''haltères sur les côtés du corps.Avec une bonne technique, les…', false),
  ('Presse à épaules inclinée', 'epaules', 'https://www.docteur-fitness.com/wp-content/uploads/2021/08/presse-epaule.jpg', 'Cette machine guidée pour travailler les muscles deltoïdes est excellente que vous ayez envie de prendre de la force ou d''obtenir des épaules musclées.Comparé à un exercice avec charges libres,…', false),
  ('Élévations latérales avec kettlebell', 'epaules', 'https://www.docteur-fitness.com/wp-content/uploads/2021/12/elevation-laterales-avec-kettlebell-exercice-epaules.jpg', 'Les élévations latérales avec kettlebells (kettlebell lateral raise) sont une variante des élévations latérales et c''est un exercice qui permet de renforcer les muscles de l''épaule.L''utilisation de kettlebells, notamment pour…', false),
  ('Tirage menton avec kettlebell', 'epaules', 'https://www.docteur-fitness.com/wp-content/uploads/2021/12/tirage-menton-avec-kettlebell-exercice-epaules.jpg', 'Le tirage menton avec kettlebell (en anglais kettlebell upright rows) est un exercice composé qui cible les deltoïdes et les trapèzes. Il sollicite aussi dans une moindre mesure les biceps…', false),
  ('Développé épaule avec kettlebell', 'epaules', 'https://www.docteur-fitness.com/wp-content/uploads/2021/12/developpe-epaule-kettlebell-exercice-deltoide.jpg', 'Le développé debout avec kettlebell à un bras (single arm kettlebell push press) est un exercice permettant de renforcer les muscles des épaules.La kettlebell constitue un accessoire unique, car le…', false),
  ('Tirage menton barre guidée', 'epaules', 'https://www.docteur-fitness.com/wp-content/uploads/2021/11/tirage-menton-machine-guidee-exercice-epaules.jpg', 'Le tirage menton barre guidée est une variante du tirage menton barre libre et c''est un exercice utilisé pour cibler les muscles des épaules.La Smith Machine permet de réaliser un…', false),
  ('Élévations latérales avec landmine', 'epaules', 'https://www.docteur-fitness.com/wp-content/uploads/2021/08/elevation-laterale-landmine-epaules.jpg', 'Le mouvement en arc de cercle des élévations latérales avec landmine (landmine lateral raise) cible vos muscles deltoïdes.Par rapport à d''autres variations d''élévations latérales travaillant uniquement les deltoïdes antérieurs et…', false),
  ('Oiseau assis sur un banc ou debout', 'epaules', 'https://www.docteur-fitness.com/wp-content/uploads/2021/12/oiseau-assis-sur-banc-exercice-epaule.jpg', 'L''oiseau avec haltères en position assise sur un banc (en anglais seated bent over dumbbell reverse fly) est une variante de l''oiseau debout buste penché avec haltères. C''est un exercice…', true),
  ('Développé épaule unilatéral avec élastique', 'epaules', 'https://www.docteur-fitness.com/wp-content/uploads/2022/08/developpe-epaule-unilateral-avec-elastique-exercice-musculation.jpg', 'Si vous ne deviez choisir qu''un seul exercice pour muscler les épaules, ce serait probablement un mouvement de développé. Mais il n''est pas nécessaire d''avoir des charges libres pour faire…', false),
  ('Développé épaules à la Smith machine', 'epaules', 'https://www.docteur-fitness.com/wp-content/uploads/2022/08/developpe-epaules-smith-machine-musculation-debutant.jpg', 'Le développé épaules est un exercice composé du haut du corps très intéressant. Il peut être effectué à l''aide de poids libres comme les haltères, les kettlebells, les bandes de…', false),
  ('Tirage menton avec élastique', 'epaules', 'https://www.docteur-fitness.com/wp-content/uploads/2022/02/tirage-vertical-avec-elastique-exercice-muscle-epaule.jpg', 'Le tirage vertical, aussi appelé tirage menton ou rowing menton (en anglais upright rows), est un exercice très populaire pour travailler les deltoïdes ainsi que les muscles trapèzes. Cet exercice…', false),
  ('Oiseau avec élastique', 'epaules', 'https://www.docteur-fitness.com/wp-content/uploads/2022/09/oiseau-avec-elastique-exercice-muscler-epaules.jpg', 'L''oiseau avec élastique, aussi appelé élévation latérale buste penché (en anglais bent over reverse fly) est une variante de l''oiseau avec haltère qui permet de renforcer les muscles des épaules.Cet…', false),
  ('Développé épaules avec élastique', 'epaules', 'https://www.docteur-fitness.com/wp-content/uploads/2022/08/developpe-epaules-avec-elastique-muscler-deltoides.jpg', 'Le développé épaules est le meilleur des exercices pour développer la force et la masse musculaire des deltoïdes. Le développé épaules avec élastique est une excellente variante qui vous permettra…', false),
  ('Élévations latérales inclinées avec haltère', 'epaules', 'https://www.docteur-fitness.com/wp-content/uploads/2022/06/elevation-laterale-incline-haltere-exercice-deltoide-externe.jpg', 'Les élévations latérales inclinées (en anglais leaning dumbbell lateral raise) améliorent l''esthétique générale et la définition de vos épaules. Par rapport aux élévations latérales avec haltère classique, cette variante en…', false),
  ('Rotation externe de l''épaule couchée avec haltère', 'epaules', 'https://www.docteur-fitness.com/wp-content/uploads/2022/06/rotation-externe-epaule-haltere-exercice-coiffe-des-rotateurs.jpg', 'La plupart d''entre nous se sont blessés ou ont entendu quelqu''un qui s''est blessé la coiffe des rotateurs. Celle-ci est constituée d''une combinaison de 4 muscles de l''épaule qui stabilisent…', false),
  ('Handstand push-up', 'epaules', 'https://www.docteur-fitness.com/wp-content/uploads/2022/04/handstand-push-up-exercice-epaule-poids-de-corps.jpg', 'La plupart des gens font des variantes du overhead press (développé militaire) et différents exercices d''isolation pour se muscler les épaules. Pourtant, il existe un exercice de musculation oublié de…', false),
  ('Pompes piquées', 'epaules', 'https://www.docteur-fitness.com/wp-content/uploads/2022/06/pike-push-up-exercice-epaules-deltoides.jpg', 'Les pompes piquées ou pompes pour les épaules (en anglais pike push-up) sont un excellent exercice pour muscler les deltoïdes antérieurs, les triceps et le haut des pectoraux au poids…', false),
  ('Croix de fer avec haltères', 'epaules', 'https://www.docteur-fitness.com/wp-content/uploads/2022/04/croix-de-fer-halteres-exercice-epaules-cuisses.jpg', 'Il y a de fortes chances que vous n''ayez jamais entendu parler de cet exercice ou que vous ne l''ayez jamais vu être effectué. Et pourtant, la croix de avec…', false),
  ('Extension horizontale des épaules avec élastique', 'epaules', 'https://www.docteur-fitness.com/wp-content/uploads/2022/03/extension-horizontale-de-epaule-elastique-musculation.jpg', 'Cet exercice avec élastique (appelé en anglais band pull apart) est excellent pour travailler et renforcer les muscles de l''arrière des épaules. Avec un élastique de faible résistance, les extensions…', false),
  ('Thruster avec kettlebell', 'epaules', 'https://www.docteur-fitness.com/wp-content/uploads/2021/12/thruster-kettlebell-exercice-quadriceps-epaules.jpg', 'Le thruster avec kettlebell est une variante du thruster avec haltères. C''est un exercice combiné qui associe le mouvement du squat avant à celui du développé militaire.Par conséquent, le thruster…', false),
  ('Développé épaule unilatéral à genou avec landmine', 'epaules', 'https://www.docteur-fitness.com/wp-content/uploads/2022/11/developpe-epaules-unilateral-landmine-exercice-bodybuilding.jpg', 'Le développé épaule avec landmine est une variante exceptionnelle du mouvement de base qu''est le développé vertical. En raison de l''angle de travail particulier selon lequel vous poussez vers le…', false),
  ('Élévations latérales unilatérales à la poulie', 'epaules', 'https://www.docteur-fitness.com/wp-content/uploads/2022/11/elevations-laterales-unilaterale-poulie-exercice-epaules-larges.jpg', 'Si vous voulez des épaules larges, qui donneront l''illusion d''une taille fine, et si vous voulez que vos muscles deltoïdes soient bien ronds, il est essentiel de ne pas se…', false),
  ('Développé épaules assis avec élastique', 'epaules', 'https://www.docteur-fitness.com/wp-content/uploads/2022/11/developpe-epaules-assis-avec-elastique-exercice-bureau.jpg', 'Le développé épaules assis avec élastique est un exercice idéal à faire à la maison ou au bureau pour renforcer et développer des deltoïdes forts et musclés. Bien que cet…', false),
  ('Développé épaules à la machine', 'epaules', 'https://www.docteur-fitness.com/wp-content/uploads/2022/11/developpe-epaules-a-la-machine-shoulder-press-exercice-basic-fit.jpg', 'Le développé épaules (en anglais overhead press) peut être réalisé avec des haltères, une barre ou une machine. Les développés avec barre sont privilégiés dans les sports de force, et…', false),
  ('Oiseau inversé avec sangles de suspension', 'epaules', 'https://www.docteur-fitness.com/wp-content/uploads/2022/10/oiseau-inverse-avec-sangles-de-suspension-exercice-arriere-epaules.jpg', 'L''oiseau inversé fait partie des exercices les plus élémentaires pour l''entraînement des épaules. Ce mouvement au poids du corps cible l''arrière des épaules et le haut du dos en utilisant…', false),
  ('Thruster avec landmine', 'epaules', 'https://www.docteur-fitness.com/wp-content/uploads/2022/10/thruster-landmine-exercice-compose-jambe-epaule.jpg', 'Le thruster avec landmine est un exercice combiné qui associe un squat avec landmine et un développé épaule à la landmine. Cet exercice complet cible à la fois les muscles…', false),
  ('Rotations cubaines', 'epaules', 'https://www.docteur-fitness.com/wp-content/uploads/2022/06/rotation-externe-vertical-epaule-haltere-exercice-coiffe-rotateurs.jpg', 'La rotation cubaine avec haltères n''a pas pour but de développer la masse musculaire. Il s''agit d''un exercice qui permet de préserver la santé de l''épaule en renforçant trois des…', false),
  ('Élévations frontales à la poulie basse', 'epaules', 'https://www.docteur-fitness.com/wp-content/uploads/2022/04/elevation-frontale-poulie-basse-exercice-muscul-epaules.jpg', 'Les élévations frontales à la poulie (double cable front raise) sont un exercice d''isolation qui permet de muscler et de renforcer les deltoïdes antérieurs. L''utilisation des poulies constitue une excellente…', false),
  ('Thruster', 'epaules', 'https://www.docteur-fitness.com/wp-content/uploads/2022/04/thruster-exercice-crossfit.jpg', 'Depuis sa création, le CrossFit a fait découvrir de nombreux exercices et méthodes d''entraînement moins connus à un public plus large. Sans le CrossFit, les kettlebells n''auraient probablement pas connu…', false),
  ('Développé nuque barre guidée', 'epaules', 'https://www.docteur-fitness.com/wp-content/uploads/2022/08/developpe-nuque-barre-guidee-muscu-epaule-debutant.jpg', 'Cet exercice, réalisé à l''aide d''une Smith machine, entraîne une pression sur les muscles de la coiffe des rotateurs qui stabilisent les articulations de l''épaule. C''est pour cette raison qu''il…', false);

-- Exercises for category: Biceps
INSERT INTO exercises (title, category_id, image, description, is_active) VALUES
  ('Curl à la barre', 'biceps', 'https://www.docteur-fitness.com/wp-content/uploads/2021/09/curl-barre-biceps.jpg', 'L''entraînement des biceps peut être relégué au second plan par rapport à des mouvements de force plus populaires comme le squat, le soulevé de terre et le développé couché.Certes, il…', false),
  ('Curl concentré', 'biceps', 'https://www.docteur-fitness.com/wp-content/uploads/2021/09/curl-concentre-biceps.jpg', 'Le curl concentré est un mouvement de la vieille école qui peut produire de vrais résultats, mais seulement si vous êtes prêt à travailler avec une bonne technique.Contrairement aux curls…', false),
  ('Curl pupitre barre EZ', 'biceps', 'https://www.docteur-fitness.com/wp-content/uploads/2022/01/curl-au-pupitre-barre-ez-larry-scott-exercice-biceps.jpg', 'Le curl assis au pupitre barre EZ (en anglais curl Larry Scott, du nom de son inventeur) offre un certain nombre d''avantages que vous ne trouverez peut-être pas dans un…', true),
  ('Curl allongé à la poulie', 'biceps', 'https://www.docteur-fitness.com/wp-content/uploads/2022/01/curl-allonge-a-la-poulie-exercice-biceps.jpg', 'Le curl allongé à la poulie est un exercice qui isole parfaitement les biceps, mais également les avant-bras. En position allongée, votre corps ne peut pas se pencher vers l''avant…', false),
  ('Curl poulie en position squat', 'biceps', 'https://www.docteur-fitness.com/wp-content/uploads/2022/02/curl-poulie-en-position-squat-exerice-biceps.jpg', 'Cette variante du curl à la poulie (en anglais squatting cable curl) est un exercice qui permet de développer et renforcer les biceps, avec le corps en position de squat…', false),
  ('Curl au pupitre à la poulie', 'biceps', 'https://www.docteur-fitness.com/wp-content/uploads/2022/02/curl-pupitre-poulie-exercice-biceps-560x420.jpg', 'Depuis que Pumping Iron a popularisé le culturisme moderne en 1977, l''hypertrophie du biceps brachial a depuis été au premier plan de pratiquement tous les programmes de musculation depuis.Les flexions…', false),
  ('Curl biceps assis à la machine', 'biceps', 'https://www.docteur-fitness.com/wp-content/uploads/2022/01/curl-biceps-pupitre-machine-prechargee.jpg', 'Le curl biceps assis à la machine est un excellent exercice pour ceux qui souhaitent entraîner leurs biceps de manière intensive, et en toute sécurité. En fonction de la machine,…', false),
  ('Curl haltère debout sur banc incliné', 'biceps', 'https://www.docteur-fitness.com/wp-content/uploads/2022/02/curl-haltere-debout-banc-incline-exercice-biceps-brachial.jpg', 'Le curl debout avec haltère sur banc incliné (en anglais standing one-arm dumbbell curl over incline bench) est un mélange du curl sur un pupitre et du curl concentré. Le…', false),
  ('Curl Spider', 'biceps', 'https://www.docteur-fitness.com/wp-content/uploads/2022/01/spider-curl-exercice-biceps.jpg', 'Le curl spider (que certains traduisent en curl araignée) est un exercice d''isolation efficace pour développer les biceps. L''utilisation d''un banc incliné comme support permet de réaliser un mouvement strict…', false),
  ('Curl haltère incliné avec rotation', 'biceps', 'https://www.docteur-fitness.com/wp-content/uploads/2021/10/curl-haltere-incline-biceps.jpg', 'Le curl incliné avec haltères est une variante du curl traditionnel avec haltères utilisée pour augmenter la taille des biceps.Le biceps est un muscle très facile (et plaisant) à cibler…', false),
  ('Curl biceps à la poulie basse', 'biceps', 'https://www.docteur-fitness.com/wp-content/uploads/2021/10/curl-biceps-poulie-basse-musculation.jpg', 'Le curl à la poulie fait principalement travailler le biceps brachial, qui est le muscle à deux chefs situé à l''avant de votre bras et qui fusionne en un seul…', false),
  ('Traction supination', 'biceps', 'https://www.docteur-fitness.com/wp-content/uploads/2021/08/chin-up-traction-supination-dos.jpg', 'Une traction en supination (chin up) est un exercice composé qui permet de faire travailler plusieurs groupes de muscles du haut du corps, en particulier ceux du dos (grands dorsaux,…', false),
  ('Curl Zottman', 'biceps', 'https://www.docteur-fitness.com/wp-content/uploads/2022/01/curl-zottman-exercice-biceps.jpg', 'Le curl Zottman est un exercice unique avec haltères qui combine un curl biceps classique (main en supination), une rotation des poignets en haut du mouvement, puis un curl en…', false),
  ('Curl en prise marteau avec élastique', 'biceps', 'https://www.docteur-fitness.com/wp-content/uploads/2022/01/curl-avec-elastique-exercice-biceps.jpg', 'L''utilisation de bandes est un moyen ludique et efficace de varier vos entraînements et de stimuler votre corps. Les bandes élastiques offrent une résistance et une tension à toutes les…', false),
  ('Curl à la poulie vis-à-vis', 'biceps', 'https://www.docteur-fitness.com/wp-content/uploads/2021/10/curl-poulie-vis-a-vis-biceps.jpg', 'Le curl à la poulie vis à vis est un exercice d''isolation permettant de muscler et de renforcer les biceps.Le biceps étant composé de deux faisceaux (long et court), il…', false),
  ('Drag curl avec haltères', 'biceps', 'https://www.docteur-fitness.com/wp-content/uploads/2022/09/drag-curl-halteres-assis-exercice-gros-biceps.jpg', 'La plupart des gens sont d''accord pour dire qu''un curl est un curl, quelle que soit la façon dont on le fait. C''est vrai dans la plupart des cas. Mais…', false),
  ('Curl inversé à la barre', 'biceps', 'https://www.docteur-fitness.com/wp-content/uploads/2022/04/curl-inverse-barre-exercice-biceps.jpg', 'Le curl inversé à la barre ou curl barre en pronation (en anglais reverse barbell curl) est un exercice incontournable pour l''entraînement des bras. Bien sûr, le curl classique à…', false),
  ('Curl haltères prise neutre', 'biceps', 'https://www.docteur-fitness.com/wp-content/uploads/2022/09/curl-haltere-prise-neutre-exercice-biceps-enorme.jpg', 'Des bras plus gros et plus forts figurent généralement en haut de la liste des priorités des pratiquants de la musculation. Pour cela, le curl en prise neutre ou curl…', true),
  ('Drag curl à la Smith machine', 'biceps', 'https://www.docteur-fitness.com/wp-content/uploads/2022/08/drag-curl-smith-machine-exercice-biceps-brachial.jpg', 'Les drag curls à la Smith Machine sont un excellent exercice pour isoler le muscle biceps, car la stabilité de la barre est assurée par le cadre guidé. Ainsi, vous…', false),
  ('Drag curl', 'biceps', 'https://www.docteur-fitness.com/wp-content/uploads/2022/06/drag-curl-exercice-biceps.jpg', 'Le drag curl à la barre est une variante du curl avec barre qui permet de muscler les biceps. Avoir de gros biceps est un objectif pour de nombreux sportifs…', false),
  ('Curl biceps alterné avec haltères', 'biceps', 'https://www.docteur-fitness.com/wp-content/uploads/2022/08/curl-avec-halteres-alterne-exercice-biceps-long-large.jpg', 'Le curl biceps alterné avec haltères (en anglais Twisting Standing Dumbbell Curl) est un exercice populaire pour la musculation des biceps. Les avant-bras sont secondairement sollicités et les muscles abdominaux…', false),
  ('Waiter curl', 'biceps', 'https://www.docteur-fitness.com/wp-content/uploads/2022/06/waiter-curl-exercice-biceps-haltere.jpg', 'Le waiter curl n''est pas un exercice que vous verrez souvent dans votre salle de musculation. La plupart des débutants connaissent déjà d''autres variantes de curl pour les biceps, comme…', false),
  ('Curl biceps alterné en supination sur banc incliné', 'biceps', 'https://www.docteur-fitness.com/wp-content/uploads/2022/09/curl-biceps-alterne-sur-banc-incline-longue-portion.jpg', 'Le curl avec haltères inclinés (en anglais Dumbbell Incline Curl) est un exercice de musculation très apprécié et est couramment inclus dans les programmes d''entraînement pour les bras des bodybuilders…', true),
  ('Curl biceps avec élastique', 'biceps', 'https://www.docteur-fitness.com/wp-content/uploads/2023/07/curl-biceps-prise-pronation-bande-elastique-exercice-muscu.jpg', 'Le curl biceps avec élastique, également appelé « Band Biceps Curl » en anglais, est un exercice de musculation qui permet de renforcer et de muscler le biceps brachial. Cet exercice est…', false),
  ('Curl unilatéral avec sangles de suspension', 'biceps', 'https://www.docteur-fitness.com/wp-content/uploads/2022/11/curl-unilateral-avec-sangles-de-suspension-exercice-biceps-vacances.jpg', 'Vous n''avez ni le temps ni le budget pour vous abonner à une salle de sport ? Vous faites peut-être partie de ces personnes qui pensent qu''une salle de musculation…', false),
  ('Curl haltère prise marteau au pupitre', 'biceps', 'https://www.docteur-fitness.com/wp-content/uploads/2021/10/curl-haltere-prise-marteau-pupitre-biceps.jpg', 'Le curl haltère en prise marteau est un exercice très efficace qui cible le muscle brachio-radial, le muscle brachial, et le biceps.En utilisant une prise marteau/neutre, vous ciblez davantage les…', false),
  ('Curl avec sangles de suspension', 'biceps', 'https://www.docteur-fitness.com/wp-content/uploads/2022/10/curl-avec-sangles-de-suspension-exercice-biceps.jpg', 'Le curl biceps avec sangles de suspension permet de se muscler les biceps au poids de corps à la maison ou à l''extérieur, du moment que vous trouvez un point…', false),
  ('Curl incliné à la poulie', 'biceps', 'https://www.docteur-fitness.com/wp-content/uploads/2022/05/curl-incline-poulie-exercice-biceps.jpg', 'Le curl incliné à la poulie est un exercice d''isolation très efficace pour développer les biceps et les muscles de l''avant-bras.Vous obtiendrez de meilleurs résultats avec cet exercice en utilisant…', false);

-- Exercises for category: Pectoraux
INSERT INTO exercises (title, category_id, image, description, is_active) VALUES
  ('Pompes inclinées sur Smith Machine', 'pectoraux', 'https://www.docteur-fitness.com/wp-content/uploads/2023/07/pompes-inclinees-sur-smith-machine-exercice-musculation-pectoraux-debutant.jpg', 'Les pompes sont des mouvements classiques de musculation au poids du corps, largement reconnus pour leur efficacité à renforcer le haut du corps. Pour les débutants qui cherchent à adapter…', false),
  ('Pompes inclinées avec sangles de suspension', 'pectoraux', 'https://www.docteur-fitness.com/wp-content/uploads/2023/08/pompes-inclinees-avec-sangles-de-suspension-exercice-musculation-maison-pectoraux.jpg', 'Les pompes inclinées avec sangles de suspension sont un exercice au poids du corps qui sollicite plusieurs groupes musculaires en même temps. Il s''agit d''une variante avancée des pompes classiques,…', false),
  ('Développé couché', 'pectoraux', 'https://www.docteur-fitness.com/wp-content/uploads/2019/08/developpe-couche-exercice-pectoraux.jpg', 'Le « bench press » ou développé couché est l''un des premiers exercices que la plupart des pratiquants apprennent lorsqu''ils commencent la musculation. C''est de loin l''exercice le plus populaire effectué dans…', true),
  ('Développé incliné à la barre', 'pectoraux', 'https://www.docteur-fitness.com/wp-content/uploads/2021/10/developpe-incline-barre-exercice-pectoraux.jpg', 'Le développé couché est le roi des exercices pour les pectoraux, car il développe une force massive et permet de bien développer les muscles du torse (pectoraux). La variante inclinée…', true),
  ('Écartés couché avec haltères', 'pectoraux', 'https://www.docteur-fitness.com/wp-content/uploads/2022/09/ecarte-couche-haltere-musculation-creux-pectoraux.jpg', 'Le développé couché est considéré comme l''exercice de base pour les pectoraux, mais il présente certaines limites. La principale limite est qu''il ne s''agit pas d''un exercice pour les « pectoraux ».…', false),
  ('Écartés à la poulie vis-à-vis', 'pectoraux', 'https://www.docteur-fitness.com/wp-content/uploads/2021/06/ecartes-poulie-vis-a-vis.jpg', 'Les écartés à la poulie vis-à-vis (cable middle fly) sont une variante du Pec Deck ou Butterfly à la machine, un exercice pour renforcer les muscles pectoraux, et de l''avant…', false),
  ('Développé couché haltères', 'pectoraux', 'https://www.docteur-fitness.com/wp-content/uploads/2021/05/developpe-couche-halteres.jpg', 'Le développé couché avec haltères (dumbbell bench press) est une variante du développé couché à la barre. C''est un exercice qui permet de développer les muscles pectoraux.On recommande généralement de…', false),
  ('Dips aux barres parallèles', 'pectoraux', 'https://www.docteur-fitness.com/wp-content/uploads/2021/04/dips.jpg', 'Les dips sont un des exercices de musculation les plus sous-estimés. Avec l''abondance de machines disponibles pour travailler les bras, les épaules et les pectoraux, on a tendance à oublier…', false),
  ('Pec-deck ou butterfly', 'pectoraux', 'https://www.docteur-fitness.com/wp-content/uploads/2000/06/pec-deck-butterfly-exercice-pectoraux.jpg', 'Cet appareil de musculation est souvent négligé en salle, car il existe de nombreuses autres possibilités de travailler les muscles pectoraux.Le pec deck, anciennement appelé butterfly, permet aux débutants comme…', true),
  ('Développé incliné à la machine convergente', 'pectoraux', 'https://www.docteur-fitness.com/wp-content/uploads/2000/06/developpe-incline-machine-convergente-pectoraux.jpg', 'Le développé incliné à la machine convergente (leverage incline chest press) est une variante du développé couché incliné avec haltères qui permet de travailler les muscles pectoraux. Elle cible aussi…', false),
  ('Développé décliné à la barre', 'pectoraux', 'https://www.docteur-fitness.com/wp-content/uploads/2021/12/developpe-decline-barre-exercice-pectoraux.jpg', 'Le développé décliné à la barre (decline barbell bench press) est une variante du développé couché. C''est un exercice utilisé pour solliciter les muscles pectoraux. Il cible aussi indirectement les…', false),
  ('Écartés décliné avec haltères', 'pectoraux', 'https://www.docteur-fitness.com/wp-content/uploads/2021/11/ecartes-decline-avec-halteres-exercice-pectoraux.jpg', 'Les écartés décliné avec haltères sont une variation des écartés pour travailler les pectoraux et plus particulièrement la partie basse des muscles pectoraux. Et même si on ne peut pas…', false),
  ('Écartés Hyght', 'pectoraux', 'https://www.docteur-fitness.com/wp-content/uploads/2022/06/hyght-dumbell-fly-exercice-haut-pectoraux.jpg', 'Les écartés Hyght (en anglais Hyght dumbbell fly) sont une variante des écartés imaginée par le Dr Clay Hyght, bodybuilder et coach, pour cibler efficacement le haut des pectoraux (partie…', false),
  ('Développé couché prise inversée', 'pectoraux', 'https://www.docteur-fitness.com/wp-content/uploads/2022/01/developpe-couche-prise-inversee-exercice-pectoraux.jpg', 'Le développé couché prise inversée (en anglais reverse grip bench press) est une variante du développé couché effectuée avec les mains en supination (paumes vers le haut). Ce changement de…', false),
  ('Écartés unilatéraux à la landmine', 'pectoraux', 'https://www.docteur-fitness.com/wp-content/uploads/2022/04/ecartes-unilateral-landmine-pectoraux-exercice.jpg', 'Les écartés à la landmine sont similaires aux écartés avec haltères. Le mouvement de pivotement de la landmine permet une trajectoire appropriée pour activer vos pectoraux lors des écartés.Comme n''importe…', false),
  ('Pompes', 'pectoraux', 'https://www.docteur-fitness.com/wp-content/uploads/2020/10/pompe-musculation-exercice-pectoraux-triceps.jpg', 'Quand vous pensez aux pompes, qu''est-ce qui vous vient à l''esprit ? Peut-être au défi 30 jours pour arriver à faire 100 pompes. Ou aux pénalités infligées lors de votre…', false),
  ('Développé couché avec chaînes', 'pectoraux', 'https://www.docteur-fitness.com/wp-content/uploads/2021/12/developpe-couche-avec-chaines-exercice-pectoraux.jpg', 'Le développé couché avec chaînes est une variante du développé couché à la barre. C''est un exercice qui permet de renforcer les muscles pectoraux.L''utilisation de chaînes, notamment dans le développé…', false),
  ('Développé décliné avec haltère', 'pectoraux', 'https://www.docteur-fitness.com/wp-content/uploads/2021/12/developpe-decline-halteres-exercice-pectoraux.jpg', 'Le développé décliné avec haltères (decline dumbbell bench press) est une variante du développé couché décliné avec barre. En utilisant des haltères lors d''un développé couché décliné, vous bénéficiez d''une…', false),
  ('Pullover avec haltère', 'pectoraux', 'https://www.docteur-fitness.com/wp-content/uploads/2021/12/pullover-haltere-exercice-dos.jpg', 'Le pullover avec haltères permet de faire travailler les muscles de la poitrine et les grands dorsaux (les muscles du milieu et du bas du dos). Cela en fait un…', false),
  ('Développé couché à la Smith machine', 'pectoraux', 'https://www.docteur-fitness.com/wp-content/uploads/2022/08/developpe-couche-smith-machine-musculation-debutant.jpg', 'Les Smith machines ont tendance à avoir mauvaise réputation. Mais il est temps d''inverser ce paradigme. Si elles sont utilisées de manière appropriée, les Smith machines peuvent vous aider à…', false),
  ('Hex press à la Smith machine', 'pectoraux', 'https://www.docteur-fitness.com/wp-content/uploads/2022/08/hex-press-a-la-smith-machine-interieur-pectoraux.jpg', 'Le hex press à la Smith machine est un excellent exercice pour travailler les pectoraux, bien qu''il soit quelque peu oublié et très sous-estimé. En fait, pour tout dire, cet…', false),
  ('Écartés couché à la poulie vis-à-vis', 'pectoraux', 'https://www.docteur-fitness.com/wp-content/uploads/2022/04/ecartes-poulie-vis-a-vis-exercice-isoler-pectoraux.jpg', 'Les écartés couché à la poulie vis-à-vis (en anglais lying cable fly) sont un exercice d''isolation qui permet de travailler les muscles grands pectoraux.Les poulies sont un excellent outil qui…', false),
  ('Développé debout avec élastique', 'pectoraux', 'https://www.docteur-fitness.com/wp-content/uploads/2022/02/developpe-debout-pectoraux-elastique-exercice-grand-pectoraux.jpg', 'Pas de salle de sport ? Pas de banc de développé couché ? Vous en avez marre de faire des pompes pour travailler les pectoraux ? Essayez le développé debout…', false),
  ('Développé couché serré avec haltères', 'pectoraux', 'https://www.docteur-fitness.com/wp-content/uploads/2022/08/developpe-couche-serre-avec-halteres-milieu-pectoraux.jpg', 'Tout le monde veut avoir de gros pectoraux. Dans cette quête, le développé couché serré avec haltères (en anglais Squeeze Press) est un choix intelligent pour faire travailler les muscles…', false),
  ('Développé incliné à la poulie', 'pectoraux', 'https://www.docteur-fitness.com/wp-content/uploads/2022/05/developpe-incline-poulie-exercice-pectoraux.jpg', 'Le développé incliné à la poulie est un exercice composé qui permet de développer la masse musculaire et la force des pectoraux. L''utilisation d''un banc incliné est très intéressante pour…', false),
  ('Svend press', 'pectoraux', 'https://www.docteur-fitness.com/wp-content/uploads/2022/04/svend-press-exercice-renforcement-pectoraux.jpg', '« Vous devez sentir le muscle travailler » est un adage courant dans le monde du fitness. Ressentir un muscle se contracter signifie, en toute logique, qu''il est ciblé et sollicité. Cependant,…', false),
  ('Développé couché avec élastique', 'pectoraux', 'https://www.docteur-fitness.com/wp-content/uploads/2023/07/developpe-couche-avec-elastique-exercice-musculation-pectoraux-maison.jpg', 'Le développé couché avec élastique (en anglais band bench press), est une variation du populaire développé couché. Cet exercice utilise des bandes élastiques pour apporter une résistance, offrant ainsi une…', false),
  ('Écarté à la poulie vis à vis haute à genoux', 'pectoraux', 'https://www.docteur-fitness.com/wp-content/uploads/2023/07/ecarte-a-la-poulie-vis-a-vis-haute-a-genoux-exercice-isolation-gros-pectoraux.jpg', 'Les écartés à la poulie vis à vis haute à genoux (en anglais cable kneeling high to low fly) sont un mouvement de musculation qui cible principalement les muscles de…', false),
  ('Développé décliné avec élastique', 'pectoraux', 'https://www.docteur-fitness.com/wp-content/uploads/2022/09/developpe-decline-avec-elastique-renforcement-pectoraux-maison.jpg', 'Le développé décliné est un excellent exercice pour tonifier et développer la partie inférieure des pectoraux. Faire cet exercice avec un élastique est une excellente alternative aux machines à poulies…', false),
  ('Développé couché Larsen', 'pectoraux', 'https://www.docteur-fitness.com/wp-content/uploads/2022/09/developpe-couche-larsen-exercice-pectoraux-salle-sport.jpg', 'Le développé couché est le roi incontesté des exercices pour les pectoraux. Les bodybuilders l''utilisent pour améliorer le développement des pectoraux, tandis que pour les powerlifters, il s''agit du deuxième…', false),
  ('Développé couché unilatéral avec kettlebell', 'pectoraux', 'https://www.docteur-fitness.com/wp-content/uploads/2021/12/developpe-couche-unilateral-kettlebell-exercice-pectoraux.jpg', 'Le développé couché avec kettlebell à un bras est une variante du développé couché avec haltères à un bras. C''est un exercice permettant de renforcer les muscles pectoraux.Cette variante comporte…', false),
  ('Développé couché au sol avec kettlebell', 'pectoraux', 'https://www.docteur-fitness.com/wp-content/uploads/2021/12/developpe-couche-au-sol-kettlebell-exercice-pectoraux.jpg', 'Le développé couché avec kettlebells (kettlebell floor press) est une variante du développé couché et un exercice destiné à renforcer les muscles pectoraux et les triceps.L''utilisation des kettlebells pour effectuer…', false),
  ('Développé à la landmine à genoux pour les pectoraux', 'pectoraux', 'https://www.docteur-fitness.com/wp-content/uploads/2022/11/developpe-landmine-pectoraux-exercice-muscul.jpg', 'Lorsque la plupart des gens pensent à développer la partie haute des pectoraux, ils pensent au développé incliné avec haltères ou à la barre. Or, l''un des exercices les plus…', false),
  ('Développé assis à la machine pour les pectoraux', 'pectoraux', 'https://www.docteur-fitness.com/wp-content/uploads/2022/11/developpe-machine-assis-pectoraux-exercice-salle-sport.jpg', 'Le développé couché à la barre, effectué en décubitus dorsal (allongé sur le dos), est considéré comme le roi des exercices de musculation des pectoraux. Il s''agit également de l''un…', false),
  ('Écartés avec sangles de suspension', 'pectoraux', 'https://www.docteur-fitness.com/wp-content/uploads/2022/11/ecartes-avec-sangles-de-suspension-exercice-muscle-poitrine.jpg', 'Les écartés avec sangles de suspension (appelé en anglais TRX chest fly) sont l''un des meilleurs exercices pour isoler les muscles pectoraux. En effet, la grande instabilité des sangles permet…', false),
  ('Chest press avec sangles de suspension', 'pectoraux', 'https://www.docteur-fitness.com/wp-content/uploads/2022/10/chest-press-avec-sangles-de-suspension-musculation-pectoraux.jpg', 'Le chest press avec sangles de suspension fait non seulement travailler les pectoraux, mais il sollicite aussi les triceps et la partie antérieure des épaules. La réalisation de cet exercice…', false),
  ('Écartés incliné avec haltères', 'pectoraux', 'https://www.docteur-fitness.com/wp-content/uploads/2022/09/ecartes-incline-avec-halteres-exercice-milieu-muscles-pectoraux.jpg', 'Les écartés incliné avec haltères (en anglais incline dumbbell fly) sont un excellent exercice d''isolation pour augmenter la masse musculaire de la partie supérieure des pectoraux. Cet exercice est donc…', false),
  ('Écarté unilatéral à la poulie', 'pectoraux', 'https://www.docteur-fitness.com/wp-content/uploads/2022/09/ecarte-unilateral-a-la-poulie-exercice-isolation-pectoraux.jpg', 'Lorsque vous pensez aux meilleurs exercices pour les pectoraux, le premier exercice qui vous vient à l''esprit est probablement le développé couché. Vous ne pensez probablement pas aux appareils à…', false),
  ('Développé incliné avec haltères', 'pectoraux', 'https://www.docteur-fitness.com/wp-content/uploads/2021/06/developpe-incline-halteres-pectoraux.jpg', 'L''exercice du développé incliné avec haltères (dumbbell incline bench press) permet de développer les muscles du haut du corps : pectoraux, épaules et triceps.Le fait d''incliner le banc de musculation…', false),
  ('Écartés à la poulie haute', 'pectoraux', 'https://www.docteur-fitness.com/wp-content/uploads/2021/06/ecarte-poulie-haute-pectoraux.jpg', 'Les écartés à la poulie haute (cable crossover) sont une variante des écartés à la poulie, un exercice permettant de renforcer les muscles de la poussée, et plus particulièrement ceux…', false),
  ('Écartés avec élastique', 'pectoraux', 'https://www.docteur-fitness.com/wp-content/uploads/2022/02/ecartes-avec-elastique-musculation-pectoraux-exercice.jpg', 'En l''absence d''haltères, de barres et d''un banc, le meilleur accessoire que vous pouvez utiliser pour vous entraîner à la maison reste les bandes de résistance. Ces élastiques existent sous…', false),
  ('Développé couché au sol', 'pectoraux', 'https://www.docteur-fitness.com/wp-content/uploads/2021/12/developpe-couche-au-sol-exercice-pectoraux.jpg', 'Vous ne pouvez pas traverser une salle de musculation sans voir au moins une personne sur un banc de développé couché. C''est sans doute un des exercices de musculation les…', false);

-- Exercises for category: Dos
INSERT INTO exercises (title, category_id, image, description, is_active) VALUES
  ('Muscle-up', 'dos', 'https://www.docteur-fitness.com/wp-content/uploads/2022/08/muscle-up-calisthenics-exercice-dos.jpg', 'Le muscle-up est un exercice impressionnant de gymnastique qui consiste à passer de la position de traction à la position de dip en un seul mouvement fluide. Il sollicite intensément les muscles des bras, des épaules et du dos, et nécessite force, explosivité et coordination.', false),
  ('Traction', 'dos', 'https://www.docteur-fitness.com/wp-content/uploads/2022/02/traction-musculation-dos-exercice.jpg', 'La traction (en anglais pull up) est un exercice classique qui permet de cibler les muscles du haut du dos, en particulier le muscle grand dorsal.Les mouvements de traction verticale,…', false),
  ('Tirage horizontal à la poulie', 'dos', 'https://www.docteur-fitness.com/wp-content/uploads/2022/02/tirage-horizontal-poulie-exercice-dos.jpg', 'Le tirage horizontal à la poulie (en anglais seated cable row) est un excellent exercice de musculation pour le dos, en particulier les muscles grands dorsaux, le milieu du dos…', true),
  ('Rowing barre', 'dos', 'https://www.docteur-fitness.com/wp-content/uploads/2021/09/rowing-barre-dos.jpg', 'Le rowing barre est un exercice composé qui fait travailler plusieurs groupes de muscles. Cet exercice fait travailler en particulier plusieurs muscles du dos, notamment le muscle grand dorsal (latissimus…', false),
  ('Shrug barre', 'dos', 'https://www.docteur-fitness.com/wp-content/uploads/2022/01/shrug-barre-exercice-trapeze-muscle-haut-du-dos.jpg', 'L''exercice du shrug barre (en français haussements des épaules à la barre) est un très bon exercice pour développer les trapèzes. Il sollicite également les muscles abdominaux qui permettent au…', false),
  ('Pull-over assis à la machine', 'dos', 'https://www.docteur-fitness.com/wp-content/uploads/2022/01/musculation-pull-over-assis-machine-exercice-dorsaux.jpg', 'Le pull-over assis à la machine est un excellent exercice pour le dos, et plus particulièrement pour les muscles grands dorsaux qu''il permet d''isoler sur une très grande amplitude de…', false),
  ('Traction supination', 'dos', 'https://www.docteur-fitness.com/wp-content/uploads/2021/08/chin-up-traction-supination-dos.jpg', 'Une traction en supination (chin up) est un exercice composé qui permet de faire travailler plusieurs groupes de muscles du haut du corps, en particulier ceux du dos (grands dorsaux,…', false),
  ('Rowing haltère à un bras', 'dos', 'https://www.docteur-fitness.com/wp-content/uploads/2021/08/rowing-haltere-un-bras-dos.jpg', 'Les mouvements de rowing devraient être votre priorité si vous cherchez à développer votre dos, et les différents types de rowing ne manquent pas. La version qui vous est la…', false),
  ('Rowing « T-bar »', 'dos', 'https://www.docteur-fitness.com/wp-content/uploads/2021/08/rowing-barre-t-landmine-dos.jpg', 'Avec autant d''exercices de rowing possibles, vous vous demandez peut-être lequel est le meilleur. La réalité est qu''ils méritent tous une place dans votre entraînement. Cependant, si nous devions vraiment…', false),
  ('Tirage vertical prise serrée', 'dos', 'https://www.docteur-fitness.com/wp-content/uploads/2021/08/tirage-vertical-prise-serree-dos.jpg', 'Le tirage vertical prise serrée (V-bar lat pull down) est une variante du tirage vertical standard (lat pull down). Cet exercice est couramment pratiqué pour varier un entraînement du dos.L''avantage…', false),
  ('Rowing en pronation assis à la machine Technogym', 'dos', 'https://www.docteur-fitness.com/wp-content/uploads/2022/02/rowing-assis-machine-prise-pronation-exercice-muscle-grand-rond.jpg', 'Le rowing en pronation assis à la machine cible principalement les muscles du dos, mais aussi les biceps, les avant-bras et les épaules (la prise en pronation met davantage l''accent…', false),
  ('Extension lombaire à la machine', 'dos', 'https://www.docteur-fitness.com/wp-content/uploads/2021/12/extension-lombaire-a-la-machine-exercice-dos.jpg', 'Les extensions du dos sur machine sont un excellent moyen d''isoler les muscles érecteurs du rachis, qui nous permettent de maintenir une posture droite. Les muscles du dos nous aident…', false),
  ('Rowing à la barre en T avec machine', 'dos', 'https://www.docteur-fitness.com/wp-content/uploads/2022/01/rowing-t-bar-machine-exercice-dos.jpg', 'La machine T-Bar Row est un appareil de musculation qui permet de travailler les muscles du dos et les biceps en toute sécurité et avec un mouvement fluide grâce à…', false),
  ('Rowing en prise neutre assis à la machine', 'dos', 'https://www.docteur-fitness.com/wp-content/uploads/2022/01/rowing-assis-machine-hammer-strenght-exercice-dos.jpg', 'Le rowing assis à la machine en prise neutre (en anglais lever neutral grip seated row) est un exercice qui vous permet de travailler le dos avec un maximum de…', false),
  ('Tirage vertical en supination à la machine Hammer Strength', 'dos', 'https://www.docteur-fitness.com/wp-content/uploads/2022/01/tirage-avant-iso-laterale-hammer-strength-exercice-dos.jpg', 'Ce tirage vertical iso latéral avec la machine Hammer Strength (en anglais Reverse-Grip Lat Pulldown) est un excellent mouvement pour les dorsaux. Les muscles dorsaux inférieurs (une zone fréquemment déficiente)…', false),
  ('Soulevé de terre', 'dos', 'https://www.docteur-fitness.com/wp-content/uploads/2021/12/souleve-de-terre-exercice-jambes-dos.jpg', 'Le soulevé de terre (en anglais deadlift) est un exercice extrêmement populaire et un véritable test de la force globale du corps. Il est populaire auprès de nombreux pratiquants de…', false),
  ('Traction assistée à la machine', 'dos', 'https://www.docteur-fitness.com/wp-content/uploads/2022/02/traction-assistee-machine-exercice-dos.jpg', 'La traction est un exercice important pour le haut du corps, essentiel pour développer et renforcer le dos et les bras, et pour acquérir une force fonctionnelle du haut du…', false),
  ('Tractions prise neutre', 'dos', 'https://www.docteur-fitness.com/wp-content/uploads/2022/10/traction-prise-neutre-exercice-muscu-dos.jpg', 'Les tractions en prise neutre sont une excellente variante pour se muscler le dos. Si votre barre de traction ne possède pas ce type de prise neutre avec les poignées…', false),
  ('Rowing avec haltères', 'dos', 'https://www.docteur-fitness.com/wp-content/uploads/2022/10/bent-over-row-avec-halteres-exercice-renforcement-dos-maison.jpg', 'Le rowing haltère à un bras est un exercice tellement populaire que la version à deux bras est souvent oubliée ou négligée. Bien que la pratique de cet exercice soit…', false),
  ('Seal row avec haltères', 'dos', 'https://www.docteur-fitness.com/wp-content/uploads/2022/05/seal-row-halteres-exercice-dos-halteres.jpg', 'Le seal row est une variante du rowing, qui permet de travailler les muscles du dos et des bras. Cette variante implique de s''allonger sur un banc, ce qui permet…', false),
  ('Renegade row', 'dos', 'https://www.docteur-fitness.com/wp-content/uploads/2022/04/renegade-row-exercice-muscul-dos-haltere.jpg', 'La plupart des meilleurs exercices de musculation impliquent un travail des abdos en conjonction avec d''autres grands groupes musculaires.Le renegade row fait partie de ces exercices. En effet, cet excellent…', false),
  ('Tirage vertical poitrine', 'dos', 'https://www.docteur-fitness.com/wp-content/uploads/2021/11/tirage-vertical-poitrine-exercice-dos.jpg', 'Le tirage poitrine ou tirage devant (lat pull down) est un exercice pour le dos. Bien que l''exercice cible principalement les muscles dorsaux, vous ressentirez également une mobilisation importante des…', true),
  ('Rowing unilatéral à la landmine', 'dos', 'https://www.docteur-fitness.com/wp-content/uploads/2022/02/rowing-unilateral-landmine-exercice-meadows-row-grand-dorsal.jpg', 'Le rowing unilatéral à la landmine, aussi appelé meadows row est un exercice qui cible les muscles du dos. Il sollicite également la force de préhension et cible indirectement les…', false),
  ('Superman', 'dos', 'https://www.docteur-fitness.com/wp-content/uploads/2022/02/superman-exercice-dos.jpg', 'Le superman est un exercice qui permet d''isoler les muscles du bas du dos. Cet exercice sollicite secondairement les muscles fessiers et ischio-jambiers.Comment faire le superman ?Conseils d''entraînement Autres exercices…', false),
  ('Rowing haltères sur banc incliné', 'dos', 'https://www.docteur-fitness.com/wp-content/uploads/2022/02/rowing-halteres-banc-incline-prise-neutre-exercice-dos.jpg', 'Le rowing avec haltères sur un banc incliné est une variante intéressante pour se muscler le dos. Cet exercice met l''accent sur le muscle grand dorsal et l''arrière du deltoïde.Avec…', false),
  ('Tractions australiennes', 'dos', 'https://www.docteur-fitness.com/wp-content/uploads/2022/01/traction-australienne-rowing-poids-du-corps-exercice-dos.jpg', 'Les tractions australiennes également connues sous le nom de rowing inversé au poids de corps, est un exercice qui permet de faire travailler les groupes de muscles du haut du…', false),
  ('Pullover avec haltère', 'dos', 'https://www.docteur-fitness.com/wp-content/uploads/2021/12/pullover-haltere-exercice-dos.jpg', 'Le pullover avec haltères permet de faire travailler les muscles de la poitrine et les grands dorsaux (les muscles du milieu et du bas du dos). Cela en fait un…', false),
  ('Shrug à la machine à mollets', 'dos', 'https://www.docteur-fitness.com/wp-content/uploads/2022/04/shrug-machine-mollets-exercice-de-musculation.jpg', 'Le haussement d''épaules sans barre, ou haussement d''épaules avec la machine à mollets (en anglais gripless shrug ou calf raise machine shrug), est un exercice d''isolation très efficace pour les…', false),
  ('Bird dog', 'dos', 'https://www.docteur-fitness.com/wp-content/uploads/2022/04/bird-dog-exercice-fessiers-gainage-abdos.jpg', 'Le bird dog n''a pas l''air d''un exercice courant, mais ne vous y trompez pas, il s''agit en fait d''un mouvement efficace et souvent utilisé pour développer la stabilité, renforcer…', false),
  ('Pull-over à la poulie', 'dos', 'https://www.docteur-fitness.com/wp-content/uploads/2022/02/pull-over-poulie-exercice-dos.jpg', 'Le pull-over à la poulie (en anglais straight arm pulldowns) est une variante des tractions effectuées bras tendus. En effet, vous effectuez le mouvement debout en gardant les coudes fixes…', false),
  ('Overhead shrug', 'dos', 'https://www.docteur-fitness.com/wp-content/uploads/2022/01/overhead-shrug-exercice-trapeze.jpg', 'Le haussement des épaules (en anglais shrug) avec barre est un excellent exercice pour développer les trapèzes supérieurs.Bien qu''il s''agisse d''un mouvement très peu courant que vous verrez rarement effectué…', false),
  ('Pull-over décliné à la barre', 'dos', 'https://www.docteur-fitness.com/wp-content/uploads/2022/05/pull-over-barre-exercice-dos.jpg', 'Le pull-over décliné à la barre est un exercice d''isolation qui cible principalement les muscles grands dorsaux et les muscles pectoraux (dans une moindre mesure).En général, le pull-over est effectué…', false),
  ('Planche inversée', 'dos', 'https://www.docteur-fitness.com/wp-content/uploads/2022/05/planche-inversee-abdos-gainage-renforcement.jpg', 'La planche inversée est une excellente alternative à la planche classique. Elle cible principalement les fessiers, les abdominaux, tout en renforçant les muscles de la chaîne postérieure, les bras et…', false),
  ('Shrug à la poulie', 'dos', 'https://www.docteur-fitness.com/wp-content/uploads/2022/04/shrug-poulie-haussement-epaules-musculation-trapezes.jpg', 'Le haussement des épaules à la poulie (en anglais cable shrug) est une variante très intéressante pour travailler la partie supérieure des trapèzes.Cet exercice est l''un des meilleurs exercices pour…', false),
  ('Extension lombaire au banc à 45°', 'dos', 'https://www.docteur-fitness.com/wp-content/uploads/2021/08/extension-lombaire-au-banc-45-dos.jpg', 'Un buste fort ne dépend pas seulement des abdominaux. Les muscles du bas du dos sont également importants. Ces muscles stabilisent la colonne vertébrale et contribuent à une bonne posture.…', false),
  ('Rowing buste penché avec élastique', 'dos', 'https://www.docteur-fitness.com/wp-content/uploads/2022/09/rowing-buste-penche-avec-elastique-prise-neutre-muscu-dos.jpg', 'Le rowing buste penché est un excellent exercice pour développer vos dorsaux tout en entraînant également les muscles du haut du dos. Cette version avec élastique vous permettra de le…', false),
  ('Shrugs avec haltères/poids', 'dos', 'https://www.docteur-fitness.com/wp-content/uploads/2022/11/shrugs-avec-halteres-exercice-trapezes-superieurs.jpg', 'Le shrug (en français haussement des épaules) est l''exercice principal pour développer le haut des trapèzes. Les haussements d''épaules peuvent être effectués avec une barre ainsi qu''avec diverses machines, mais…', true),
  ('Soulevé de terre avec machine', 'dos', 'https://www.docteur-fitness.com/wp-content/uploads/2022/11/souleve-de-terre-avec-machine-exercice-muscu-debutant.jpg', 'Le soulevé de terre est un mouvement de base qui figure dans les programmes de musculation classiques. C''est l''un des mouvements les plus efficaces pour développer la force des jambes…', false),
  ('Tractions australiennes avec sangles de suspension', 'dos', 'https://www.docteur-fitness.com/wp-content/uploads/2022/11/tractions-australiennes-avec-sangles-de-suspension-exercice-dos-maison.jpg', 'Les tractions australiennes sont un excellent exercice pour se muscler le dos. L''arrière des épaules, les fessiers et la sangle abdominale sont également sollicités pour accompagner le mouvement.Comme la version…', false),
  ('Extensions lombaires sur Swiss ball', 'dos', 'https://www.docteur-fitness.com/wp-content/uploads/2022/11/extension-lombaire-sur-ballon-de-gym-exercice-lombalgie.jpg', 'Les extensions lombaires avec Swiss Ball renforcent la force et la stabilité du bas du dos, et dans une moindre mesure les fessiers et les ischio-jambiers. En faisant cet exercice…', false),
  ('Oiseau inversé avec sangles de suspension', 'dos', 'https://www.docteur-fitness.com/wp-content/uploads/2022/10/oiseau-inverse-avec-sangles-de-suspension-exercice-arriere-epaules.jpg', 'L''oiseau inversé fait partie des exercices les plus élémentaires pour l''entraînement des épaules. Ce mouvement au poids du corps cible l''arrière des épaules et le haut du dos en utilisant…', false),
  ('Traction assistée avec élastique', 'dos', 'https://www.docteur-fitness.com/wp-content/uploads/2021/12/traction-assiste-elastique-exercice-dos.jpg', 'Les tractions assistées avec élastique sont une excellente façon de se muscler les muscles grands dorsaux, le haut du dos, l''arrière des épaules et les trapèzes.Si vous ne pouvez pas…', false),
  ('Rowing avec sangles de suspension', 'dos', 'https://www.docteur-fitness.com/wp-content/uploads/2022/10/rowing-avec-sangles-de-suspension-trx-musculation-dos-maison.jpg', 'Le rowing avec sangles de suspension est une alternative au rowing conventionnel avec machine, barre ou poulie. Cette variante du rowing utilise le poids du corps comme charge principale. Elle…', false),
  ('Pullover avec deux haltères', 'dos', 'https://www.docteur-fitness.com/wp-content/uploads/2022/10/pullover-avec-deux-halteres-exercice-isolation-grand-dorsal.jpg', 'Les pullovers avec haltères sont généralement effectués avec un seul haltère tenu dans les deux mains. Le pullover avec deux haltères (un dans chaque main) est une excellente variante malheureusement…', false),
  ('Rowing inversé sous une table', 'dos', 'https://www.docteur-fitness.com/wp-content/uploads/2022/10/rowing-inverse-sous-une-table-exercice-dos-maison.jpg', 'Si vous vous entraînez à la maison ou si vous n''avez pas accès à des haltères ou à des machines de musculation, il existe tout de même deux grands types…', false),
  ('Bent over row prise disque', 'dos', 'https://www.docteur-fitness.com/wp-content/uploads/2022/10/bent-over-row-prise-disque-exercice-dos-epaisseur.jpg', 'Le bent over row prise disque (en anglais barbell bent over row with plate grip) nécessite une barre de musculation et des disques. Si vous possédez ce matériel, cet exercice…', false),
  ('Rowing unilatéral avec élastique', 'dos', 'https://www.docteur-fitness.com/wp-content/uploads/2022/10/rowing-unilateral-avec-elastique-exercice-dos-maison.jpg', 'Il existe de nombreuses façons d''effectuer un mouvement de rowing à un bras avec un élastique. Certaines variantes consistent à fixer la bande à un point d''ancrage (porte, mur ou…', false),
  ('Rowing à la Smith machine', 'dos', 'https://www.docteur-fitness.com/wp-content/uploads/2022/10/rowing-smith-machine-exercice-dos-masse-musculaire.jpg', 'Le rowing à la machine permet de travailler directement plusieurs muscles du haut du dos, notamment les rhomboïdes, les trapèzes inférieurs et moyens, le grand dorsal et les deltoïdes postérieur.…', false),
  ('Tirage horizontal prise large', 'dos', 'https://www.docteur-fitness.com/wp-content/uploads/2022/10/tirage-horizontal-prise-large-exercice-dos-massif.jpg', 'Le tirage horizontal prise large est un exercice de musculation qui permet de travailler les trapèzes, les deltoïdes postérieurs, les dorsaux, les abdominaux et les muscles érecteurs du rachis.La plupart…', true),
  ('Montée à la corde', 'dos', 'https://www.docteur-fitness.com/wp-content/uploads/2022/10/montee-de-corde-exercice-dos.jpg', 'Les montées à la corde sont l''une des pratiques les plus méconnues du CrossFit. Bien qu''il soit facile de s''en sortir avec des montées de corde imparfaites au début de…', false),
  ('Pull-over avec barre', 'dos', 'https://www.docteur-fitness.com/wp-content/uploads/2022/04/pull-over-barre-exercice-muscul-dorsaux.jpg', 'Le pull-over à la barre est un exercice sous-estimé qui permet de travailler les dorsaux et qui a sa place dans tout programme d''entraînement pour le dos. Qui plus est,…', false),
  ('Tirage incliné à la poulie haute', 'dos', 'https://www.docteur-fitness.com/wp-content/uploads/2022/04/tirage-incline-poulie-haute-exercice-dos.jpg', 'Vous avez besoin de plus de variété dans votre programme d''entraînement du dos ? Le tirage incliné à la poulie haute (en anglais cable incline pushdown) est un exercice original…', false),
  ('Traction lestée', 'dos', 'https://www.docteur-fitness.com/wp-content/uploads/2022/02/traction-lestee-exercice-musculation-dos.jpg', 'Les tractions lestées sont un exercice de musculation qui permet de faire passer votre entraînement du dos à la vitesse supérieure. Bien qu''elles ciblent le grand dorsal, les tractions recrutent…', false),
  ('Traction assistée avec banc', 'dos', 'https://www.docteur-fitness.com/wp-content/uploads/2022/02/traction-assistee-avec-banc-exercice-dos.jpg', 'Les tractions sont un excellent exercice pour le haut du corps qui offre de nombreux avantages. Elles font partie de nombreux programmes d''entraînement au poids du corps.La traction auto-assistée est…', false),
  ('Tirage horizontal avec élastique', 'dos', 'https://www.docteur-fitness.com/wp-content/uploads/2022/02/rowing-horizontal-bande-elastique-exercice-dos.jpg', 'Votre dos est l''un des groupes musculaires les plus importants si vous voulez avoir une belle silhouette et des performances exceptionnelles dans vos séances de musculation. À cet égard, les…', false),
  ('Tirage vertical prise inversée', 'dos', 'https://www.docteur-fitness.com/wp-content/uploads/2022/01/tirage-vertical-prise-inversee-exercice-dos.jpg', 'Le tirage vertical en prise inversée est une variante du tirage vertical. C''est un exercice qui permet de développer les muscles du dos. Bien que l''exercice cible principalement les muscles…', false);

-- ============================================
-- STEP 6: Add triggers for updated_at
-- ============================================
CREATE TRIGGER update_categories_updated_at
  BEFORE UPDATE ON categories
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_exercises_updated_at
  BEFORE UPDATE ON exercises
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- STEP 7: Enable RLS and create policies
-- ============================================

-- RLS for categories
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read access for categories"
  ON categories FOR SELECT
  USING (true);

-- RLS for exercises
ALTER TABLE exercises ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read access for exercises"
  ON exercises FOR SELECT
  USING (true);

-- ============================================
-- STEP 8: Recreate foreign key for sets table
-- ============================================
-- The sets table was dropped with CASCADE, so we need to recreate it
CREATE TABLE sets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workout_id UUID NOT NULL REFERENCES workouts(id) ON DELETE CASCADE,
  exercise_id INTEGER NOT NULL REFERENCES exercises(id) ON DELETE RESTRICT,
  weight DECIMAL(6,2) NOT NULL CHECK (weight >= 0),
  repetition INTEGER NOT NULL CHECK (repetition > 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for sets
CREATE INDEX idx_sets_workout_id ON sets(workout_id);
CREATE INDEX idx_sets_exercise_id ON sets(exercise_id);

-- Trigger for sets
CREATE TRIGGER update_sets_updated_at
  BEFORE UPDATE ON sets
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- RLS for sets (same as before)
ALTER TABLE sets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view sets from their own workouts"
  ON sets FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM workouts
      JOIN profiles ON profiles.id = workouts.profile_id
      WHERE workouts.id = sets.workout_id
      AND profiles.auth_id = auth.uid()
    )
  );

CREATE POLICY "Users can create sets for their own workouts"
  ON sets FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM workouts
      JOIN profiles ON profiles.id = workouts.profile_id
      WHERE workouts.id = sets.workout_id
      AND profiles.auth_id = auth.uid()
    )
  );

CREATE POLICY "Users can update sets from their own workouts"
  ON sets FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM workouts
      JOIN profiles ON profiles.id = workouts.profile_id
      WHERE workouts.id = sets.workout_id
      AND profiles.auth_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM workouts
      JOIN profiles ON profiles.id = workouts.profile_id
      WHERE workouts.id = sets.workout_id
      AND profiles.auth_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete sets from their own workouts"
  ON sets FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM workouts
      JOIN profiles ON profiles.id = workouts.profile_id
      WHERE workouts.id = sets.workout_id
      AND profiles.auth_id = auth.uid()
    )
  );