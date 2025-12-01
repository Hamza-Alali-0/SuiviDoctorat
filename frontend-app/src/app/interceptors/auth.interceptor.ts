import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { throwError, EMPTY } from 'rxjs';
import { Injector } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private injector: Injector) {}
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('auth_token');
    try { console.log('[AuthInterceptor] url=', req.url, ' tokenPresent=', !!token); } catch(e){}
    let outReq = req;
    // Do not attach Authorization header for login/signup endpoints to avoid sending stale tokens
    const url = (req.url || '').toLowerCase();
    const isAuthEndpoint = url.includes('/api/auth/login') || url.includes('/api/auth/signup');
    if (token && !isAuthEndpoint) {
      outReq = req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
      try { console.log('[AuthInterceptor] attached Authorization header for', req.method, req.url); } catch(e){}
    } else if (isAuthEndpoint) {
      try { console.log('[AuthInterceptor] skipping Authorization header for auth endpoint', req.url); } catch(e){}
    }
    return next.handle(outReq).pipe(
      catchError((err:any) => {
        try {
          const router = this.injector.get(Router);
          const auth = this.injector.get(AuthService);
          // Only force logout on 401/403 when token truly missing or expired, not just any protected fetch.
          const tokenPresent = !!localStorage.getItem('auth_token');
          const isProfileEndpoint = url.includes('/api/auth/me');
          const isDashboardMe = url.includes('/doctorant/me/dashboard');
          const unauthorized = err && (err.status === 401 || err.status === 403);
          if (unauthorized && !isAuthEndpoint) {
            // Check if token is expired via AuthService before logging out
            const expired = auth.isTokenExpired();
            if (expired || !tokenPresent) {
              console.warn('[AuthInterceptor] Unauthorized and token expired/missing → logging out');
              try { console.warn('[AuthInterceptor] response body:', err?.error); } catch(e){}
              auth.setAuth(null, null);
              try { router.navigate(['/auth'], { queryParams: { sessionExpired: '1' } }); } catch(e){}
              return EMPTY;
            } else {
              // Non-expired token: treat as recoverable (maybe user not a doctorant yet). Skip forced logout.
              console.warn('[AuthInterceptor] Unauthorized but token valid; ignoring logout for endpoint:', req.url);
              return throwError(() => err);
            }
          }
        } catch(e){}
        return throwError(() => err);
      })
    );
  }
}
