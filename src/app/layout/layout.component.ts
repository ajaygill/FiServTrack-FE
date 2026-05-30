import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../core/services/auth.service';

@Component({ standalone: true, imports: [RouterOutlet, RouterLink, RouterLinkActive], templateUrl: './layout.component.html', styleUrl: './layout.component.scss' })
export class LayoutComponent {
  fullName = localStorage.getItem('fullName') || 'User';
  sidebarCollapsed = localStorage.getItem('sidebarCollapsed') === 'true';
  masterExpanded = localStorage.getItem('masterExpanded') !== 'false';
  dailyJobsExpanded = localStorage.getItem('dailyJobsExpanded') !== 'false';

  constructor(public auth: AuthService) {}

  toggleSidebar() {
    this.sidebarCollapsed = !this.sidebarCollapsed;
    localStorage.setItem('sidebarCollapsed', String(this.sidebarCollapsed));
  }

  toggleMaster() {
    this.masterExpanded = !this.masterExpanded;
    localStorage.setItem('masterExpanded', String(this.masterExpanded));
  }

  toggleDailyJobs() {
    this.dailyJobsExpanded = !this.dailyJobsExpanded;
    localStorage.setItem('dailyJobsExpanded', String(this.dailyJobsExpanded));
  }
}
