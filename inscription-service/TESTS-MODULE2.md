# Guide de Test - Module 2 : Inscription et Réinscription

## 🧪 Tests Manuels

### 1. Test de Gestion des Campagnes

#### 1.1 Créer une campagne
```bash
curl -X POST http://localhost:8080/inscription-service/api/admin/campagnes \
  -H "Content-Type: application/json" \
  -d '{
    "nom": "Inscription Doctorale 2025-2026",
    "dateOuverture": "2025-09-01",
    "dateFermeture": "2025-11-30",
    "active": true
  }'
```

#### 1.2 Lister les campagnes actives
```bash
curl http://localhost:8080/inscription-service/api/inscriptions/campagnes/actives
```

#### 1.3 Activer/Désactiver une campagne
```bash
curl -X POST http://localhost:8080/inscription-service/api/admin/campagnes/1/toggle
```

### 2. Test de Soumission d'Inscription

#### 2.1 Soumettre un dossier complet
```bash
curl -X POST http://localhost:8080/inscription-service/api/inscriptions/soumettre \
  -H "Content-Type: application/json" \
  -d '{
    "prenom": "Ahmed",
    "nom": "Benali",
    "email": "ahmed.benali@example.com",
    "dateNaissance": "1995-03-15",
    "lieuNaissance": "Casablanca",
    "sexe": "M",
    "nationalite": "Marocaine",
    "cin": "AB123456",
    "telephone": "+212600000000",
    "adresse": "123 Rue de l'\''Université, Casablanca",
    "diplomesPrecedents": "Master en Informatique",
    "etablissementOrigine": "Université Hassan II",
    "sujetThese": "Intelligence Artificielle et Apprentissage Automatique",
    "directeurThese": "Pr. Mohammed Alaoui",
    "coDirecteur": "Dr. Fatima Zahra Idrissi",
    "laboratoire": "Laboratoire d'\''Intelligence Artificielle",
    "typeCollaboration": "Internationale",
    "organismeCollaboration": "MIT",
    "paysCollaboration": "États-Unis",
    "campagneId": 1,
    "reinscription": false
  }'
```

### 3. Test de Upload de Documents

#### 3.1 Upload d'un CV (sans type)
```bash
curl -X POST http://localhost:8080/inscription-service/api/inscriptions/dossier/1/upload \
  -F "file=@cv.pdf"
```

#### 3.2 Upload avec type et description
```bash
curl -X POST http://localhost:8080/inscription-service/api/inscriptions/dossier/1/upload-typed \
  -F "file=@diplome.pdf" \
  -F "typePiece=DIPLOME" \
  -F "description=Master en Informatique 2023"
```

### 4. Test du Circuit de Validation

#### 4.1 Directeur donne son avis
```bash
curl -X POST "http://localhost:8080/inscription-service/api/inscriptions/dossier/1/directeur/avis?avis=Favorable" \
  -H "Content-Type: application/json"
```

#### 4.2 Admin valide le dossier
```bash
curl -X POST "http://localhost:8080/inscription-service/api/inscriptions/dossier/1/admin/valider?valide=true&note=Dossier%20complet%20et%20conforme" \
  -H "Content-Type: application/json"
```

#### 4.3 Admin rejette le dossier
```bash
curl -X POST "http://localhost:8080/inscription-service/api/inscriptions/dossier/1/admin/valider?valide=false&note=Documents%20manquants" \
  -H "Content-Type: application/json"
```

### 5. Test du Dashboard

#### 5.1 Récupérer le dashboard d'un doctorant
```bash
curl http://localhost:8080/inscription-service/api/inscriptions/doctorant/1/dashboard-enhanced
```

Réponse attendue :
```json
[
  {
    "dossierId": 1,
    "campagneNom": "Inscription Doctorale 2025-2026",
    "statut": "VALIDÉ",
    "dateSoumission": "2025-11-22T10:30:00",
    "reinscription": false,
    "sujetThese": "Intelligence Artificielle...",
    "directeurThese": "Pr. Mohammed Alaoui",
    "nombrePiecesJointes": 3,
    "avisDirecteur": "Favorable",
    "dateAvisDirecteur": "2025-11-23T14:20:00",
    "avisAdmin": "Dossier complet et conforme",
    "dateValidationAdmin": "2025-11-24T09:15:00",
    "etapeActuelle": {
      "etape": "Terminé",
      "description": "Dossier validé",
      "completed": true,
      "current": false
    },
    "timeline": [
      {
        "etape": "Soumission",
        "description": "Dossier soumis par le candidat",
        "date": "2025-11-22T10:30:00",
        "completed": true,
        "current": false
      },
      {
        "etape": "Avis Directeur",
        "description": "Avis donné: Favorable",
        "date": "2025-11-23T14:20:00",
        "completed": true,
        "current": false
      },
      {
        "etape": "Validation Administrative",
        "description": "Décision: VALIDÉ",
        "date": "2025-11-24T09:15:00",
        "completed": true,
        "current": false
      }
    ]
  }
]
```

### 6. Test de Réinscription

#### 6.1 Créer une réinscription
```bash
curl -X POST http://localhost:8080/inscription-service/api/inscriptions/doctorant/1/reinscription
```

## 🎯 Scénarios de Test Complets

### Scénario 1 : Inscription Complète Réussie

