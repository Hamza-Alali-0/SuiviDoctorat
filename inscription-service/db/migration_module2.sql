-- Migration SQL pour Module 2 : Inscription et Réinscription
-- À exécuter sur la base de données inscription-service

-- 1. Ajout des champs au table doctorants
ALTER TABLE doctorants 
ADD COLUMN IF NOT EXISTS nationalite VARCHAR(100),
ADD COLUMN IF NOT EXISTS lieu_naissance VARCHAR(200),
ADD COLUMN IF NOT EXISTS sexe VARCHAR(1),
ADD COLUMN IF NOT EXISTS cin VARCHAR(50),
ADD COLUMN IF NOT EXISTS diplomes_precedents TEXT,
ADD COLUMN IF NOT EXISTS etablissement_origine VARCHAR(255);

-- 2. Ajout des champs de collaboration au table dossiers_inscription
ALTER TABLE dossiers_inscription
ADD COLUMN IF NOT EXISTS type_collaboration VARCHAR(50),
ADD COLUMN IF NOT EXISTS organisme_collaboration VARCHAR(255),
ADD COLUMN IF NOT EXISTS pays_collaboration VARCHAR(100);

-- 3. Ajout des champs au table pieces_jointes
ALTER TABLE pieces_jointes
ADD COLUMN IF NOT EXISTS type_piece VARCHAR(50),
ADD COLUMN IF NOT EXISTS description TEXT;

-- 4. Commentaires pour documentation
COMMENT ON COLUMN doctorants.nationalite IS 'Nationalité du doctorant';
COMMENT ON COLUMN doctorants.lieu_naissance IS 'Lieu de naissance du doctorant';
COMMENT ON COLUMN doctorants.sexe IS 'Sexe du doctorant (M/F)';
COMMENT ON COLUMN doctorants.cin IS 'Numéro de carte d''identité nationale';
COMMENT ON COLUMN doctorants.diplomes_precedents IS 'Diplômes obtenus précédemment';
COMMENT ON COLUMN doctorants.etablissement_origine IS 'Établissement d''origine du doctorant';

COMMENT ON COLUMN dossiers_inscription.type_collaboration IS 'Type de collaboration (Internationale, Nationale, Industrielle, Aucune)';
COMMENT ON COLUMN dossiers_inscription.organisme_collaboration IS 'Nom de l''organisme de collaboration';
COMMENT ON COLUMN dossiers_inscription.pays_collaboration IS 'Pays de l''organisme de collaboration';

COMMENT ON COLUMN pieces_jointes.type_piece IS 'Type de pièce jointe (DIPLOME, CV, LETTRE_MOTIVATION, etc.)';
COMMENT ON COLUMN pieces_jointes.description IS 'Description optionnelle de la pièce jointe';

-- 5. Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_doctorants_email ON doctorants(email);
CREATE INDEX IF NOT EXISTS idx_doctorants_cin ON doctorants(cin);
CREATE INDEX IF NOT EXISTS idx_dossiers_statut ON dossiers_inscription(statut);
CREATE INDEX IF NOT EXISTS idx_dossiers_campagne ON dossiers_inscription(campagne_id);
CREATE INDEX IF NOT EXISTS idx_pieces_type ON pieces_jointes(type_piece);

-- 6. Contraintes optionnelles
ALTER TABLE doctorants
ADD CONSTRAINT chk_sexe CHECK (sexe IN ('M', 'F') OR sexe IS NULL);

ALTER TABLE dossiers_inscription
ADD CONSTRAINT chk_type_collaboration CHECK (
    type_collaboration IN ('Internationale', 'Nationale', 'Industrielle', 'Aucune') 
    OR type_collaboration IS NULL
);

-- 7. Données de test (optionnel)
-- Exemple de campagne active
INSERT INTO campagnes_inscription (nom, date_ouverture, date_fermeture, active)
VALUES 
    ('Inscription Doctorale 2025-2026', '2025-09-01', '2025-11-30', true),
    ('Réinscription 2025-2026', '2025-06-01', '2025-08-31', true)
ON CONFLICT DO NOTHING;

-- Exemple de doctorant avec nouvelles données
-- INSERT INTO doctorants (prenom, nom, email, date_naissance, nationalite, sexe, cin, telephone, adresse, diplomes_precedents, etablissement_origine)
-- VALUES (
--     'Ahmed',
--     'Benali',
--     'ahmed.benali@example.com',
--     '1995-03-15',
--     'Marocaine',
--     'M',
--     'AB123456',
--     '+212600000000',
--     '123 Rue de l''Université, Casablanca',
--     'Master en Informatique',
--     'Université Hassan II Casablanca'
-- );

-- Vérification des modifications
SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns
WHERE table_name IN ('doctorants', 'dossiers_inscription', 'pieces_jointes')
ORDER BY table_name, ordinal_position;
