import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { MasterPageConfig } from '../master.config';

@Component({ standalone: true, imports: [CommonModule, FormsModule, RouterLink], templateUrl: './master-form.component.html', styleUrl: '../shared/master-page.scss' })
export class MasterFormComponent implements OnInit {
  config!: MasterPageConfig;
  form: Record<string, any> = {};
  fieldErrors: Record<string, string> = {};
  saveError = '';
  isEdit = false;

  constructor(private api: ApiService, private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    this.config = this.route.snapshot.data['master'];
    this.form = { ...this.config.empty };

    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.isEdit = true;
      this.api.master(this.config.entity).subscribe(items => {
        const item = items.find(x => x.id === id);
        if (item) this.form = this.normalizeItem({ ...this.config.empty, ...item });
      });
    }
  }

  normalizeItem(item: any) {
    const next = { ...item };
    this.config.fields.filter(f => f.type === 'date').forEach(f => {
      if (next[f.name]) next[f.name] = String(next[f.name]).substring(0, 10);
    });
    this.config.fields.filter(f => f.type === 'select').forEach(f => {
      if (next[f.name] != null && typeof next[f.name] === 'number') {
        const labels = ['', 'Asset', 'Liability', 'Income', 'Expense'];
        next[f.name] = labels[next[f.name]] ?? next[f.name];
      }
    });
    return next;
  }

  clearFieldError(field: string) {
    if (!this.fieldErrors[field]) return;
    const { [field]: _, ...rest } = this.fieldErrors;
    this.fieldErrors = rest;
  }

  onSelectChange(field: string, value: string | number | null) {
    this.form[field] = value ?? null;
    this.clearFieldError(field);
  }

  validate(): boolean {
    const errors: Record<string, string> = {};
    this.config.fields.forEach(field => {
      if (!field.required) return;
      const value = this.form[field.name];
      if (field.type === 'select') {
        if (value == null || value === '') errors[field.name] = `Please select ${field.label.toLowerCase()}.`;
      } else if (field.type === 'checkbox') {
        return;
      } else if (!String(value ?? '').trim()) {
        errors[field.name] = `${field.label} is required.`;
      }
    });
    this.fieldErrors = errors;
    return Object.keys(errors).length === 0;
  }

  save() {
    if (!this.validate()) return;
    this.saveError = '';
    this.api.saveMaster(this.config.entity, this.form).subscribe({
      next: () => this.router.navigate(['/' + this.config.routePath]),
      error: e => { this.saveError = e?.error?.error || 'Unable to save.'; }
    });
  }

  cancel() {
    this.router.navigate(['/' + this.config.routePath]);
  }
}
