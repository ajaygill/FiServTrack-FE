export interface Account { id:number; name:string; groupId?:number; frequencyId?:number; trackingDate?:string; paymentDay?:number; accountTypeId:number; isLoan:boolean; loanTypeId?:number; openingBalance:number; installmentAmount?:number; noOfInstallments?:number; fixedAmount?:number; currencyId:number; budgetAmount?:number; parentAccountId?:number; associateAccountId?:number; isActive:boolean; planBudget:boolean; setAlerts:boolean; }
export interface Transaction { accountId:number; paymentModeId:number; amount:number; currencyId:number; transactionDate:string; description?:string; referenceNo?:string; }
export interface NamedMaster { id:number; name:string; isActive:boolean; }
export interface Currency { id:number; code:string; name:string; symbol:string; isActive:boolean; }
export interface FinancialYear { id:number; name:string; startDate:string; endDate:string; isActive:boolean; }
