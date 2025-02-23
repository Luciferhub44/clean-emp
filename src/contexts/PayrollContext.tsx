import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { PayrollSettings, EmployeePayroll, CommissionRecord, PayrollStats } from '@/types';
import ApiService from '@/services/api';

interface PayrollContextType {
  settings: PayrollSettings | null;
  payrolls: EmployeePayroll[];
  commissions: CommissionRecord[];
  stats: PayrollStats | null;
  poCommissions: CommissionRecord[];
  loading: boolean;
  error: string | null;
  refreshPayrollData: () => Promise<void>;
}

const PayrollContext = createContext<PayrollContextType | undefined>(undefined);

export function PayrollProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<PayrollSettings | null>(null);
  const [payrolls, setPayrolls] = useState<EmployeePayroll[]>([]);
  const [commissions, setCommissions] = useState<CommissionRecord[]>([]);
  const [stats, setStats] = useState<PayrollStats | null>(null);
  const [poCommissions, setPoCommissions] = useState<CommissionRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPayrollData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [settingsRes, payrollsRes, commissionsRes, statsRes, poCommissionsRes] = await Promise.all([
        ApiService.get<PayrollSettings>('/payroll/settings'),
        ApiService.get<EmployeePayroll[]>('/employee/payroll'),
        ApiService.get<CommissionRecord[]>('/employee/commissions'),
        ApiService.get<PayrollStats>('/employee/payroll/stats'),
        ApiService.get<CommissionRecord[]>('/employee/commissions/po'),
      ]);

      setSettings(settingsRes.data);
      setPayrolls(payrollsRes.data);
      setCommissions(commissionsRes.data);
      setStats(statsRes.data);
      setPoCommissions(poCommissionsRes.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch payroll data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayrollData();
  }, []);

  return (
    <PayrollContext.Provider
      value={{
        settings,
        payrolls,
        commissions,
        stats,
        poCommissions,
        loading,
        error,
        refreshPayrollData: fetchPayrollData,
      }}
    >
      {children}
    </PayrollContext.Provider>
  );
}

export function usePayroll() {
  const context = useContext(PayrollContext);
  if (context === undefined) {
    throw new Error('usePayroll must be used within a PayrollProvider');
  }
  return context;
} 