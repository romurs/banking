export interface PaymentAccount {
  id: number;
  accountNumber: string;
  cardLastFour: string | null;
  type: string;
  balance: number;
  currency: string;
  isActive: boolean;
}

export interface RecentRecipient {
  name: string;
  initials: string;
  recipient: string;
  accountLastFour: string;
  cardLastFour: string | null;
  lastAmount: number;
  lastTransferDate: string;
  transfersCount: number;
}
