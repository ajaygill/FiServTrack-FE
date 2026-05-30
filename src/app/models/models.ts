export enum LoanRepaymentType { Installment = 1, InterestOnly = 2 }
export enum AccountNature { Asset = 'Asset', Liability = 'Liability', Income = 'Income', Expense = 'Expense' }
export interface AccountTypeMaster { id:number; description:string; natureOfAccount:AccountNature; isActive:boolean; }
export interface Account { id:number; name:string; groupId?:number|null; frequencyId?:number|null; trackingDate?:string; paymentDay?:number; accountTypeId?:number|null; isLoan:boolean; loanTypeId?:number|null; loanRepaymentType?:LoanRepaymentType|null; openingBalance:number; installmentAmount?:number; noOfInstallments?:number; fixedAmount?:number; currencyId?:number|null; budgetAmount?:number; parentAccountId?:number; associateAccountId?:number; isActive:boolean; planBudget:boolean; setAlerts:boolean; }
export interface Transaction { accountId:number; paymentModeId:number; amount:number; currencyId:number; transactionDate:string; description?:string; referenceNo?:string; }
export interface NamedMaster { id:number; name:string; isActive:boolean; }
export interface Currency { id:number; code:string; name:string; symbol:string; isActive:boolean; }
export interface FinancialYear { id:number; name:string; startDate:string; endDate:string; isActive:boolean; }
export interface DashboardAnalytics {
  stats: { accounts:number; activeAccounts:number; loanAccounts:number; payments:number; receipts:number; netFlow:number; transactions:number; };
  accountsByType: { name:string; count:number; }[];
  monthlyFlow: { label:string; receipts:number; payments:number; }[];
  recentTransactions: { transactionDate:string; accountName:string; paymentModeName:string; transactionType:number; amount:number; }[];
}
