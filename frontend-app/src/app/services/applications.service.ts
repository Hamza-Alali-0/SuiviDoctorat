import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, of, throwError } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class ApplicationsService {
  // Public submission endpoint
  private submitUrl = '/inscription-service/api/inscriptions/soumettre';
  private uploadUrl = '/inscription-service/api/inscriptions/dossier';

  constructor(private http: HttpClient) {}

  getMyApplications(userId: number): Observable<any[]> {
    return this.http.get<any[]>(`/inscription-service/api/inscriptions/doctorant/${userId}/dashboard`);
  }

  // form: InscriptionFormDTO-like object, files: map of key -> File | File[]
  submitApplication(campaignId: number, form: any, files: Record<string, File | File[]>): Observable<any> {
    // 1. Prepare DTO
    const dto = {
      ...form,
      campagneId: campaignId,
      // Ensure date is in YYYY-MM-DD format if it's a Date object
      dateNaissance: form.dateNaissance instanceof Date ? form.dateNaissance.toISOString().split('T')[0] : form.dateNaissance
    };

    // 2. Submit Form Data (JSON)
    return this.http.post<any>(this.submitUrl, dto).pipe(
      switchMap(dossier => {
        if (!dossier || !dossier.id) {
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
            val.forEach(f => uploads.push(this.uploadFile(dossier.id, f, typePiece)));
          } else {
            uploads.push(this.uploadFile(dossier.id, val as File, typePiece));
          }
        }
        
        if (uploads.length === 0) {
          return of(dossier);
        }
        
        return forkJoin(uploads).pipe(
          map(() => dossier)
        );
      }),
      catchError(err => {
        console.error('Application submission failed', err);
        // Fallback to local storage if offline or server error (optional, but good for UX)
        try {
          const saved = JSON.parse(localStorage.getItem('pending_applications') || '[]');
          saved.push({ campaignId, form, filesMeta: this._filesMeta(files), date: Date.now() });
          localStorage.setItem('pending_applications', JSON.stringify(saved));
          return of({ fallback: true, message: 'saved-local' });
        } catch (e) {
          return throwError(() => err);
        }
      })
    );
  }

  private uploadFile(dossierId: number, file: File, type: string): Observable<any> {
    const fd = new FormData();
    fd.append('file', file);
    fd.append('typePiece', type);
    return this.http.post(`${this.uploadUrl}/${dossierId}/upload-typed`, fd);
  }

  private getTypeFromKey(key: string): string {
    switch (key) {
      case 'cv': return 'CV';
      case 'coverLetter': return 'LETTRE_MOTIVATION';
      case 'diplomas': return 'DIPLOME';
      case 'transcripts': return 'AUTRE'; // Or maybe create a TRANSCRIPT type if available, else AUTRE
      case 'recommendations': return 'AUTRE';
      case 'photo': return 'PHOTO_IDENTITE';
      case 'cin': return 'CARTE_IDENTITE';
      default: return 'AUTRE';
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
