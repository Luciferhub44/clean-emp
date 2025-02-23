import { useAuth } from '@/hooks/useAuth';
import PayrollDashboard from '@/components/PayrollDashboard';
import PayrollAdmin from '@/components/PayrollAdmin';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function PayrollPage() {
  const { user, loading } = useAuth();

  if (loading) return <LoadingSpinner />;
  if (!user) return null;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">Payroll Management</h1>
      {user.user_type === 'admin' ? <PayrollAdmin /> : <PayrollDashboard />}
    </div>
  );
} 