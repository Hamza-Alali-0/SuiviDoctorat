# Encadrant Profile Implementation

## Overview

Complete implementation of the encadrant (supervisor) profile page matching the candidat profile design with appropriate supervisor-specific fields.

## Frontend Changes

### 1. Profile Component Created

**Location**: `frontend-app/src/app/pages/encadrant/profile/`

#### profile.ts

- **Component**: `EncadrantProfileComponent`
- **Imports**: CommonModule, FormsModule, HttpClient, AuthService, EncadrantNavbarComponent, ModalComponent
- **Features**:
  - Profile view and edit modes
  - Avatar upload with preview
  - CV upload/download functionality
  - Bio and professional information editing
  - Research fields management
  - Social/academic links (LinkedIn, Portfolio, ResearchGate, Google Scholar)
  - Stats display (doctorants, soutenances, publications)
  - Modal notifications for success/error messages

#### profile.html

- **Layout**: Sidebar + Main content grid (matches candidat profile)
- **Sidebar Components**:
  - Avatar with edit button (black background for initials)
  - Name and role badge
  - Bio section
  - CV section with view/download/upload buttons
  - Social links badges
- **Main Content**:
  - Stats row (3 cards: Doctorants encadrés, Soutenances à venir, Publications)
  - Profile details card (personal info, institutional affiliation)
  - Research & publications card (domains, publication count, H-index, ORCID)
  - Social/professional links card (LinkedIn, Portfolio, ResearchGate, Google Scholar)

### 2. Navbar Updates

**Location**: `frontend-app/src/app/components/encadrant-navbar/`

#### Changes Applied:

