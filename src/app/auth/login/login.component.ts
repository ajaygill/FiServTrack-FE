import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';

@Component({ standalone: true, imports: [CommonModule, FormsModule], templateUrl: './login.component.html', styleUrl: './login.component.scss' })
export class LoginComponent {
  userName = '';
  password = '';
  error = '';
  loading = false;

  constructor(private auth: AuthService) {}

  async login() {
    if (!this.userName.trim() || !this.password) {
      this.error = 'Please enter username and password.';
      return;
    }
    try {
      this.loading = true;
      this.error = '';
      await this.auth.login(this.userName, this.password);
    } catch (e: any) {
      const msg = e?.error?.error || e?.message || '';
      if (msg.includes('JSON.parse') || e?.status === 0) {
        this.error = 'Cannot reach the API. Start the BE app and accept its SSL certificate in the browser, then try again.';
      } else {
        this.error = msg || 'Login failed. Please check your credentials.';
      }
    } finally {
      this.loading = false;
    }
  }
}
