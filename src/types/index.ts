export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  user_type: 'employee' | 'admin';
}

export interface Task {
  id: number;
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  due_date: string;
  assigned_to: number;
  assigned_by: number;
  purchase_order?: PurchaseOrder;
  employee_response?: 'accepted' | 'rejected';
  response_notes?: string;
}

export interface TaskComment {
  id: number;
  task_id: number;
  user_id: number;
  comment: string;
  created_at: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface PurchaseOrder {
  id: number;
  order_number: string;
  vendor: string;
  total_amount: number;
  status: 'pending' | 'approved' | 'rejected';
  items: PurchaseOrderItem[];
  created_at: string;
  updated_at: string;
  notes?: string;
}

export interface PurchaseOrderItem {
  id: number;
  po_id: number;
  description: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}

export interface PayrollSettings {
  id: number;
  base_salary: number;
  commission_rate: number;
  po_commission_rate: number;
  pay_period: string;
  created_at: string;
  updated_at: string;
}

export interface EmployeePayroll {
  id: number;
  employee_id: number;
  period_start: string;
  period_end: string;
  base_salary: number;
  commission_amount: number;
  total_amount: number;
  status: 'pending' | 'processed' | 'paid';
  payment_date: string | null;
  created_at: string;
  updated_at: string;
}

export interface CommissionRecord {
  id: number;
  employee_id: number;
  task_id: number;
  payroll_id: number;
  amount: number;
  commission_type: 'task_completion' | 'po_completion';
  created_at: string;
}

export interface EmployeeData {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
}

export interface PayrollStats {
  totalCommission: number;
  completedTasks: number;
  pendingPayments: number;
} 