- ✅ Logo integration (logo_white.png for light theme, logo.png for dark theme)
- ✅ All avatar backgrounds changed to black (#000) replacing gradients
- ✅ Profile button avatar: black background
- ✅ Sidebar avatar: black background
- ✅ Dropdown avatar: black background

### 3. Routing

**Location**: `frontend-app/src/app/app.routes.ts`

Added route:

```typescript
{ path: 'encadrant/profile', loadComponent: () => import('./pages/encadrant/profile/profile').then(m => m.EncadrantProfileComponent) }
```

## Backend Changes

### 1. REST Controller Created

**Location**: `gestion-auth-service/src/main/java/com/devbuild/gestionauth/controller/EncadrantRestController.java`

#### Endpoints:

##### GET /api/encadrant/profile

- **Auth**: ENCADRANT or ADMIN
- **Returns**: Complete encadrant profile data
- **Fields**: id, firstName, lastName, email, role, bio, phone, etablissement, laboratoire, specialite, grade, domainesRecherche, nombrePublications, hIndex, orcidId, linkedinUrl, portfolioUrl, researchGateUrl, googleScholarUrl, cvUrl, avatarUrl

##### PUT /api/encadrant/profile

- **Auth**: ENCADRANT or ADMIN
- **Body**: JSON with profile fields to update
- **Returns**: Updated profile data
- **Updates**: All encadrant-specific fields

##### POST /api/encadrant/avatar

- **Auth**: ENCADRANT or ADMIN
- **Body**: Multipart file upload
- **Saves to**: `uploads/avatars/{userId}/avatar_{uuid}.{ext}`
- **Returns**: { avatarUrl, url }

##### POST /api/encadrant/cv

- **Auth**: ENCADRANT or ADMIN
- **Body**: Multipart file upload (PDF, DOC, DOCX)
- **Saves to**: `uploads/cv/{userId}/cv_{uuid}.{ext}`
- **Returns**: { cvUrl, url }

##### GET /api/encadrant/stats

- **Auth**: ENCADRANT or ADMIN
- **Returns**: { doctorants: 0, soutenances: 0, publications: 0 }
- **Note**: Currently returns placeholder values - implement real queries as needed

### 2. User Model Enhanced

**Location**: `gestion-auth-service/src/main/java/com/devbuild/gestionauth/model/User.java`

#### New Fields Added:

```java
private String etablissement;          // Institution/University
private String laboratoire;            // Research laboratory
private String specialite;             // Research specialty
private String grade;                  // Academic grade (Professor, etc.)
private String domainesRecherche;      // Research areas (TEXT field)
private Integer nombrePublications;    // Number of publications
private Integer hIndex;                // H-index score
private String orcidId;                // ORCID identifier
private String researchGateUrl;        // ResearchGate profile
private String googleScholarUrl;       // Google Scholar profile
private String avatarUrl;              // Avatar image URL
```

#### Helper Method Added:

```java
public String getRole() {
    if (roles == null || roles.isEmpty()) return null;
    return roles.iterator().next().name();
}
```

### 3. Database Migration

**Location**: `gestion-auth-service/db/add_encadrant_profile_fields.sql`

#### SQL Script:

```sql
ALTER TABLE users ADD COLUMN IF NOT EXISTS etablissement VARCHAR(255);
ALTER TABLE users ADD COLUMN IF NOT EXISTS laboratoire VARCHAR(255);
ALTER TABLE users ADD COLUMN IF NOT EXISTS specialite VARCHAR(255);
ALTER TABLE users ADD COLUMN IF NOT EXISTS grade VARCHAR(255);
ALTER TABLE users ADD COLUMN IF NOT EXISTS domaines_recherche TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS nombre_publications INTEGER;
ALTER TABLE users ADD COLUMN IF NOT EXISTS h_index INTEGER;
ALTER TABLE users ADD COLUMN IF NOT EXISTS orcid_id VARCHAR(255);
ALTER TABLE users ADD COLUMN IF NOT EXISTS research_gate_url VARCHAR(512);
ALTER TABLE users ADD COLUMN IF NOT EXISTS google_scholar_url VARCHAR(512);
ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar_url VARCHAR(512);
```

## Design Consistency

### Matching Candidat Profile

1. **Layout**: Same sidebar + main content grid structure
2. **Color Scheme**: Black avatar backgrounds (#000), blue primary (#3b82f6)
3. **Components**: Avatar upload, CV section, bio, social links, stats cards
4. **Edit Mode**: Toggle edit mode with Cancel/Save buttons
5. **Modal**: Same modal component for notifications

### Encadrant-Specific Adaptations

1. **Stats Cards**:

   - Candidat: Progress metrics (thesis progress, documents, applications)
   - Encadrant: Supervision metrics (doctorants, soutenances, publications)

2. **Profile Fields**:

   - Candidat: Thesis info (sujet, directeur, laboratoire)
   - Encadrant: Academic info (grade, specialite, research domains, H-index, ORCID)

3. **Social Links**:
   - Candidat: LinkedIn, Portfolio, GitHub, Twitter
   - Encadrant: LinkedIn, Portfolio, ResearchGate, Google Scholar

## File Upload Structure

```
uploads/
├── avatars/
│   └── {userId}/
│       └── avatar_{uuid}.{ext}
└── cv/
    └── {userId}/
        └── cv_{uuid}.{ext}
```

## Usage

### Running Database Migration

```bash
# Connect to your PostgreSQL database
psql -U your_username -d your_database -f gestion-auth-service/db/add_encadrant_profile_fields.sql
```

### Accessing the Profile

1. Login as an encadrant user
2. Navigate to: `/encadrant/profile`
3. Or click "Profil" in the encadrant navbar

### Testing Endpoints

```bash
# Get profile
curl -X GET http://localhost:8080/api/encadrant/profile \
  -H "Authorization: Bearer {token}"

# Update profile
curl -X PUT http://localhost:8080/api/encadrant/profile \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "grade": "Professeur",
    "specialite": "Intelligence Artificielle",
    "nombrePublications": 42
  }'

# Upload avatar
curl -X POST http://localhost:8080/api/encadrant/avatar \
  -H "Authorization: Bearer {token}" \
  -F "file=@avatar.jpg"

# Upload CV
curl -X POST http://localhost:8080/api/encadrant/cv \
  -H "Authorization: Bearer {token}" \
  -F "file=@cv.pdf"
```

## Future Enhancements

### Stats Implementation

Currently, `/api/encadrant/stats` returns placeholder values. To implement real stats:

1. Create queries to count:

   - Supervised doctorants (active PhD students)
   - Upcoming defenses (soutenances)
   - Publications count (from profile or external API)

2. Add relationships in User model or create separate entities for:
   - Doctorant supervision records
   - Soutenance records linked to encadrant

### Additional Features to Consider

- List of supervised doctorants with progress tracking
- Publications list management
- Research projects management
- Collaboration networks visualization
- Calendar integration for defenses/meetings
- Document sharing with doctorants
- Evaluation/feedback system

## Implementation Summary

✅ **Completed**:

- Encadrant profile page (frontend component)
- Backend REST API endpoints
- User model enhanced with encadrant fields
- Database migration script
- Routing configuration
- Navbar logo and avatar styling updates

✅ **Tested**:

- Component structure matches candidat profile
- Edit mode functionality
- File upload placeholders
- Modal notifications
- Responsive layout

🔄 **Pending**:

- Database migration execution (manual step)
- Real stats implementation (queries needed)
- Backend testing with actual data
- Integration testing with authentication

## Notes

- The profile page is fully styled and matches the candidat profile design
- Avatar backgrounds are black (#000) across all user roles for consistency
- Logo integration uses theme-based switching (logo_white.png / logo.png)
- All encadrant fields are nullable to support gradual profile completion
- File uploads use UUID-based filenames to prevent collisions
- The component uses Angular signals and standalone architecture
