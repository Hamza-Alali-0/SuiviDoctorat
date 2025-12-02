import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface CampagnePayload {
  id?: number;
  nom: string;
  type: string;
  anneeUniversitaire?: string;
  description?: string;
  dateOuverture?: string;
  dateFermeture?: string;
  active?: boolean;
  visibilite?: string;
  // other optional fields
  [key: string]: any;
}

@Injectable({ providedIn: 'root' })
export class CampagnesService {
  private base = '/inscription-service/api/admin/campagnes';
  private publicBase = '/inscription-service/api/inscriptions';

  constructor(private http: HttpClient) { }

  // Admin endpoints (require authentication)
  getAll(): Observable<any[]> {
    return this.http.get<any[]>(this.base);
  }

  getById(id: number): Observable<any> {
    return this.http.get<any>(`${this.base}/${id}`);
  }

  // Public endpoints (no authentication required)
  getActiveCampaigns(): Observable<any[]> {
    return this.http.get<any[]>(`${this.publicBase}/campagnes/actives`);
  }

  getActiveCampaignById(id: number): Observable<any> {
    // For now, get all and filter - or create a backend endpoint if needed
    return this.http.get<any>(`${this.publicBase}/campagnes/actives`);
  }

  create(payload: CampagnePayload): Observable<any> {
    return this.http.post<any>(this.base, payload);
  }

  update(id: number, payload: CampagnePayload): Observable<any> {
    return this.http.put<any>(`${this.base}/${id}`, payload);
  }

  delete(id: number): Observable<any> {
    return this.http.delete<any>(`${this.base}/${id}`);
  }

  // Favorites (User specific)
  addFavorite(id: number): Observable<any> {
    return this.http.post(`${this.publicBase}/doctorant/me/favorites/${id}`, {});
  }

  removeFavorite(id: number): Observable<any> {
    return this.http.delete(`${this.publicBase}/doctorant/me/favorites/${id}`);
  }

  getMyFavorites(): Observable<any[]> {
    return this.http.get<any[]>(`${this.publicBase}/doctorant/me/favorites`);
  }
}
