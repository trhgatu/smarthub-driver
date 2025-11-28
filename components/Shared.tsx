
import React, { InputHTMLAttributes } from 'react';
import { ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Button
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}
export const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', size = 'md', fullWidth, className = '', ...props }) => {
  const sizeClasses = {
    sm: "py-2 px-3 text-sm h-9",
    md: "py-3 px-6 text-base h-12",
    lg: "py-4 px-6 text-lg h-14"
  };
  
  const base = `${sizeClasses[size]} rounded-2xl font-semibold transition-transform active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50 disabled:pointer-events-none`;
  
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500",
    outline: "border border-blue-200 text-blue-600 bg-white hover:bg-blue-50 dark:bg-slate-800 dark:border-slate-700 dark:text-blue-400 dark:hover:bg-slate-700",
    ghost: "bg-transparent text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800",
    danger: "bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30"
  };
  
  const width = fullWidth ? "w-full" : "";
  
  return (
    <button className={`${base} ${variants[variant]} ${width} ${className}`} {...props}>
      {children}
    </button>
  );
};

// Input
interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}
export const Input: React.FC<InputProps> = ({ label, error, icon, className = '', ...props }) => {
  return (
    <div className={`mb-5 ${className}`}>
      {label && <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 ml-1">{label}</label>}
      <div className="relative">
        <input 
          className={`w-full h-12 px-4 rounded-xl border ${error ? 'border-red-300 bg-red-50 text-red-900 dark:bg-red-900/20 dark:text-red-100 dark:border-red-800' : 'border-slate-200 bg-slate-50 text-slate-800 dark:bg-slate-800 dark:border-slate-700 dark:text-white dark:placeholder:text-slate-500'} focus:bg-white dark:focus:bg-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all placeholder:text-slate-400 font-medium ${icon ? 'pl-11' : ''}`}
          {...props}
        />
        {icon && <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 pointer-events-none">{icon}</div>}
      </div>
      {error && <p className="text-xs text-red-500 mt-1.5 ml-1 font-medium">{error}</p>}
    </div>
  );
};

// Header
interface HeaderProps {
  title: string;
  showBack?: boolean;
  rightAction?: React.ReactNode;
  transparent?: boolean;
}
export const Header: React.FC<HeaderProps> = ({ title, showBack, rightAction, transparent }) => {
  const navigate = useNavigate();
  return (
    <header className={`${transparent ? 'bg-transparent border-none' : 'bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800'} sticky top-0 z-40 px-4 flex items-center justify-between h-14 transition-colors`}>
      <div className="flex items-center gap-2 flex-1">
        {showBack && (
          <button onClick={() => navigate(-1)} className="w-9 h-9 flex items-center justify-center rounded-full bg-slate-50 text-slate-700 hover:bg-slate-100 active:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 transition-colors">
            <ChevronLeft size={22} strokeWidth={2.5} />
          </button>
        )}
        <h1 className="text-lg font-bold text-slate-800 dark:text-white truncate">{title}</h1>
      </div>
      <div className="flex-shrink-0">{rightAction}</div>
    </header>
  );
};

// Card
export const Card: React.FC<{ children: React.ReactNode, className?: string, onClick?: () => void }> = ({ children, className = '', onClick }) => (
  <div onClick={onClick} className={`bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-5 ${className} ${onClick ? 'cursor-pointer active:bg-slate-50 dark:active:bg-slate-800 transition-colors' : ''}`}>
    {children}
  </div>
);

// Badge
export const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  let colors = "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400";
  
  if (status === 'Đang vận chuyển') colors = "bg-blue-50 text-blue-700 border border-blue-100 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-900/50";
  else if (status === 'Sẵn sàng') colors = "bg-purple-50 text-purple-700 border border-purple-100 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-900/50";
  else if (status === 'Đã thanh toán') colors = "bg-cyan-50 text-cyan-700 border border-cyan-100 dark:bg-cyan-900/30 dark:text-cyan-300 dark:border-cyan-900/50";
  else if (status === 'Hạ hàng') colors = "bg-orange-50 text-orange-700 border border-orange-100 dark:bg-orange-900/30 dark:text-orange-300 dark:border-orange-900/50";
  else if (status === 'Hoàn tất') colors = "bg-green-50 text-green-700 border border-green-100 dark:bg-green-900/30 dark:text-green-300 dark:border-green-900/50";
  else if (status === 'Đã hủy') colors = "bg-red-50 text-red-700 border border-red-100 dark:bg-red-900/30 dark:text-red-300 dark:border-red-900/50";

  return (
    <span className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wide ${colors}`}>
      {status}
    </span>
  );
};
