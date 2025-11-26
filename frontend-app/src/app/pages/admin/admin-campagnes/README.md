# Gestion des Campagnes d'Inscription - Frontend

## Vue d'ensemble

Ce module fournit une interface complète pour la gestion des campagnes d'inscription dans le système de suivi doctoral.

## Composants

### AdminCampagnesComponent

**Chemin**: `src/app/pages/admin/admin-campagnes/`

Composant Angular standalone pour la gestion CRUD des campagnes d'inscription.

#### Fonctionnalités

✅ **Visualisation des campagnes**
- Affichage en grille responsive
- Statut en temps réel (À venir, En cours, Terminée, Inactive)
- Nombre de dossiers associés à chaque campagne
- Dates formatées en français

✅ **Création de campagnes**
- Formulaire modal avec validation
- Champs: Nom, Date d'ouverture, Date de fermeture, Statut actif/inactif
- Validation des dates (fermeture après ouverture)

✅ **Modification de campagnes**
- Édition en modal
- Mise à jour des informations
- Validation automatique

✅ **Activation/Désactivation**
- Bouton toggle pour activer/désactiver rapidement
- Mise à jour en temps réel

✅ **Suppression de campagnes**
- Confirmation avant suppression
- Message de succès/erreur

## API Backend

### Endpoints utilisés

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/inscription-service/api/admin/campagnes` | Liste toutes les campagnes |
| POST | `/inscription-service/api/admin/campagnes` | Crée une nouvelle campagne |
| PUT | `/inscription-service/api/admin/campagnes/{id}` | Modifie une campagne |
| DELETE | `/inscription-service/api/admin/campagnes/{id}` | Supprime une campagne |
| POST | `/inscription-service/api/admin/campagnes/{id}/toggle` | Active/Désactive une campagne |

### Modèle de données

```typescript
interface Campagne {
  id?: number;
  nom: string;
  dateOuverture: string;  // Format ISO 8601
  dateFermeture: string;   // Format ISO 8601
  active: boolean;
  dossiers?: any[];
}
```

## Routes

- `/admin/campagnes` - Page de gestion des campagnes

## Navigation

La page est accessible depuis la navbar admin via le menu déroulant du profil utilisateur :
- **Gérer les utilisateurs** → `/admin`
- **Gérer les campagnes** → `/admin/campagnes`

## Authentification

Le composant utilise l'authentification JWT via cookie fallback :

```typescript
const token = localStorage.getItem('auth_token');
if (token) {
  document.cookie = `JWT=${token};path=/`;
}
```

## Messages utilisateur

Le composant affiche des messages de feedback :
- ✅ **Succès** : fond vert clair
- ❌ **Erreur** : fond rouge clair
- ⏳ **Chargement** : état de chargement avec texte

## Responsive Design

- **Desktop** : Grille avec 3-4 colonnes
- **Tablet** : Grille avec 2 colonnes
- **Mobile** : Grille avec 1 colonne

## États de la campagne

Le composant calcule automatiquement le statut en fonction des dates :

```typescript
getCampagneStatus(campagne: Campagne): string {
  if (!campagne.active) return 'Inactive';
  const now = new Date();
  const start = new Date(campagne.dateOuverture);
  const end = new Date(campagne.dateFermeture);
  
  if (now < start) return 'À venir';
  if (now > end) return 'Terminée';
  return 'En cours';
}
```

## Améliorations futures

- [ ] Filtrage par statut
- [ ] Recherche par nom
- [ ] Pagination pour grandes listes
- [ ] Export des données
- [ ] Statistiques détaillées par campagne
- [ ] Gestion des dossiers directement depuis la campagne
- [ ] Notifications par email lors de la création/modification
- [ ] Historique des modifications

## Dépendances

- `@angular/common` - CommonModule
- `@angular/forms` - FormsModule
- `@angular/common/http` - HttpClient
- Composant `AdminNavbarComponent`

## Développement

### Installation des dépendances

```bash
cd frontend-app
npm install
```

### Lancement du serveur de développement

```bash
npm start
```

### Build de production

```bash
npm run build
```

## Support

Pour toute question ou problème, consultez la documentation principale ou contactez l'équipe de développement.
