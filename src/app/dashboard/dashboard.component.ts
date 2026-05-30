import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import { ApiService } from '../services/api.service';

@Component({ standalone: true, imports: [CommonModule], templateUrl: './dashboard.component.html', styleUrl: './dashboard.component.scss' })
export class DashboardComponent implements OnInit {
  loading = true;
  stats = { accounts: 0, activeAccounts: 0, loanAccounts: 0, payments: 0, receipts: 0, netFlow: 0, transactions: 0 };
  accountsByType: { name: string; count: number }[] = [];
  monthlyFlow: { label: string; receipts: number; payments: number }[] = [];
  recentTransactions: any[] = [];

  constructor(private api: ApiService) {}

  ngOnInit() {
    forkJoin({ accounts: this.api.getAccounts(), transactions: this.api.transactions() }).subscribe({
      next: ({ accounts, transactions }) => this.build(accounts, transactions),
      complete: () => (this.loading = false)
    });
  }

  private build(accounts: any[], transactions: any[]) {
    const payments = transactions.filter(t => t.transactionType === 1);
    const receipts = transactions.filter(t => t.transactionType === 2);
    const sum = (items: any[]) => items.reduce((total, t) => total + Number(t.amount || 0), 0);

    this.stats = {
      accounts: accounts.length,
      activeAccounts: accounts.filter(a => a.isActive).length,
      loanAccounts: accounts.filter(a => a.isLoan).length,
      payments: sum(payments),
      receipts: sum(receipts),
      netFlow: sum(receipts) - sum(payments),
      transactions: transactions.length
    };

    const typeMap = new Map<string, number>();
    accounts.forEach(a => {
      const name = a.accountType?.name || 'Other';
      typeMap.set(name, (typeMap.get(name) || 0) + 1);
    });
    this.accountsByType = [...typeMap.entries()].map(([name, count]) => ({ name, count }));

    const monthMap = new Map<string, { receipts: number; payments: number }>();
    transactions.forEach(t => {
      const label = (t.transactionDate || '').substring(0, 7);
      if (!label) return;
      const row = monthMap.get(label) || { receipts: 0, payments: 0 };
      if (t.transactionType === 2) row.receipts += Number(t.amount || 0);
      else row.payments += Number(t.amount || 0);
      monthMap.set(label, row);
    });
    this.monthlyFlow = [...monthMap.entries()]
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-6)
      .map(([label, row]) => ({ label, ...row }));

    this.recentTransactions = transactions.slice(0, 8);
  }

  typeLabel(type: number) { return type === 2 ? 'Receipt' : 'Payment'; }
  barWidth(value: number) {
    const max = Math.max(...this.monthlyFlow.map(m => Math.max(m.receipts, m.payments)), 1);
    return `${Math.round((value / max) * 100)}%`;
  }
}
