
import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useGlobalState } from '../context/GlobalState';
import { Header, Card, Button, Input } from '../components/Shared';
import { User, Settings, LogOut, Truck, Lock, ChevronRight, Search, Shield, Anchor, Palette, Building2, MapPin, Phone, CheckCircle2, AlertCircle } from 'lucide-react';

// --- Carrier & Asset Management ---
export const CarrierScreen: React.FC = () => {
  const { carrier, vehicles, remoocs, driver, toggleAsset } = useGlobalState();
  const [searchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') === 'remooc' ? 'remooc' : 'truck';
  const [activeTab, setActiveTab] = useState<'truck' | 'remooc'>(initialTab);
  const [search, setSearch] = useState('');

  if (!carrier || !driver) return null;

  // Filter List
  const list = activeTab === 'truck' ? vehicles : remoocs;
  const filteredList = list.filter(item => {
    // Basic search by ID/Plate/Code
    const code = (item as any).plateNumber || (item as any).code;
    return code.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div className="bg-slate-100 dark:bg-slate-950 min-h-full transition-colors pb-10">
      <Header title="Nhà xe của tôi" showBack />
      
      {/* Carrier Info */}
      <div className="px-4 py-4 bg-white dark:bg-slate-900 mb-2 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm">
            <img src={carrier.logo} alt="Logo" className="w-full h-full object-cover" />
          </div>
          <div className="flex-1">
             <h2 className="text-lg font-bold text-slate-900 dark:text-white leading-tight">{carrier.name}</h2>
             <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-start gap-1">
               <MapPin size={12} className="mt-0.5 shrink-0" /> {carrier.address}
             </p>
             <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1">
               <Phone size={12} /> {carrier.phone}
             </p>
          </div>
        </div>
      </div>

      <div className="sticky top-14 bg-slate-100 dark:bg-slate-950 z-30 transition-colors pt-2 px-4 pb-4">
        {/* Tabs */}
        <div className="flex bg-white dark:bg-slate-900 p-1 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 mb-4">
           <button 
             onClick={() => setActiveTab('truck')}
             className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${activeTab === 'truck' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
           >
             <Truck size={16} /> Đầu kéo
           </button>
           <button 
             onClick={() => setActiveTab('remooc')}
             className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${activeTab === 'remooc' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
           >
             <Anchor size={16} /> Rơ-mooc
           </button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            className="w-full h-11 pl-11 pr-4 rounded-xl border-none bg-white dark:bg-slate-900 dark:text-white text-sm font-medium focus:ring-2 focus:ring-blue-500 shadow-sm placeholder:text-slate-400 outline-none"
            placeholder={`Tìm biển số, mã ${activeTab === 'truck' ? 'xe' : 'rơ-mooc'}...`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="px-4 space-y-3">
         {filteredList.map((item: any) => {
            const isAssignedToMe = item.assignedDriverId === driver.id;
            const isBusy = item.assignedDriverId && !isAssignedToMe;
            const isAvailable = !item.assignedDriverId;

            const code = item.plateNumber || item.code;
            
            return (
              <div key={item.id} className={`bg-white dark:bg-slate-900 p-4 rounded-2xl border flex flex-col gap-3 transition-colors ${isAssignedToMe ? 'border-blue-500 ring-1 ring-blue-500' : 'border-slate-100 dark:border-slate-800'}`}>
                 <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                       <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${activeTab === 'truck' ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600' : 'bg-purple-50 dark:bg-purple-900/20 text-purple-600'}`}>
                          {activeTab === 'truck' ? <Truck size={20}/> : <Anchor size={20}/>}
                       </div>
                       <div>
                          <p className="font-bold text-slate-900 dark:text-white text-lg">{code}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{item.brand} • {item.type}</p>
                       </div>
                    </div>
                    
                    {/* Status Badge */}
                    <div>
                       {isAssignedToMe && <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-[10px] font-bold uppercase rounded flex items-center gap-1"><CheckCircle2 size={10}/> Đang dùng</span>}
                       {isBusy && <span className="px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 text-[10px] font-bold uppercase rounded flex items-center gap-1"><AlertCircle size={10}/> Đang bận</span>}
                       {isAvailable && <span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-[10px] font-bold uppercase rounded">Sẵn sàng</span>}
                    </div>
                 </div>

                 <div className="flex items-center justify-between pt-2 border-t border-slate-50 dark:border-slate-800">
                    <p className="text-[10px] font-bold text-orange-500 bg-orange-50 dark:bg-orange-900/20 px-2 py-1 rounded">
                       Hết hạn: {item.expiryDate}
                    </p>

                    {/* Action Button */}
                    <button 
                      disabled={isBusy}
                      onClick={() => toggleAsset(item.id, activeTab === 'truck' ? 'vehicle' : 'remooc')}
                      className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                         isAssignedToMe 
                         ? 'bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400' 
                         : isBusy 
                           ? 'bg-slate-100 text-slate-400 cursor-not-allowed dark:bg-slate-800 dark:text-slate-600'
                           : 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm active:scale-95'
                      }`}
                    >
                       {isAssignedToMe ? 'Hủy sử dụng' : isBusy ? 'Đã có người lái' : 'Sử dụng'}
                    </button>
                 </div>
              </div>
            );
         })}

         {filteredList.length === 0 && (
            <div className="text-center py-8 text-slate-400">
               <p>Không tìm thấy phương tiện nào</p>
            </div>
         )}
      </div>
    </div>
  );
};

// --- Profile Main ---
export const ProfileScreen: React.FC = () => {
  const { driver, logout, isDarkMode, toggleTheme } = useGlobalState();
  const navigate = useNavigate();

  if (!driver) return null;

  const MenuRow = ({ icon: Icon, label, onClick, danger, subText }: any) => (
    <button onClick={onClick} className="w-full flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors border-b border-slate-50 dark:border-slate-800 last:border-0 active:bg-slate-100 dark:active:bg-slate-700 group">
      <div className="flex items-center gap-4">
        <div className={`p-2 rounded-xl transition-colors ${danger ? 'bg-red-50 dark:bg-red-900/20 text-red-500 dark:text-red-400 group-hover:bg-red-100 dark:group-hover:bg-red-900/30' : 'bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20 group-hover:text-blue-600 dark:group-hover:text-blue-400'}`}>
          <Icon size={20} strokeWidth={danger ? 2 : 2} />
        </div>
        <span className={`text-sm font-semibold ${danger ? 'text-red-600 dark:text-red-400' : 'text-slate-700 dark:text-slate-200'}`}>{label}</span>
      </div>
      <div className="flex items-center gap-2">
        {subText && <span className="text-xs font-medium text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-slate-800 px-2 py-1 rounded">{subText}</span>}
        <ChevronRight size={18} className="text-slate-300 dark:text-slate-600" />
      </div>
    </button>
  );

  return (
    <div className="min-h-full bg-slate-100 dark:bg-slate-950 transition-colors">
      {/* Compact Header */}
      <div className="bg-blue-600 pt-8 pb-16 px-6 rounded-b-[32px] shadow-sm relative z-10">
         <div className="flex items-center gap-4 text-white">
            <div className="relative">
              <img src={driver.avatar} alt="avatar" className="w-16 h-16 rounded-full border-4 border-white/20 bg-slate-200 object-cover shadow-inner" />
              <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-400 border-2 border-blue-600 rounded-full"></div>
            </div>
            <div className="flex-1 min-w-0">
               <h2 className="text-xl font-bold truncate tracking-tight">{driver.name}</h2>
               <div className="flex items-center gap-2 text-blue-100 text-sm mt-1">
                  <span className="bg-white/20 px-2 py-0.5 rounded-md text-xs font-semibold backdrop-blur-sm">Tài xế</span>
                  <span className="opacity-90 font-medium tracking-wide">{driver.phone}</span>
               </div>
            </div>
            <button className="bg-white/20 p-2.5 rounded-full hover:bg-white/30 backdrop-blur-sm transition-colors">
              <Settings size={20} />
            </button>
         </div>
      </div>

      <div className="px-4 -mt-10 space-y-5 relative z-20 pb-8">
        {/* Stats Card */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg shadow-slate-200/50 dark:shadow-none p-4 flex justify-between items-center border border-slate-100 dark:border-slate-800 transition-colors">
           <div className="text-center flex-1">
             <p className="text-2xl font-black text-slate-800 dark:text-white">128</p>
             <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mt-1">Đơn hàng</p>
           </div>
           <div className="w-px h-10 bg-slate-100 dark:bg-slate-800"></div>
           <div className="text-center flex-1">
             <p className="text-2xl font-black text-green-500">4.9</p>
             <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mt-1">Đánh giá</p>
           </div>
           <div className="w-px h-10 bg-slate-100 dark:bg-slate-800"></div>
           <div className="text-center flex-1">
             <p className="text-2xl font-black text-orange-500">2</p>
             <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mt-1">Năm</p>
           </div>
        </div>

        {/* Menu Group 1: Account */}
        <div>
           <p className="text-xs font-bold text-slate-400 uppercase ml-2 mb-3 tracking-wider">Tài khoản</p>
           <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 overflow-hidden shadow-sm transition-colors">
             <MenuRow icon={User} label="Thông tin cá nhân" onClick={() => {}} />
             <MenuRow icon={Lock} label="Đổi mật khẩu" onClick={() => {}} />
             <MenuRow icon={Building2} label="Nhà xe của tôi" onClick={() => navigate('/app/vehicles')} subText="SmartHub" />
           </div>
        </div>

        {/* Menu Group 2: App */}
        <div>
           <p className="text-xs font-bold text-slate-400 uppercase ml-2 mb-3 tracking-wider">Cài đặt</p>
           <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 overflow-hidden shadow-sm transition-colors">
             <MenuRow icon={Palette} label="Giao diện" onClick={toggleTheme} subText={isDarkMode ? "Tối" : "Sáng"} />
             <MenuRow icon={LogOut} label="Đăng xuất" danger onClick={() => {
               logout();
               navigate('/login');
             }} />
           </div>
        </div>
        
        <p className="text-center text-[10px] text-slate-300 dark:text-slate-600 font-medium pt-4">SmartHub Driver v1.0.0 (Mock)</p>
      </div>
    </div>
  );
};
