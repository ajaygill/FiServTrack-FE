import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';

@Component({ standalone: true, imports: [CommonModule, FormsModule], templateUrl: './account-list.component.html', styleUrl: './account-list.component.scss' })
export class AccountListComponent implements OnInit {
  accounts: any[] = [];
  search = '';
  sortBy = 'name';
  statusFilter = 'all';
  pageSize = 7;
  currentPage = 1;

  constructor(private api: ApiService, private router: Router) {}

  ngOnInit() {
    this.load();
  }

  load() {
    this.api.getAccounts().subscribe(r => {
      this.accounts = r;
      if (this.currentPage > this.totalPages) this.currentPage = this.totalPages || 1;
    });
  }

  get filteredAccounts() {
    const q = this.search.trim().toLowerCase();
    let rows = this.accounts.filter(a => {
      if (this.statusFilter === 'active' && !a.isActive) return false;
      if (this.statusFilter === 'inactive' && a.isActive) return false;
      if (!q) return true;
      return [a.name, a.accountType?.description, a.currency?.code, a.group?.name].some(v => (v || '').toLowerCase().includes(q));
    });

    rows = [...rows].sort((a, b) => {
      if (this.sortBy === 'opening') return Number(b.openingBalance || 0) - Number(a.openingBalance || 0);
      if (this.sortBy === 'type') return (a.accountType?.description || '').localeCompare(b.accountType?.description || '');
      return (a.name || '').localeCompare(b.name || '');
    });
    return rows;
  }

  get totalPages() {
    return Math.max(1, Math.ceil(this.filteredAccounts.length / this.pageSize));
  }

  get pagedAccounts() {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredAccounts.slice(start, start + this.pageSize);
  }

  get rangeStart() {
    return this.filteredAccounts.length ? (this.currentPage - 1) * this.pageSize + 1 : 0;
  }

  get rangeEnd() {
    return Math.min(this.currentPage * this.pageSize, this.filteredAccounts.length);
  }

  onSearchChange() { this.currentPage = 1; }
  onFilterChange() { this.currentPage = 1; }

  addNew() {
    this.router.navigate(['/masters/accounts/new']);
  }

  edit(a: any) {
    this.router.navigate(['/masters/accounts', a.id, 'edit']);
  }

  delete(id: number) {
    if (confirm('Delete this account?')) this.api.deleteAccount(id).subscribe(() => this.load());
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) this.currentPage = page;
  }
}
