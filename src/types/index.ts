export interface Expense {
  id: string;
  amount: number;
  category: string;
  description: string;
  date: string;
  created_at?: string;
}
export interface Bill {
  id: string;
  amount: number;
  description: string;
  due_date: string;
  payment_date?: string;
  status: 'pending' | 'paid' | 'overdue';
  recurrent: boolean;
  recurrence_period?: string;
  created_at?: string;
}
export interface Income {
  id: string;
  amount: number;
  source: string;
  description: string;
  date: string;
  created_at?: string;
}
export interface Category {
  id: string;
  name: string;
  color: string;
}
export interface MonthSummary {
  month: string;
  totalExpenses: number;
  totalIncome: number;
  totalBills: number;
}
export interface Budget {
  id: string;
  month: string;
  year: number;
  amount: number;
  created_at?: string;
}
export interface UserSettings {
  id: string;
  user_id: string;
  theme: 'light' | 'dark';
  default_view: 'cards' | 'table' | 'calendar';
  notifications_enabled: boolean;
  created_at?: string;
  updated_at?: string;
}
export type MonthData = {
  month: number;
  year: number;
  label: string;
};
export type ViewMode = 'cards' | 'table' | 'calendar';