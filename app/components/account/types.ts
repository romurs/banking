export interface AccountTransaction {
  id: number;
  amount: number;
  type: string;
  typeLabel: string;
  counterparty: string;
  description: string | null;
  date: string;
  accountId: number;
}

export interface AccountDetail {
  id: number;
  accountNumberLastFour: string;
  cardLastFour: string | null;
  balance: number;
  currency: string;
  type: string;
  isActive: boolean;
  transactions: AccountTransaction[];
}