1. ✅ Créer une campagne active
2. ✅ Soumettre un dossier d'inscription
3. ✅ Upload de 3 documents (CV, Diplôme, Lettre motivation)
4. ✅ Directeur donne avis favorable
5. ✅ Admin valide le dossier
6. ✅ Vérifier le dashboard (statut VALIDÉ)

### Scénario 2 : Dossier Rejeté

1. ✅ Soumettre un dossier d'inscription
2. ✅ Directeur donne avis défavorable
3. ✅ Admin rejette avec note explicative
4. ✅ Vérifier le dashboard (statut REJETÉ)

### Scénario 3 : Réinscription

1. ✅ Avoir un dossier validé de l'année N-1
2. ✅ Créer une nouvelle campagne de réinscription
3. ✅ Créer une réinscription (données copiées)
4. ✅ Mettre à jour les informations si nécessaire
5. ✅ Soumettre la réinscription

### Scénario 4 : Validation des Fichiers

1. ❌ Tenter d'upload un fichier .exe (rejet attendu)
2. ❌ Tenter d'upload un fichier > 10MB (rejet attendu)
3. ✅ Upload PDF valide
4. ✅ Upload JPG valide
5. ✅ Upload PNG valide

### Scénario 5 : Campagne Fermée

1. ❌ Tenter de soumettre hors période (rejet attendu)
2. ❌ Tenter d'upload sur dossier avec campagne fermée (rejet attendu)
3. ✅ Ouvrir la campagne
4. ✅ Soumettre avec succès

## 🖥️ Tests Frontend

### Test du Formulaire d'Inscription

1. Accéder à `http://localhost:4200/doctorant/inscription`
2. **Étape 1** : Remplir les informations personnelles
   - Sélectionner une campagne
   - Remplir prénom, nom, email
   - Sélectionner date de naissance
   - Compléter les champs optionnels
   - Cliquer "Suivant"
3. **Étape 2** : Remplir formation et recherche
   - Saisir le sujet de thèse
   - Nom du directeur
   - Informations de collaboration
   - Cliquer "Suivant"
4. **Étape 3** : Upload de documents
   - Glisser-déposer des fichiers
   - Vérifier la liste des fichiers
   - Cliquer "Soumettre"
5. ✅ Vérifier le message de succès
6. ✅ Redirection vers le dashboard

### Test du Dashboard

1. Accéder à `http://localhost:4200/doctorant/dashboard`
2. ✅ Vérifier l'affichage des dossiers
3. ✅ Vérifier les badges de statut
4. ✅ Vérifier la timeline workflow
5. ✅ Vérifier l'étape actuelle (animation)
6. ✅ Tester le bouton "Réinscription"
7. ✅ Tester le bouton "Nouvelle Inscription"

### Test Admin Campagnes

1. Accéder à `http://localhost:4200/admin/campagnes`
2. ✅ Créer une nouvelle campagne
3. ✅ Modifier une campagne existante
4. ✅ Activer/Désactiver une campagne
5. ✅ Vérifier le statut (En cours, À venir, Terminée)

## 📊 Tests de Performance

### Test de Charge

```bash
# Test avec Apache Bench
ab -n 1000 -c 10 http://localhost:8080/inscription-service/api/inscriptions/campagnes/actives
```

### Test d'Upload Multiple

```bash
# Upload de 10 fichiers simultanés
for i in {1..10}; do
  curl -X POST http://localhost:8080/inscription-service/api/inscriptions/dossier/1/upload \
    -F "file=@test$i.pdf" &
done
wait
```

## ✅ Checklist de Validation

- [ ] Campagnes : CRUD complet fonctionne
- [ ] Formulaire : Toutes les étapes se complètent
- [ ] Validation : Champs requis vérifiés
- [ ] Upload : Formats validés correctement
- [ ] Upload : Taille max respectée
- [ ] Workflow : Notifications envoyées
- [ ] Workflow : Avis directeur enregistré
- [ ] Workflow : Validation admin fonctionne
- [ ] Dashboard : Timeline affichée correctement
- [ ] Dashboard : Statuts à jour en temps réel
- [ ] Réinscription : Données copiées
- [ ] Réinscription : Modification possible
- [ ] Sécurité : Validation côté serveur
- [ ] Sécurité : Fichiers malveillants rejetés
- [ ] Performance : Temps de réponse < 500ms
- [ ] UX : Messages d'erreur clairs

## 🐛 Cas d'Erreur à Tester

1. Email invalide
2. Date de naissance future
3. Campagne inexistante
4. Fichier corrompu
5. Fichier trop volumineux
6. Type MIME invalide
7. Dossier déjà validé (modification interdite)
8. Upload sur campagne fermée
9. Champs requis manquants
10. Format de date incorrect

## 📝 Résultats Attendus

| Test | Entrée | Sortie Attendue | Statut |
|------|--------|-----------------|--------|
| Campagne active | GET /campagnes/actives | Liste campagnes | ✅ |
| Inscription valide | POST /soumettre + données complètes | Dossier créé, statut SOUMIS | ✅ |
| Upload PDF | POST /upload + cv.pdf | PieceJointe créée | ✅ |
| Upload EXE | POST /upload + virus.exe | Erreur 400 | ✅ |
| Avis directeur | POST /directeur/avis | Statut EN_ATTENTE | ✅ |
| Validation admin | POST /admin/valider | Statut VALIDÉ | ✅ |
| Dashboard | GET /dashboard-enhanced | Timeline complète | ✅ |
| Réinscription | POST /reinscription | Nouveau dossier avec données copiées | ✅ |
