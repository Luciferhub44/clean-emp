import ApiService from './api';
import { generateCommissionEmail, generatePayrollEmail } from '@/utils/emailTemplates';

export const EmailService = {
  async sendCommissionNotification(data: {
    employeeId: number;
    employeeName: string;
    taskTitle: string;
    commissionAmount: number;
    commissionType: 'task_completion' | 'po_completion';
    totalEarned: number;
  }) {
    const emailContent = generateCommissionEmail({
      employeeName: data.employeeName,
      taskTitle: data.taskTitle,
      commissionAmount: data.commissionAmount,
      commissionType: data.commissionType,
      totalEarned: data.totalEarned,
    });

    return ApiService.post('/notifications/email', {
      to: data.employeeId,
      subject: emailContent.subject,
      html: emailContent.html,
    });
  },

  async sendPayrollNotification(data: {
    employeeId: number;
    employeeName: string;
    periodStart: string;
    periodEnd: string;
    baseSalary: number;
    commissionAmount: number;
    totalAmount: number;
  }) {
    const emailContent = generatePayrollEmail({
      employeeName: data.employeeName,
      periodStart: data.periodStart,
      periodEnd: data.periodEnd,
      baseSalary: data.baseSalary,
      commissionAmount: data.commissionAmount,
      totalAmount: data.totalAmount,
    });

    return ApiService.post('/notifications/email', {
      to: data.employeeId,
      subject: emailContent.subject,
      html: emailContent.html,
    });
  },
}; 