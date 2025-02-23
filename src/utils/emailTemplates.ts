interface CommissionEmailData {
  employeeName: string;
  taskTitle: string;
  commissionAmount: number;
  commissionType: 'task_completion' | 'po_completion';
  totalEarned: number;
}

interface PayrollEmailData {
  employeeName: string;
  periodStart: string;
  periodEnd: string;
  baseSalary: number;
  commissionAmount: number;
  totalAmount: number;
}

export const generateCommissionEmail = ({
  employeeName,
  taskTitle,
  commissionAmount,
  commissionType,
  totalEarned,
}: CommissionEmailData) => {
  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);

  return {
    subject: `Commission Earned: ${formatCurrency(commissionAmount)}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Congratulations ${employeeName}!</h2>
        <p>You've earned a commission for completing the following task:</p>
        <div style="background-color: #f3f4f6; padding: 16px; border-radius: 8px; margin: 16px 0;">
          <h3 style="margin: 0 0 8px 0;">${taskTitle}</h3>
          <p style="margin: 0; color: #4b5563;">
            Commission Type: ${commissionType === 'po_completion' ? 'Purchase Order' : 'Task'} Completion
          </p>
          <p style="margin: 8px 0 0 0; font-size: 18px; font-weight: bold; color: #059669;">
            Amount: ${formatCurrency(commissionAmount)}
          </p>
        </div>
        <p style="color: #4b5563;">
          Total commissions earned this period: ${formatCurrency(totalEarned)}
        </p>
        <p style="margin-top: 24px;">
          Keep up the great work!
        </p>
      </div>
    `,
  };
};

export const generatePayrollEmail = ({
  employeeName,
  periodStart,
  periodEnd,
  baseSalary,
  commissionAmount,
  totalAmount,
}: PayrollEmailData) => {
  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);

  return {
    subject: `Payroll Statement: ${new Date(periodStart).toLocaleDateString()} - ${new Date(periodEnd).toLocaleDateString()}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Payroll Statement</h2>
        <p>Dear ${employeeName},</p>
        <p>Here's your payroll statement for the period:</p>
        <p>${new Date(periodStart).toLocaleDateString()} - ${new Date(periodEnd).toLocaleDateString()}</p>
        
        <div style="background-color: #f3f4f6; padding: 16px; border-radius: 8px; margin: 16px 0;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
            <span>Base Salary:</span>
            <span>${formatCurrency(baseSalary)}</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
            <span>Commission:</span>
            <span>${formatCurrency(commissionAmount)}</span>
          </div>
          <hr style="border: 0; border-top: 1px solid #d1d5db; margin: 8px 0;" />
          <div style="display: flex; justify-content: space-between; font-weight: bold;">
            <span>Total:</span>
            <span>${formatCurrency(totalAmount)}</span>
          </div>
        </div>
        
        <p style="color: #4b5563;">
          Payment will be processed according to your selected payment method.
        </p>
      </div>
    `,
  };
}; 