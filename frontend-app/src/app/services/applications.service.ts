import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpRequest } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class ApplicationsService {
  // Public submission endpoint (adjust if backend path differs)
  private submitUrl = '/inscription-service/api/inscriptions/applications';

  constructor(private http: HttpClient) {}

  // form: plain object, files: map of key -> File | File[]
  submitApplication(campaignId: number, form: any, files: Record<string, File | File[]>): Observable<any> {
    const fd = new FormData();
    fd.append('campaignId', String(campaignId));
    // append form fields
    for (const k of Object.keys(form || {})) {
      if (form[k] !== undefined && form[k] !== null) fd.append(k, String(form[k]));
    }

    // append files
    for (const key of Object.keys(files || {})) {
      const val = files[key];
      if (!val) continue;
      if (Array.isArray(val)) {
        val.forEach((f, idx) => fd.append(key, f, f.name || `${key}-${idx}`));
      } else {
        const f = val as File;
        fd.append(key, f, f.name || key);
      }
    }

    // Try to POST to backend; if it fails, catch and persist locally
    return this.http.post(this.submitUrl, fd).pipe(
      catchError(err => {
        try {
          // Save to localStorage as fallback
          const saved = JSON.parse(localStorage.getItem('pending_applications') || '[]');
          saved.push({ campaignId, form, filesMeta: this._filesMeta(files), date: Date.now() });
          localStorage.setItem('pending_applications', JSON.stringify(saved));
        } catch (e) {}
        return of({ fallback: true, message: 'saved-local' });
      })
    );
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
