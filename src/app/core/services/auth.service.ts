import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { JSEncrypt } from 'jsencrypt';
import { firstValueFrom } from 'rxjs';
import { API_BASE_URL } from '../config';

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(private http: HttpClient, private router: Router) {}

  async login(userName: string, password: string) {
    const key = await firstValueFrom(this.http.get<{ publicKey: string }>(`${API_BASE_URL}/auth/public-key`));
    const enc = new JSEncrypt();
    enc.setPublicKey(key.publicKey);
    const payload = enc.encrypt(JSON.stringify({ userName, password }));
    if (!payload) throw new Error('Unable to encrypt login payload. Restart the .NET API and try again.');

    const res = await firstValueFrom(this.http.post<{ token: string; fullName: string }>(`${API_BASE_URL}/auth/login`, { payload }));
    localStorage.setItem('token', res.token);
    localStorage.setItem('fullName', res.fullName);
    this.router.navigate(['/dashboard']);
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('fullName');
    this.router.navigate(['/login']);
  }

  handleUnauthorized() {
    localStorage.removeItem('token');
    localStorage.removeItem('fullName');
    if (!this.router.url.startsWith('/login')) {
      this.router.navigate(['/login']);
    }
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    return !!token && !this.isTokenExpired(token);
  }

  isTokenExpired(token: string = localStorage.getItem('token') || ''): boolean {
    if (!token) return true;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return !payload.exp || payload.exp * 1000 <= Date.now();
    } catch {
      return true;
    }
  }
}
