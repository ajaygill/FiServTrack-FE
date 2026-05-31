import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { Account, LoanRepaymentType } from '../../models/models';

@Component({ standalone: true, imports: [CommonModule, FormsModule, RouterLink], templateUrl: './account-form.component.html', styleUrl: './account-form.component.scss' })
export class AccountFormComponent implements OnInit {
  form: Account = this.empty();
  currencies: any[] = [];
  accountTypes: any[] = [];
  accountGroups: any[] = [];
  frequencies: any[] = [];
  loanTypes: any[] = [];
  accounts: Account[] = [];
  selectableAccounts: Account[] = [];
  loanRepaymentTypes = [
    { value: LoanRepaymentType.Installment, label: 'Installment (Reducing Principal)' },
    { value: LoanRepaymentType.InterestOnly, label: 'Interest Only (Principal Unchanged)' }
  ];
  LoanRepaymentType = LoanRepaymentType;
  isEdit = false;
  fieldErrors: Record<string, string> = {};
  saveError = '';

  constructor(private api: ApiService, private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    ['currencies', 'account-types', 'account-groups', 'frequencies', 'loan-types'].forEach(x =>
      this.api.master(x).subscribe((r: any) => { (this as any)[x.replace(/-([a-z])/g, (_, c) => c.toUpperCase())] = r; })
    );
    this.api.getAccounts().subscribe(r => {
      this.accounts = r;
      this.refreshSelectableAccounts();
    });

    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.isEdit = true;
      this.api.getAccount(id).subscribe(a => {
        this.form = { ...this.empty(), ...a };
        if (this.form.loanRepaymentType != null) {
          this.form.loanRepaymentType = Number(this.form.loanRepaymentType) as LoanRepaymentType;
        }
        if (!this.form.isLoan) this.clearLoanFields();
        this.refreshSelectableAccounts();
      });
    }
  }

  refreshSelectableAccounts() {
    this.selectableAccounts = this.accounts.filter(a => a.id !== this.form.id);
  }

  empty(): Account {
    return {
      id: 0,
      name: '',
      groupId: null,
      frequencyId: null,
      accountTypeId: null,
      currencyId: null,
      isLoan: false,
      loanTypeId: null,
      loanRepaymentType: null,
      openingBalance: 0,
      parentAccountId: null,
      associateAccountId: null,
      isActive: true,
      planBudget: false,
      setAlerts: false
    };
  }

  private isValidSelect(value: number | null | undefined): boolean {
    return value != null && Number(value) > 0;
  }

  clearFieldError(field: string) {
    if (!this.fieldErrors[field]) return;
    const { [field]: _, ...rest } = this.fieldErrors;
    this.fieldErrors = rest;
  }

  validate(): boolean {
    const errors: Record<string, string> = {};

    if (!this.form.name?.trim()) errors['name'] = 'Name is required.';
    if (!this.isValidSelect(this.form.accountTypeId)) errors['accountTypeId'] = 'Please select an account type.';
    if (this.form.isLoan && !this.isValidSelect(this.form.loanTypeId)) errors['loanTypeId'] = 'Please select a loan type.';
    if (this.form.isLoan && (this.form.loanRepaymentType == null || Number(this.form.loanRepaymentType) <= 0)) {
      errors['loanRepaymentType'] = 'Please select a loan repayment type.';
    }

    this.fieldErrors = errors;
    return Object.keys(errors).length === 0;
  }

  save() {
    if (!this.form.isLoan) this.clearLoanFields();
    else if (this.isInterestOnlyLoan()) this.form.noOfInstallments = undefined;
    if (!this.form.currencyId) this.form.currencyId = 1;
    if (!this.validate()) return;
    this.saveError = '';
    this.api.saveAccount(this.form).subscribe({
      next: () => this.router.navigate(['/masters/accounts']),
      error: e => { this.saveError = e?.error?.error || 'Unable to save account.'; }
    });
  }

  cancel() {
    this.router.navigate(['/masters/accounts']);
  }

  onLoanChange(isLoan: boolean) {
    this.clearFieldError('loanTypeId');
    this.clearFieldError('loanRepaymentType');
    if (!isLoan) this.clearLoanFields();
    else {
      this.form.loanTypeId = null;
      this.form.loanRepaymentType = null;
      this.form.installmentAmount = undefined;
      this.form.noOfInstallments = undefined;
    }
  }

  onRepaymentTypeChange(type: LoanRepaymentType | null) {
    this.clearFieldError('loanRepaymentType');
    this.form.loanRepaymentType = type != null ? Number(type) as LoanRepaymentType : null;
    if (this.isInterestOnlyLoan()) this.form.noOfInstallments = undefined;
  }

  clearLoanFields() {
    this.form.loanTypeId = null;
    this.form.loanRepaymentType = null;
    this.form.installmentAmount = undefined;
    this.form.noOfInstallments = undefined;
  }

  isInstallmentLoan(): boolean {
    return this.form.isLoan && Number(this.form.loanRepaymentType) === LoanRepaymentType.Installment;
  }

  isInterestOnlyLoan(): boolean {
    return this.form.isLoan && Number(this.form.loanRepaymentType) === LoanRepaymentType.InterestOnly;
  }
}
