# Module 2 : Processus d'Inscription et de Réinscription - Documentation

## 📋 Vue d'ensemble

Ce document décrit les améliorations apportées au module d'inscription pour répondre aux exigences complètes du Module 2.

## ✨ Fonctionnalités Implémentées

### 1. Gestion des Campagnes d'Inscription/Réinscription

#### Backend
- **Modèle `CampagneInscription`** : Gestion des dates d'ouverture et de fermeture
- **Contrôleur Admin** : CRUD complet pour la gestion des campagnes
- **Validation automatique** : Vérification que les campagnes sont ouvertes lors de la soumission

#### Frontend
- **Page Admin Campagnes** : Interface complète pour créer, modifier, activer/désactiver les campagnes
- **Affichage du statut** : Visualisation claire des campagnes actives, à venir et terminées

### 2. Formulaire d'Inscription Dynamique

#### Modèles Enrichis

**Doctorant** - Nouvelles propriétés :
- `nationalite`
- `lieuNaissance`
- `sexe`
- `cin` (Carte d'identité)
- `diplomesPrecedents`
- `etablissementOrigine`

**DossierInscription** - Nouvelles propriétés :
- `typeCollaboration` (Internationale, Nationale, Industrielle, Aucune)
- `organismeCollaboration`
- `paysCollaboration`

#### DTO Créés
- **`InscriptionFormDTO`** : Centralise toutes les données du formulaire d'inscription
- **`DashboardDTO`** : Structure les données du tableau de bord avec workflow

#### Composant Frontend
- **Formulaire en 3 étapes** :
  1. Informations personnelles (prénom, nom, email, date de naissance, nationalité, etc.)
  2. Formation et projet de recherche (diplômes, sujet de thèse, directeur, collaboration)
  3. Pièces justificatives (upload multiple de documents)

### 3. Téléversement de Pièces Justificatives

#### Validation des Fichiers

**Enum `TypePieceJointe`** :
- DIPLOME
- CV
- LETTRE_MOTIVATION
- PHOTO_IDENTITE
- CARTE_IDENTITE
- CERTIFICAT_SCOLARITE
- ATTESTATION
- AUTRE

**FileStorageService Amélioré** :
- Validation du format (PDF, JPG, PNG)
- Vérification de la taille (max 10 MB)
- Validation du type MIME vs extension
- Validation spécifique selon le type de document
- Protection contre les attaques (sanitization des noms de fichiers)
- Support UUID pour éviter les collisions

#### Endpoints
- `POST /api/inscriptions/dossier/{id}/upload` : Upload simple
- `POST /api/inscriptions/dossier/{id}/upload-typed` : Upload avec type et description

### 4. Circuit de Validation en Ligne

#### Workflow Complet

1. **Soumission par le candidat**
   - Statut : `SOUMIS`
   - Notification automatique au directeur de thèse

2. **Avis du directeur de thèse**
   - Endpoint : `POST /api/inscriptions/dossier/{id}/directeur/avis`
   - Enregistrement de l'avis et de la date
   - Statut : `EN_ATTENTE`
   - Notification à l'administration

3. **Validation administrative**
   - Endpoint : `POST /api/inscriptions/dossier/{id}/admin/valider`
   - Statut final : `VALIDÉ` ou `REJETÉ`
   - Notification au doctorant

#### Services de Notification
- `NotificationService` : Centralise l'envoi des notifications
- `NotificationClient` : Communication avec le service de notification
- Notifications par email à chaque étape du workflow

### 5. Tableau de Bord Doctorant

#### Fonctionnalités

**Suivi en Temps Réel** :
- Affichage de tous les dossiers du doctorant
- Status badge coloré selon l'état (Soumis, En attente, Validé, Rejeté)
- Détails du dossier (sujet, directeur, pièces jointes)

**Timeline Workflow** :
- Visualisation du circuit de validation complet
- Étapes : Soumission → Avis Directeur → Validation Administrative
- Indicateurs visuels (✓ complété, ⏳ en cours)
- Dates et descriptions pour chaque étape
- Mise en évidence de l'étape actuelle

**Affichage des Avis** :
- Avis du directeur de thèse (si donné)
- Note administrative (si validé/rejeté)
- Horodatage de chaque action

#### Composants Frontend
- `DashboardDoctorantComponent` : Page principale du tableau de bord
- Interface moderne et responsive
- Animations pour les étapes en cours

### 6. Processus de Réinscription Simplifié

#### Backend
```java
public DossierInscription reinscription(Long doctorantId)
```
- Récupère le dernier dossier de l'année N-1
- Copie automatique des données (sujet, directeur, laboratoire, etc.)
- Marque comme réinscription
- Permet la mise à jour des informations si nécessaire

#### Frontend
- Bouton "Réinscription" sur le tableau de bord
- Processus automatisé utilisant les données existantes
- Possibilité de modifier avant soumission finale

## 🔧 API Endpoints Créés

### Inscription
- `GET /api/inscriptions/campagnes/actives` : Liste des campagnes ouvertes
- `POST /api/inscriptions/soumettre` : Soumettre un formulaire complet
- `POST /api/inscriptions/doctorant/{id}/reinscription` : Créer une réinscription
- `GET /api/inscriptions/dossier/{id}` : Détails d'un dossier
- `GET /api/inscriptions/doctorant/{id}/dashboard-enhanced` : Dashboard avec timeline

### Validation
- `POST /api/inscriptions/dossier/{id}/directeur/avis` : Avis directeur
- `POST /api/inscriptions/dossier/{id}/admin/valider` : Validation admin

### Documents
- `POST /api/inscriptions/dossier/{id}/upload-typed` : Upload avec métadonnées

## 📁 Structure des Fichiers

### Backend (Java/Spring Boot)

```
inscription-service/
├── model/
│   ├── Doctorant.java (enrichi)
│   ├── DossierInscription.java (enrichi)
│   ├── PieceJointe.java (enrichi)
│   ├── CampagneInscription.java
│   └── enums/
│       ├── StatutDossier.java
│       └── TypePieceJointe.java (nouveau)
├── dto/
│   ├── InscriptionFormDTO.java (nouveau)
│   ├── DashboardDTO.java (nouveau)
│   └── NotificationRequest.java
├── service/
│   ├── InscriptionService.java (enrichi)
│   ├── FileStorageService.java (amélioré)
│   └── NotificationService.java
└── controller/
    ├── InscriptionController.java (enrichi)
    └── AdminCampagneController.java
```

### Frontend (Angular)

```
frontend-app/
├── services/
│   └── inscription.service.ts (nouveau)
└── pages/
    ├── admin/
    │   └── admin-campagnes/ (existant)
    └── doctorant/
        ├── inscription-form/ (nouveau)
        │   ├── inscription-form.ts
        │   └── inscription-form.html
        └── dashboard-doctorant/ (nouveau)
            ├── dashboard-doctorant.ts
            └── dashboard-doctorant.html
```

## 🎯 Points Clés de l'Implémentation

### Sécurité
- Validation stricte des types de fichiers
- Sanitization des noms de fichiers
- Vérification des dates de campagne à chaque opération
- Protection contre les injections

### Expérience Utilisateur
- Formulaire multi-étapes pour éviter la surcharge cognitive
- Feedback visuel clair à chaque étape
- Messages d'erreur descriptifs
- Timeline interactive pour le suivi

### Performance
- Utilisation de DTOs pour optimiser les transferts
- Chargement paresseux des relations JPA
- Requêtes optimisées

### Maintenabilité
- Séparation claire des responsabilités
- Services réutilisables
- Documentation inline
- Nommage cohérent

## 🚀 Utilisation

### Pour le Doctorant

1. **Nouvelle Inscription** :
   - Accéder au formulaire d'inscription
   - Remplir les 3 sections du formulaire
   - Téléverser les documents requis
   - Soumettre le dossier

2. **Réinscription** :
   - Cliquer sur "Réinscription" depuis le tableau de bord
   - Les données de l'année précédente sont pré-remplies
   - Mettre à jour si nécessaire
   - Soumettre

3. **Suivi** :
   - Consulter le tableau de bord
   - Voir la timeline du workflow
   - Lire les avis et notes

### Pour l'Administration

1. **Gestion des Campagnes** :
   - Créer une nouvelle campagne
   - Définir les dates d'ouverture/fermeture
   - Activer/désactiver

2. **Validation des Dossiers** :
   - Consulter les dossiers soumis
   - Vérifier les pièces jointes
   - Valider ou rejeter avec commentaires

### Pour le Directeur de Thèse

1. **Donner un Avis** :
   - Recevoir notification de nouveau dossier
   - Consulter le dossier
   - Donner avis favorable/défavorable

## ✅ Conformité aux Exigences

- ✅ Gestion des campagnes avec dates d'ouverture/fermeture
- ✅ Formulaire d'inscription dynamique complet
- ✅ Téléversement avec vérification de format
- ✅ Circuit de validation en ligne (candidat → directeur → admin)
- ✅ Tableau de bord temps réel
- ✅ Processus de réinscription simplifié

## 🔄 Prochaines Améliorations Possibles

1. Notifications push en temps réel (WebSocket)
2. Export des dossiers en PDF
3. Signature électronique des avis
4. Statistiques pour l'administration
5. Rappels automatiques par email
6. Support multi-langues
7. Interface mobile dédiée
