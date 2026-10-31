-- ============================================================
-- ImoLakaya — Initialisation des données de référence
-- À exécuter après `alembic upgrade head`
-- ============================================================

-- Rôles
INSERT INTO roles (id, nom, description) VALUES
  (gen_random_uuid(), 'admin_principal', 'Administrateur principal'),
  (gen_random_uuid(), 'admin', 'Administrateur'),
  (gen_random_uuid(), 'employe', 'Employé d''agence'),
  (gen_random_uuid(), 'proprietaire', 'Propriétaire'),
  (gen_random_uuid(), 'visiteur', 'Visiteur')
ON CONFLICT (nom) DO NOTHING;

-- Permissions (liste des codes)
INSERT INTO permissions (id, code, description)
SELECT gen_random_uuid(), code, code
FROM (VALUES
  ('utilisateur:lire'), ('utilisateur:creer'), ('utilisateur:modifier'), ('utilisateur:supprimer'),
  ('role:gerer'),
  ('bien:lire'), ('bien:creer'), ('bien:modifier'), ('bien:supprimer'), ('bien:valider'),
  ('annonce:creer'), ('annonce:soumettre'), ('annonce:approuver'), ('annonce:rejeter'),
  ('media:ajouter'), ('media:supprimer'),
  ('paiement:lire'), ('paiement:creer'), ('paiement:agence'), ('paiement:confirmer'), ('paiement:rembourser'),
  ('agence:gerer'), ('employe:gerer'),
  ('contact:lire'), ('contact:traiter'),
  ('visite:lire'), ('avis:moderer'), ('notification:lire'),
  ('rapport:lire'), ('audit:lire'), ('parametre:gerer')
) AS t(code)
ON CONFLICT (code) DO NOTHING;

-- Catégories
INSERT INTO categories (id, nom, slug, ordre, est_active) VALUES
  (gen_random_uuid(), 'Maison', 'maison', 1, true),
  (gen_random_uuid(), 'Appartement', 'appartement', 2, true),
  (gen_random_uuid(), 'Terrain', 'terrain', 3, true),
  (gen_random_uuid(), 'Local commercial', 'local-commercial', 4, true),
  (gen_random_uuid(), 'Villa', 'villa', 5, true),
  (gen_random_uuid(), 'Chambre', 'chambre', 6, true),
  (gen_random_uuid(), 'Bureau', 'bureau', 7, true),
  (gen_random_uuid(), 'Entrepôt', 'entrepot', 8, true)
ON CONFLICT (slug) DO NOTHING;

-- Localisations (échantillon)
INSERT INTO localisations (id, departement, commune, zone) VALUES
  (gen_random_uuid(), 'Ouest', 'Port-au-Prince', 'Pétion-Ville'),
  (gen_random_uuid(), 'Ouest', 'Port-au-Prince', 'Delmas'),
  (gen_random_uuid(), 'Ouest', 'Port-au-Prince', 'Tabarre'),
  (gen_random_uuid(), 'Ouest', 'Port-au-Prince', 'Carrefour'),
  (gen_random_uuid(), 'Nord', 'Cap-Haïtien', 'Cap-Haïtien'),
  (gen_random_uuid(), 'Artibonite', 'Gonaïves', 'Gonaïves'),
  (gen_random_uuid(), 'Sud', 'Les Cayes', 'Les Cayes')
ON CONFLICT (departement, commune, zone) DO NOTHING;