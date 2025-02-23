import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
  userType: 'employee' | 'admin';
}

export default function ProtectedRoute({ children, userType }: ProtectedRouteProps) {
  const token = localStorage.getItem('token');
  const storedUserType = localStorage.getItem('userType');

  if (!token || storedUserType !== userType) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
} 