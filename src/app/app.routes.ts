import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { LayoutComponent } from './layout/layout.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AccountListComponent } from './accounts/account-list/account-list.component';
import { AccountFormComponent } from './accounts/account-form/account-form.component';
import { TransactionFormComponent } from './daily-jobs/transaction-form/transaction-form.component';
import { MasterListComponent } from './masters/master-list/master-list.component';
import { MasterFormComponent } from './masters/master-form/master-form.component';
import { MASTER_CONFIGS } from './masters/master.config';
import { authGuard } from './core/guards/auth.guard';

const masterDataRoutes: Routes = MASTER_CONFIGS.flatMap(config => [
  { path: config.routePath, component: MasterListComponent, data: { master: config } },
  { path: `${config.routePath}/new`, component: MasterFormComponent, data: { master: config } },
  { path: `${config.routePath}/:id/edit`, component: MasterFormComponent, data: { master: config } }
]);

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: '', component: LayoutComponent, canActivate: [authGuard], children: [
    { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    { path: 'dashboard', component: DashboardComponent },
    { path: 'accounts', redirectTo: 'masters/accounts', pathMatch: 'full' },
    { path: 'masters', redirectTo: 'masters/accounts', pathMatch: 'full' },
    { path: 'masters/accounts', component: AccountListComponent },
    { path: 'masters/accounts/new', component: AccountFormComponent },
    { path: 'masters/accounts/:id/edit', component: AccountFormComponent },
    ...masterDataRoutes,
    { path: 'daily-jobs/payment', component: TransactionFormComponent, data: { type: 'payment' } },
    { path: 'daily-jobs/receipt', component: TransactionFormComponent, data: { type: 'receipt' } }
  ]},
  { path: '**', redirectTo: '' }
];
