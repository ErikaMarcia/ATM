export type OperationType = "deposit" | "withdraw";

export interface HistoryItem {
  type: OperationType;
  value: number;
  date: string;
}

export interface UserAccount {
  balance: number;
  history: HistoryItem[];
}
