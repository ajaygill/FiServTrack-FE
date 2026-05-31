import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { MasterColumn, MasterPageConfig } from '../master.config';

@Component({ standalone: true, imports: [CommonModule, FormsModule], templateUrl: './master-list.component.html', styleUrl: '../shared/master-page.scss' })
export class MasterListComponent implements OnInit {
  config!: MasterPageConfig;
  items: any[] = [];
  search = '';
  sortBy = 'name';
  statusFilter = 'all';
  pageSize = 10;
  currentPage = 1;

  constructor(private api: ApiService, private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    this.config = this.route.snapshot.data['master'];
    this.sortBy = this.config.defaultSort;
    this.load();
  }

  load() {
    this.api.master(this.config.entity).subscribe(r => {
      this.items = r.map(item => this.normalizeItem(item));
      if (this.currentPage > this.totalPages) this.currentPage = this.totalPages || 1;
    });
  }

  normalizeItem(item: any) {
    const next = { ...item };
    this.config.fields.filter(f => f.type === 'date').forEach(f => {
      if (next[f.name]) next[f.name] = String(next[f.name]).substring(0, 10);
    });
    return next;
  }

  get filteredItems() {
    const q = this.search.trim().toLowerCase();
    let rows = this.items.filter(item => {
      if (this.hasStatus && this.statusFilter === 'active' && !item.isActive) return false;
      if (this.hasStatus && this.statusFilter === 'inactive' && item.isActive) return false;
      if (!q) return true;
      return this.config.searchFields.some(field => String(item[field] || '').toLowerCase().includes(q));
    });

    rows = [...rows].sort((a, b) => String(a[this.sortBy] || '').localeCompare(String(b[this.sortBy] || '')));
    return rows;
  }

  get hasStatus() {
    return this.config.columns.some(c => c.type === 'status');
  }

  get totalPages() {
    return Math.max(1, Math.ceil(this.filteredItems.length / this.pageSize));
  }

  get pagedItems() {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredItems.slice(start, start + this.pageSize);
  }

  get rangeStart() {
    return this.filteredItems.length ? (this.currentPage - 1) * this.pageSize + 1 : 0;
  }

  get rangeEnd() {
    return Math.min(this.currentPage * this.pageSize, this.filteredItems.length);
  }

  get pageNumbers(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  cellValue(row: any, col: MasterColumn) {
    if (col.type === 'enum' && col.enumLabels) {
      const raw = row[col.field];
      if (raw == null || raw === '') return '—';
      const key = String(raw);
      if (col.enumLabels[key]) return col.enumLabels[key];
      const numeric = Number(raw);
      const numericKeys = ['', 'Asset', 'Liability', 'Income', 'Expense'];
      if (numeric >= 1 && numeric <= 4) return col.enumLabels[numericKeys[numeric]] ?? numericKeys[numeric];
      return key;
    }
    return row[col.field] ?? '—';
  }

  onSearchChange() { this.currentPage = 1; }
  onFilterChange() { this.currentPage = 1; }

  addNew() {
    this.router.navigate([this.config.routePath, 'new']);
  }

  edit(row: any) {
    this.router.navigate([this.config.routePath, row.id, 'edit']);
  }

  delete(id: number) {
    if (confirm(`Delete this ${this.config.singular.toLowerCase()}?`)) {
      this.api.deleteMaster(this.config.entity, id).subscribe(() => this.load());
    }
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) this.currentPage = page;
  }
}
