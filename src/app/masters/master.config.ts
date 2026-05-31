import { AccountNature } from '../models/models';

export interface MasterColumn {
  field: string;
  label: string;
  type?: 'text' | 'status' | 'date' | 'enum';
  enumLabels?: Record<string, string>;
}

export interface MasterFieldOption {
  value: string | number;
  label: string;
}

export interface MasterField {
  name: string;
  label: string;
  type: 'text' | 'checkbox' | 'date' | 'select';
  required?: boolean;
  options?: MasterFieldOption[];
  placeholder?: string;
}

export interface MasterSortOption {
  value: string;
  label: string;
}

export interface MasterPageConfig {
  entity: string;
  title: string;
  singular: string;
  routePath: string;
  columns: MasterColumn[];
  fields: MasterField[];
  searchFields: string[];
  sortOptions: MasterSortOption[];
  defaultSort: string;
  empty: Record<string, unknown>;
}

export const ACCOUNT_NATURE_OPTIONS: MasterFieldOption[] = [
  { value: AccountNature.Asset, label: 'Asset' },
  { value: AccountNature.Liability, label: 'Liability' },
  { value: AccountNature.Income, label: 'Income' },
  { value: AccountNature.Expense, label: 'Expense' }
];

export const ACCOUNT_NATURE_LABELS: Record<string, string> = {
  [AccountNature.Asset]: 'Asset',
  [AccountNature.Liability]: 'Liability',
  [AccountNature.Income]: 'Income',
  [AccountNature.Expense]: 'Expense'
};

export const MASTER_CONFIGS: MasterPageConfig[] = [
  {
    entity: 'currencies',
    title: 'Currencies',
    singular: 'Currency',
    routePath: 'masters/currencies',
    columns: [
      { field: 'code', label: 'Code' },
      { field: 'name', label: 'Name' },
      { field: 'symbol', label: 'Symbol' },
      { field: 'isActive', label: 'Status', type: 'status' }
    ],
    fields: [
      { name: 'code', label: 'Code', type: 'text' },
      { name: 'name', label: 'Name', type: 'text' },
      { name: 'symbol', label: 'Symbol', type: 'text' },
      { name: 'isActive', label: 'Active', type: 'checkbox' }
    ],
    searchFields: ['code', 'name', 'symbol'],
    sortOptions: [
      { value: 'code', label: 'Sort By Code' },
      { value: 'name', label: 'Sort By Name' }
    ],
    defaultSort: 'code',
    empty: { id: 0, code: '', name: '', symbol: '', isActive: true }
  },
  {
    entity: 'account-types',
    title: 'Account Types',
    singular: 'Account Type',
    routePath: 'masters/account-types',
    columns: [
      { field: 'description', label: 'Description' },
      { field: 'natureOfAccount', label: 'Nature Of Account', type: 'enum', enumLabels: ACCOUNT_NATURE_LABELS },
      { field: 'isActive', label: 'Status', type: 'status' }
    ],
    fields: [
      { name: 'description', label: 'Description', type: 'text', required: true },
      {
        name: 'natureOfAccount',
        label: 'Nature Of Account',
        type: 'select',
        required: true,
        placeholder: 'Select Nature Of Account',
        options: ACCOUNT_NATURE_OPTIONS
      },
      { name: 'isActive', label: 'Active', type: 'checkbox' }
    ],
    searchFields: ['description'],
    sortOptions: [
      { value: 'description', label: 'Sort By Description' },
      { value: 'natureOfAccount', label: 'Sort By Nature' }
    ],
    defaultSort: 'description',
    empty: { id: 0, description: '', natureOfAccount: null, isActive: true }
  },
  {
    entity: 'payment-modes',
    title: 'Payment Modes',
    singular: 'Payment Mode',
    routePath: 'masters/payment-modes',
    columns: [
      { field: 'name', label: 'Name' },
      { field: 'isActive', label: 'Status', type: 'status' }
    ],
    fields: [
      { name: 'name', label: 'Name', type: 'text' },
      { name: 'isActive', label: 'Active', type: 'checkbox' }
    ],
    searchFields: ['name'],
    sortOptions: [{ value: 'name', label: 'Sort By Name' }],
    defaultSort: 'name',
    empty: { id: 0, name: '', isActive: true }
  },
  {
    entity: 'frequencies',
    title: 'Frequencies',
    singular: 'Frequency',
    routePath: 'masters/frequencies',
    columns: [
      { field: 'name', label: 'Name' },
      { field: 'isActive', label: 'Status', type: 'status' }
    ],
    fields: [
      { name: 'name', label: 'Name', type: 'text' },
      { name: 'isActive', label: 'Active', type: 'checkbox' }
    ],
    searchFields: ['name'],
    sortOptions: [{ value: 'name', label: 'Sort By Name' }],
    defaultSort: 'name',
    empty: { id: 0, name: '', isActive: true }
  },
  {
    entity: 'loan-types',
    title: 'Loan Types',
    singular: 'Loan Type',
    routePath: 'masters/loan-types',
    columns: [
      { field: 'name', label: 'Name' },
      { field: 'isActive', label: 'Status', type: 'status' }
    ],
    fields: [
      { name: 'name', label: 'Name', type: 'text' },
      { name: 'isActive', label: 'Active', type: 'checkbox' }
    ],
    searchFields: ['name'],
    sortOptions: [{ value: 'name', label: 'Sort By Name' }],
    defaultSort: 'name',
    empty: { id: 0, name: '', isActive: true }
  },
  {
    entity: 'financial-years',
    title: 'Financial Years',
    singular: 'Financial Year',
    routePath: 'masters/financial-years',
    columns: [
      { field: 'name', label: 'Name' },
      { field: 'startDate', label: 'Start Date', type: 'date' },
      { field: 'endDate', label: 'End Date', type: 'date' },
      { field: 'isActive', label: 'Status', type: 'status' }
    ],
    fields: [
      { name: 'name', label: 'Name', type: 'text' },
      { name: 'startDate', label: 'Start Date', type: 'date' },
      { name: 'endDate', label: 'End Date', type: 'date' },
      { name: 'isActive', label: 'Active', type: 'checkbox' }
    ],
    searchFields: ['name'],
    sortOptions: [
      { value: 'name', label: 'Sort By Name' },
      { value: 'startDate', label: 'Sort By Start Date' }
    ],
    defaultSort: 'startDate',
    empty: { id: 0, name: '', startDate: '', endDate: '', isActive: true }
  }
];
