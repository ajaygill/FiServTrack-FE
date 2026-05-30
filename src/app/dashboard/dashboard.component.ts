import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { catchError, finalize, forkJoin, map } from 'rxjs';
import { ApiService } from '../services/api.service';
import { DashboardAnalytics } from '../models/models';

@Component({ standalone: true, imports: [CommonModule], templateUrl: './dashboard.component.html', styleUrl: './dashboard.component.scss' })
export class DashboardComponent implements OnInit {
  loading = true;
  error = '';
  stats = { accounts: 0, activeAccounts: 0, loanAccounts: 0, payments: 0, receipts: 0, netFlow: 0, transactions: 0 };
  accountsByType: { name: string; count: number }[] = [];
  monthlyFlow: { label: string; receipts: number; payments: number }[] = [];
  recentTransactions: any[] = [];

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.api.getDashboardAnalytics().pipe(
      map(data => this.normalize(data)),
      catchError(() => forkJoin({
        accounts: this.api.getAccounts(),
        transactions: this.api.transactions()
      }).pipe(map(({ accounts, transactions }) => this.buildFallback(accounts, transactions)))),
      finalize(() => (this.loading = false))
    ).subscribe({
      next: data => this.apply(data),
      error: () => { this.error = 'Unable to load dashboard analytics. Please refresh the page.'; }
    });
  }

  private normalize(data: DashboardAnalytics): DashboardAnalytics {
    const raw = data as any;
    return {
      stats: data.stats || raw.Stats,
      accountsByType: data.accountsByType || raw.AccountsByType || [],
      monthlyFlow: data.monthlyFlow || raw.MonthlyFlow || [],
      recentTransactions: data.recentTransactions || raw.RecentTransactions || []
    };
  }

  private apply(data: DashboardAnalytics) {
    if (!data?.stats) {
      this.error = 'Unable to load dashboard analytics. Please refresh the page.';
      return;
    }
    this.stats = {
      accounts: data.stats.accounts,
      activeAccounts: data.stats.activeAccounts,
      loanAccounts: data.stats.loanAccounts,
      payments: data.stats.payments,
      receipts: data.stats.receipts,
      netFlow: data.stats.netFlow,
      transactions: data.stats.transactions
    };
    this.accountsByType = data.accountsByType;
    this.monthlyFlow = data.monthlyFlow;
    this.recentTransactions = data.recentTransactions.map(t => ({
      transactionDate: t.transactionDate,
      transactionType: t.transactionType,
      amount: t.amount,
      account: { name: t.accountName },
      paymentMode: { name: t.paymentModeName }
    }));
  }

  private buildFallback(accounts: any[], transactions: any[]): DashboardAnalytics {
    const payments = transactions.filter(t => t.transactionType === 1);
    const receipts = transactions.filter(t => t.transactionType === 2);
    const sum = (items: any[]) => items.reduce((total, t) => total + Number(t.amount || 0), 0);

    const typeMap = new Map<string, number>();
    accounts.forEach(a => {
      const name = a.accountType?.description || 'Other';
      typeMap.set(name, (typeMap.get(name) || 0) + 1);
    });

    const monthMap = new Map<string, { receipts: number; payments: number }>();
    transactions.forEach(t => {
      const label = (t.transactionDate || '').substring(0, 7);
      if (!label) return;
      const row = monthMap.get(label) || { receipts: 0, payments: 0 };
      if (t.transactionType === 2) row.receipts += Number(t.amount || 0);
      else row.payments += Number(t.amount || 0);
      monthMap.set(label, row);
    });

    return {
      stats: {
        accounts: accounts.length,
        activeAccounts: accounts.filter(a => a.isActive).length,
        loanAccounts: accounts.filter(a => a.isLoan).length,
        payments: sum(payments),
        receipts: sum(receipts),
        netFlow: sum(receipts) - sum(payments),
        transactions: transactions.length
      },
      accountsByType: [...typeMap.entries()].map(([name, count]) => ({ name, count })),
      monthlyFlow: [...monthMap.entries()].sort(([a], [b]) => a.localeCompare(b)).slice(-6).map(([label, row]) => ({ label, ...row })),
      recentTransactions: transactions.slice(0, 8).map(t => ({
        transactionDate: t.transactionDate,
        accountName: t.account?.name || '',
        paymentModeName: t.paymentMode?.name || '',
        transactionType: t.transactionType,
        amount: t.amount
      }))
    };
  }

  typeLabel(type: number) { return type === 2 ? 'Receipt' : 'Payment'; }
  barWidth(value: number) {
    const max = Math.max(...this.monthlyFlow.map(m => Math.max(m.receipts, m.payments)), 1);
    return `${Math.round((value / max) * 100)}%`;
  }
}
