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