import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, of, throwError, Subject } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class ApplicationsService {
  // Public submission endpoint
  private submitUrl = '/inscription-service/api/inscriptions/soumettre';
  private uploadUrl = '/inscription-service/api/inscriptions/dossier';

  private applicationsUpdated$ = new Subject<void>();

  constructor(private http: HttpClient) { }

  // Broadcast when applications have been updated (e.g., after submission)
  getApplicationsUpdated(): Observable<void> {
    return this.applicationsUpdated$.asObservable();
  }

  // Emit when applications data should be refreshed
  notifyApplicationsUpdated(): void {
    console.log('[ApplicationsService] Broadcasting applicationsUpdated event to all listeners');
    this.applicationsUpdated$.next();
  }

  getMyApplications(userId?: number): Observable<any[]> {
    // If userId is provided, use specific endpoint. Otherwise use 'me' endpoint which relies on token.
    const url = userId
      ? `/inscription-service/api/inscriptions/doctorant/${userId}/dashboard`
      : `/inscription-service/api/inscriptions/doctorant/me/dashboard`;

    console.log('[ApplicationsService] Calling getMyApplications, url:', url);
    return this.http.get<any[]>(url).pipe(
      map(data => {
        console.log('[ApplicationsService] ✓ getMyApplications returned:', data?.length || 0, 'items');
        return data || [];
      }),
      catchError(err => {
        console.error('[ApplicationsService] ✗ getMyApplications failed:', err);
        return throwError(() => err);
      })
    );
  }

  // form: InscriptionFormDTO-like object, files: map of key -> File | File[]
  submitApplication(campaignId: number, form: any, files: Record<string, File | File[]>): Observable<any> {
    console.log('[ApplicationsService] submitApplication called for campaignId:', campaignId);
    console.log('[ApplicationsService] Form data:', { ...form, doctorantId: form.doctorantId ? '***' : 'not-set' });
    console.log('[ApplicationsService] Files:', Object.keys(files));
    console.log('[ApplicationsService] Files detail:', this._filesMeta(files));

    // 1. Prepare DTO
    const dto = {
      ...form,
      campagneId: campaignId,
      // Ensure date is in YYYY-MM-DD format if it's a Date object
      dateNaissance: form.dateNaissance instanceof Date ? form.dateNaissance.toISOString().split('T')[0] : form.dateNaissance
    };

    console.log('[ApplicationsService] Prepared DTO with campagneId:', dto.campagneId);

    // 2. Submit Form Data (JSON)
    // Always use the main submission endpoint which handles InscriptionFormDTO
    // and correctly links to the doctorant if doctorantId is present in the DTO.
    const endpoint = this.submitUrl;
    console.log('[ApplicationsService] Using endpoint:', endpoint);

    const submit$ = this.http.post<any>(endpoint, dto);

    return submit$.pipe(
      switchMap(dossier => {
        // The backend now returns a minimal DTO: { id, statut, campagneId, campagneNom, piecesCount }
        console.log('[ApplicationsService] ✓ Form submission successful, dossier DTO:', dossier);
        const dossierId = dossier?.id;
        const dossierStatus = dossier?.status || dossier?.statut; // fallback for legacy field name
        if (!dossierId) {
          console.error('[ApplicationsService] ✗ Invalid dossier DTO response:', dossier);
          return throwError(() => new Error('Failed to create dossier'));
        }

        // 3. Upload Files
        const uploads: Observable<any>[] = [];

        for (const key of Object.keys(files || {})) {
          const val = files[key];
          if (!val) continue;

          // Determine TypePieceJointe based on key
          const typePiece = this.getTypeFromKey(key);

          if (Array.isArray(val)) {
            val.forEach(f => {
              console.log('[ApplicationsService] Uploading file:', key, f.name);
              uploads.push(this.uploadFile(dossier.id, f, typePiece));
            });
          } else {
            console.log('[ApplicationsService] Uploading file:', key, (val as File).name);
            uploads.push(this.uploadFile(dossierId, val as File, typePiece));
          }
        }

        if (uploads.length === 0) {
          console.log('[ApplicationsService] No files to upload');
          return of(dossier);
        }

        console.log('[ApplicationsService] Starting file uploads, total files:', uploads.length);
        return forkJoin(uploads).pipe(
          map(() => {
            console.log('[ApplicationsService] ✓ All files uploaded successfully');
            return dossier;
          })
        );
      }),
      catchError(err => {
        console.error('[ApplicationsService] ✗ Application submission failed:', err);
        console.error('[ApplicationsService] Error status:', err.status);
        console.error('[ApplicationsService] Error statusText:', err.statusText);
        console.error('[ApplicationsService] Error body:', err.error);
        console.error('[ApplicationsService] Error message:', err.message);
        return throwError(() => err);
      })
    );
  }

  private uploadFile(dossierId: number, file: File, type: string): Observable<any> {
    const fd = new FormData();
    fd.append('file', file);
    // Spring expects the enum name exactly as defined (e.g., "CV", "DIPLOME")
    // Backend will parse this as TypePieceJointe enum
    fd.append('typePiece', type);
    const url = `${this.uploadUrl}/${dossierId}/upload-typed`;
    console.log('[ApplicationsService] Uploading to:', url, 'type:', type, 'file:', file.name);
    console.log('[ApplicationsService] FormData entries:', Array.from(fd.entries()));
    return this.http.post(url, fd).pipe(
      map(res => {
        console.log('[ApplicationsService] ✓ File uploaded:', file.name);
        return res;
      }),
      catchError(err => {
        console.error('[ApplicationsService] ✗ File upload failed:', file.name, err);
        console.error('[ApplicationsService] Error status:', err.status);
        console.error('[ApplicationsService] Error statusText:', err.statusText);
        console.error('[ApplicationsService] Error body type:', typeof err.error);
        console.error('[ApplicationsService] Error body:', err.error);
        console.error('[ApplicationsService] Error message:', err.message);
        
        // If status is 200 but parsing failed, log the raw response
        if (err.status === 200 && err.message && err.message.includes('JSON')) {
          console.error('[ApplicationsService] ⚠️ Backend returned 200 but response is not valid JSON!');
          console.error('[ApplicationsService] This usually means the backend returned an error page instead of JSON');
          console.error('[ApplicationsService] Raw error text (first 500 chars):', String(err.error).substring(0, 500));
        }
        
        return throwError(() => err);
      })
    );
  }

  private getTypeFromKey(key: string): string {
    // Must match TypePieceJointe enum exactly: CV, LETTRE_MOTIVATION, DIPLOME, PHOTO_IDENTITE, CARTE_IDENTITE, CERTIFICAT_SCOLARITE, ATTESTATION, AUTRE
    switch (key) {
      case 'cv': return 'CV';
      case 'coverLetter': return 'LETTRE_MOTIVATION';
      case 'diplomas': return 'DIPLOME';
      case 'transcripts': return 'AUTRE';
      case 'recommendations': return 'AUTRE';
      case 'photo': return 'PHOTO_IDENTITE';
      case 'cin': return 'CARTE_IDENTITE';
      case 'certificat': return 'CERTIFICAT_SCOLARITE';
      case 'attestation': return 'ATTESTATION';
      default: 
        console.warn('[ApplicationsService] Unknown file key:', key, '- using AUTRE');
        return 'AUTRE';
    }
  }

  private _filesMeta(files: Record<string, File | File[]>): any {
    const out: Record<string, any> = {};
    for (const k of Object.keys(files || {})) {
      const v = files[k];
      if (!v) continue;
      if (Array.isArray(v)) out[k] = v.map(f => ({ name: f.name, size: f.size, type: f.type }));
      else out[k] = { name: (v as File).name, size: (v as File).size, type: (v as File).type };
    }
    return out;
  }
}
