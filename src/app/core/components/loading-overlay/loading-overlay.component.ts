import { AsyncPipe, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { LoadingService } from '../../services/loading.service';

@Component({
  standalone: true,
  selector: 'app-loading-overlay',
  imports: [NgIf, AsyncPipe],
  template: `
    <div *ngIf="loading.isLoading$ | async" class="loading-overlay" aria-live="polite" aria-busy="true">
      <div class="loading-panel">
        <span class="loading-spinner"></span>
        <span class="loading-text">Loading...</span>
      </div>
    </div>
  `,
  styles: [`
    .loading-overlay {
      position: fixed;
      inset: 0;
      z-index: 9999;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(23, 32, 42, 0.35);
      backdrop-filter: blur(1px);
    }
    .loading-panel {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 12px;
      padding: 24px 28px;
      border-radius: 12px;
      background: #fff;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.18);
    }
    .loading-spinner {
      width: 40px;
      height: 40px;
      border: 4px solid #e5e8e8;
      border-top-color: var(--theme-primary, #273746);
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }
    .loading-text {
      font-size: 14px;
      color: var(--theme-text-muted, #566573);
    }
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  `]
})
export class LoadingOverlayComponent {
  constructor(public loading: LoadingService) {}
}
