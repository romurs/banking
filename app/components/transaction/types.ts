export interface TransactionAccountSummary {
  id: number;
  accountNumberLastFour: string;
  cardLastFour: string;
  balance: number;
  currency: string;
}

export interface TransactionDetail {
  id: number;
  amount: number;
  rawType: string;
  type: string;
  description: string | null;
  counterparty: string;
  accountId: number;
  date: string;
  dateTime: string;
  mccCode: string | null;
  account: TransactionAccountSummary;
}
