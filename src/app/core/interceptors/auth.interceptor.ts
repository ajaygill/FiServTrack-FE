import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

const isAuthRequest = (url: string) => url.includes('/auth/login') || url.includes('/auth/public-key');

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const token = localStorage.getItem('token');

  if (token && auth.isTokenExpired(token)) {
    auth.handleUnauthorized();
    return throwError(() => new HttpErrorResponse({ status: 401, statusText: 'Token expired' }));
  }

  const authReq = token ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }) : req;

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 && !isAuthRequest(req.url)) {
        auth.handleUnauthorized();
      }
      return throwError(() => error);
    })
  );
};
