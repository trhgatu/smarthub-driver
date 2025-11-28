
import React, { useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { GlobalProvider, useGlobalState } from './context/GlobalState';
import { SplashScreen, LoginScreen, RegisterScreen } from './screens/AuthScreens';
import { DashboardScreen, HistoryScreen, OrderDetailScreen, CompletedOrderScreen } from './screens/DashboardScreens';
import { ProfileScreen, CarrierScreen } from './screens/ProfileScreens';
import { LayoutGrid, Clock, User, CheckCircle2 } from 'lucide-react';

// Bottom Navigation Component
const BottomNav: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const tabs = [
    { path: '/app/dashboard', icon: LayoutGrid, label: 'Đơn hàng' },
    { path: '/app/completed', icon: CheckCircle2, label: 'Hoàn tất' },
    { path: '/app/history', icon: Clock, label: 'Lịch sử' },
    { path: '/app/profile', icon: User, label: 'Tài khoản' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-center pointer-events-none">
       {/* Removed shadow, added top border for flat design */}
       <div className="w-full max-w-md bg-white dark:bg-slate-900 border-t border-gray-200 dark:border-slate-800 py-2 px-2 flex justify-between items-center pointer-events-auto transition-colors">
        {tabs.map((tab) => {
          const isActive = location.pathname.startsWith(tab.path);
          return (
            <button 
              key={tab.path}
              onClick={() => navigate(tab.path)}
              className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all duration-200 flex-1 ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400 dark:text-slate-500 hover:text-gray-600 dark:hover:text-slate-300'}`}
            >
              <tab.icon size={24} strokeWidth={isActive ? 2.5 : 2} />
              <span className={`text-[10px] font-medium ${isActive ? 'opacity-100' : 'opacity-80'}`}>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

// Protected Route Wrapper
const ProtectedRoute = ({ children }: { children?: React.ReactNode }) => {
  const { isAuthenticated } = useGlobalState();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return <>{children}</>;
};

// Layout with Bottom Nav
const MainLayout = ({ children }: { children?: React.ReactNode }) => (
  // Updated bg-slate-100 for better contrast
  <div className="w-full max-w-md mx-auto bg-slate-100 dark:bg-slate-950 min-h-screen relative transition-colors">
    <div className="pb-20">
       {children}
    </div>
    <BottomNav />
  </div>
);

// Container for Auth Screens (Full width mobile)
const AuthLayout = ({ children }: { children?: React.ReactNode }) => (
  <div className="w-full max-w-md mx-auto bg-white dark:bg-slate-950 min-h-screen relative transition-colors">
    {children}
  </div>
);

function AppContent() {
  return (
    <Routes>
      <Route path="/" element={<AuthLayout><SplashScreen /></AuthLayout>} />
      <Route path="/login" element={<AuthLayout><LoginScreen /></AuthLayout>} />
      <Route path="/register" element={<AuthLayout><RegisterScreen /></AuthLayout>} />
      
      {/* Protected App Routes */}
      <Route path="/app/*" element={
        <ProtectedRoute>
          <MainLayout>
            <Routes>
              <Route path="dashboard" element={<DashboardScreen />} />
              <Route path="completed" element={<CompletedOrderScreen />} />
              <Route path="history" element={<HistoryScreen />} />
              <Route path="profile" element={<ProfileScreen />} />
              <Route path="order/:id" element={<OrderDetailScreen />} />
              <Route path="vehicles" element={<CarrierScreen />} />
              <Route path="*" element={<Navigate to="dashboard" />} />
            </Routes>
          </MainLayout>
        </ProtectedRoute>
      } />
      
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default function App() {
  return (
    <GlobalProvider>
      <HashRouter>
        <AppContent />
      </HashRouter>
    </GlobalProvider>
  );
}
