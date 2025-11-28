
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Driver, Order, Vehicle, Remooc, OrderStatus, Carrier } from '../types';
import { createMockOrders, initialVehicles, initialRemoocs, defaultDriver, mockCarrier } from '../services/mockFactory';

interface GlobalStateContextType {
  isAuthenticated: boolean;
  driver: Driver | null;
  carrier: Carrier | null;
  orders: Order[];
  vehicles: Vehicle[];
  remoocs: Remooc[];
  isDarkMode: boolean;
  login: (phone: string, passOrOtp: string, type: 'password' | 'otp') => Promise<boolean>;
  logout: () => void;
  register: (newDriver: Partial<Driver>) => Promise<void>;
  updateProfile: (data: Partial<Driver>) => void;
  toggleAsset: (id: string, type: 'vehicle' | 'remooc') => void;
  toggleTheme: () => void;
  updateOrderStatus: (orderId: string, status: OrderStatus, data?: Partial<Order>) => void;
}

const GlobalStateContext = createContext<GlobalStateContextType | undefined>(undefined);

export const GlobalProvider = ({ children }: { children?: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [driver, setDriver] = useState<Driver | null>(null);
  const [carrier, setCarrier] = useState<Carrier | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [remoocs, setRemoocs] = useState<Remooc[]>([]);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Initialize Data & Theme
  useEffect(() => {
    // Generate initial data
    const active = createMockOrders(3, 'active');
    const completed = createMockOrders(10, 'completed');
    setOrders([...active, ...completed]);
    setVehicles(initialVehicles);
    setRemoocs(initialRemoocs);
    setCarrier(mockCarrier);

    // Check local storage or system preference for theme (Mock behavior)
    // Defaulting to false (light) for now
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(prev => !prev);
  };

  const login = async (phone: string, passOrOtp: string, type: 'password' | 'otp'): Promise<boolean> => {
    // Simulate API Delay
    await new Promise(resolve => setTimeout(resolve, 800));

    if (type === 'otp') {
       // Mock OTP Rule: OTP is always 123456
       if (passOrOtp === '123456') {
         setDriver({ ...defaultDriver, phone });
         setIsAuthenticated(true);
         return true;
       }
    } else {
       // Mock Password Rule
       if (phone === defaultDriver.phone && passOrOtp === defaultDriver.password) {
         setDriver(defaultDriver);
         setIsAuthenticated(true);
         return true;
       }
    }
    return false;
  };

  const register = async (newDriver: Partial<Driver>) => {
    await new Promise(resolve => setTimeout(resolve, 800));
    const createdDriver = {
      ...defaultDriver,
      ...newDriver,
      id: `DRV${Date.now()}`,
      avatar: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=400&h=400&fit=crop"
    } as Driver;
    
    setDriver(createdDriver);
    setIsAuthenticated(true);
  };

  const logout = () => {
    setIsAuthenticated(false);
    setDriver(null);
  };

  const updateProfile = (data: Partial<Driver>) => {
    if (driver) {
      setDriver({ ...driver, ...data });
    }
  };

  const toggleAsset = (id: string, type: 'vehicle' | 'remooc') => {
    if (!driver) return;

    if (type === 'vehicle') {
      setVehicles(prev => prev.map(v => {
        if (v.id === id) {
          // If currently assigned to me, unassign
          if (v.assignedDriverId === driver.id) return { ...v, assignedDriverId: null };
          // If free, assign to me
          if (!v.assignedDriverId) return { ...v, assignedDriverId: driver.id };
        }
        // If assigning this one, unassign others strictly? 
        // For simplicity allow only 1. We will do this by unassigning other vehicles first logic in a real app,
        // but for now, we assume the UI handles visual separation.
        // Actually let's enforce single selection per type
        if (v.assignedDriverId === driver.id && v.id !== id) {
           // If we are selecting a NEW one (logic above where id matches), we need to unselect old ones?
           // Complex state update:
           return v; 
        }
        return v;
      }));
      
      // Enforce single active vehicle for driver
      setVehicles(prev => {
        const target = prev.find(p => p.id === id);
        // If we are assigning the target (it was null), we must unassign others
        if (target && !target.assignedDriverId) {
           return prev.map(v => v.id === id ? { ...v, assignedDriverId: driver.id } : (v.assignedDriverId === driver.id ? { ...v, assignedDriverId: null } : v));
        }
        // If we are unassigning (it was me), just do it
        if (target && target.assignedDriverId === driver.id) {
           return prev.map(v => v.id === id ? { ...v, assignedDriverId: null } : v);
        }
        return prev;
      });
    } else {
      // Logic for Remooc (Same)
      setRemoocs(prev => {
        const target = prev.find(p => p.id === id);
        if (target && !target.assignedDriverId) {
           return prev.map(v => v.id === id ? { ...v, assignedDriverId: driver.id } : (v.assignedDriverId === driver.id ? { ...v, assignedDriverId: null } : v));
        }
        if (target && target.assignedDriverId === driver.id) {
           return prev.map(v => v.id === id ? { ...v, assignedDriverId: null } : v);
        }
        return prev;
      });
    }
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus, data?: Partial<Order>) => {
    setOrders(prevOrders => prevOrders.map(order => {
      if (order.id === orderId) {
        // Update timeline logic status
        const updatedTimeline = order.timeline.map(evt => {
            // Simple logic to move 'current' flag based on status
            if (status === 'Đang vận chuyển' && evt.label === 'Tài xế di chuyển') return { ...evt, status: 'current' as const, time: new Date().toLocaleString('vi-VN') };
            if (status === 'Hoàn tất' && evt.label === 'Hoàn tất') return { ...evt, status: 'completed' as const, time: new Date().toLocaleString('vi-VN') };
            // Mark previous steps complete
            if (status === 'Đang vận chuyển' && evt.label === 'Tài xế nhận đơn') return { ...evt, status: 'completed' as const };
            return evt;
        });

        return {
          ...order,
          status,
          timeline: updatedTimeline,
          ...data
        };
      }
      return order;
    }));
  };

  return (
    <GlobalStateContext.Provider value={{
      isAuthenticated,
      driver,
      carrier,
      orders,
      vehicles,
      remoocs,
      isDarkMode,
      login,
      logout,
      register,
      updateProfile,
      toggleAsset,
      toggleTheme,
      updateOrderStatus
    }}>
      {children}
    </GlobalStateContext.Provider>
  );
};

export const useGlobalState = () => {
  const context = useContext(GlobalStateContext);
  if (!context) throw new Error("useGlobalState must be used within GlobalProvider");
  return context;
};
