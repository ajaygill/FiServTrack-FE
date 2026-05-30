import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { LayoutComponent } from './layout/layout.component';
import { AccountListComponent } from './accounts/account-list/account-list.component';
import { TransactionFormComponent } from './daily-jobs/transaction-form/transaction-form.component';
import { SimpleMasterListComponent } from './masters/simple-master-list/simple-master-list.component';
import { CurrencyListComponent } from './masters/currency-list/currency-list.component';
import { FinancialYearListComponent } from './masters/financial-year-list/financial-year-list.component';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: '', component: LayoutComponent, canActivate: [authGuard], children: [
    { path: '', redirectTo: 'masters/accounts', pathMatch: 'full' },
    { path: 'accounts', redirectTo: 'masters/accounts', pathMatch: 'full' },
    { path: 'masters', redirectTo: 'masters/accounts', pathMatch: 'full' },
    { path: 'masters/accounts', component: AccountListComponent },
    { path: 'masters/currencies', component: CurrencyListComponent },
    { path: 'masters/account-types', component: SimpleMasterListComponent, data: { entity: 'account-types', title: 'Account Types' } },
    { path: 'masters/payment-modes', component: SimpleMasterListComponent, data: { entity: 'payment-modes', title: 'Payment Modes' } },
    { path: 'masters/frequencies', component: SimpleMasterListComponent, data: { entity: 'frequencies', title: 'Frequencies' } },
    { path: 'masters/loan-types', component: SimpleMasterListComponent, data: { entity: 'loan-types', title: 'Loan Types' } },
    { path: 'masters/financial-years', component: FinancialYearListComponent },
    { path: 'daily-jobs/payment', component: TransactionFormComponent, data: { type: 'payment' } },
    { path: 'daily-jobs/receipt', component: TransactionFormComponent, data: { type: 'receipt' } }
  ]},
  { path: '**', redirectTo: '' }
];
