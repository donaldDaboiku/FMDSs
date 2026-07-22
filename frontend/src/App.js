import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard.jsx';
import Clients from './pages/Clients';
import Orders from './pages/Orders.js';
import Inventory from './pages/Inventory.jsx';
import Settings from './pages/Settings.jsx';
import Designs from './pages/Designs.js';   
import Appointments from './pages/Appointment.jsx.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { SettingsProvider } from './context/SettingsContext.jsx';
import AdminDashboard from './components/AdminDashboard.jsx';
import UserManagement from './components/UserManagement.jsx';
import AnalyticsPage from './components/AnalyticsPage.jsx';
import SystemSettings from './components/SystemSettings.jsx';

//Simple auth check
// const isAuthenticated = () => {
//   return localStorage.getItem('token');
// };
// Protected route component
// const ProtectedRoute = ({ children }) => {
//   if (!isAuthenticated()) {
//     window.location.href = '/';
//     return null;
//   }
//   return children;
// };

function App() {
  return (
    <AuthProvider>
      <SettingsProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/designs" element={<ProtectedRoute><Designs /></ProtectedRoute>} />
            <Route path="/inventory" element={<ProtectedRoute><Inventory /></ProtectedRoute>} />
            <Route path="/clients" element={<ProtectedRoute><Clients /></ProtectedRoute>} />
            <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
            <Route path="/appointments" element={<ProtectedRoute><Appointments /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
            <Route path="/admin" element={<ProtectedRoute requireAdmin><AdminDashboard /></ProtectedRoute>} />
            <Route path="/admin/users" element={<ProtectedRoute requireAdmin><UserManagement /></ProtectedRoute>} />
            <Route path="/admin/analytics" element={<ProtectedRoute requireAdmin><AnalyticsPage /></ProtectedRoute>} />
            <Route path="/admin/system-settings" element={<ProtectedRoute requireAdmin><SystemSettings /></ProtectedRoute>} />
          </Routes>
        </BrowserRouter>
      </SettingsProvider>
    </AuthProvider>
  );
}
export default App;