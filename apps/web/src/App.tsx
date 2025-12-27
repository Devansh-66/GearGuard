import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Dashboard } from '@/pages/Dashboard';
import { Equipment } from '@/pages/Equipment';
import { Maintenance } from '@/pages/Maintenance';
import { CalendarPage } from '@/pages/CalendarPage';
import { Reports } from '@/pages/Reports';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { Login } from '@/pages/Login';
import { Signup } from '@/pages/Signup';
import { ForgotPassword } from '@/pages/ForgotPassword';
import { Teams } from '@/pages/Teams';
import { EquipmentCategories } from '@/pages/EquipmentCategories';
import { Navigate, Outlet } from 'react-router-dom';

function ProtectedRoute() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return <Outlet />;
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route element={<ProtectedRoute />}>
             <Route path="/" element={<Layout />}>
              <Route index element={<Dashboard />} />
              <Route path="equipment" element={<EquipmentCategories />} />
              <Route path="equipment/list" element={<Equipment />} />
              <Route path="maintenance" element={<Maintenance />} />
              <Route path="teams" element={<Teams />} />
              <Route path="reports" element={<Reports />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
