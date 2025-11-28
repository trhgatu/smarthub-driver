
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useGlobalState } from '../context/GlobalState';
import { Header, Card, StatusBadge, Button, Input } from '../components/Shared';
import { MapPin, Calendar, Truck, User, Phone, Search, Filter, Clock, Package, ChevronRight, Navigation, CheckCircle2, Camera, PenTool, ArrowDownCircle, Upload, ChevronDown, ChevronUp, Container, Info, StickyNote, ShieldCheck, QrCode, Banknote, Wallet, Map, Eye, X, ArrowRight, Anchor } from 'lucide-react';
import { Order } from '../types';
import { OPERATION_TYPES } from '../services/mockFactory';

// Helper to format currency
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
};

// Helper to parse DD/MM/YYYY to Date object
const parseDate = (dateStr: string) => {
  if (!dateStr) return null;
  const parts = dateStr.split(' ')[0].split('/'); // Get DD/MM/YYYY part
  if (parts.length !== 3) return null;
  // Create date using YYYY-MM-DD format for reliability
  return new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
};

// --- Order Item Component (Redesigned) ---
const OrderItem: React.FC<{ order: Order }> = ({ order }) => {
  const navigate = useNavigate();
  
  // Color coding for Operation Type to make it distinct
  const getOpColor = (op: string) => {
     if (op.includes('Hạ')) return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300 border-orange-200 dark:border-orange-800';
     if (op.includes('Lấy')) return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 border-blue-200 dark:border-blue-800';
     if (op.includes('Cấp')) return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 border-purple-200 dark:border-purple-800';
     return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700';
  };

  return (
    <div 
      onClick={() => navigate(`/app/order/${order.id}`)}
      className="bg-white dark:bg-slate-900 rounded-2xl p-0 mb-4 border border-slate-200 dark:border-slate-800 shadow-sm active:scale-[0.99] transition-transform overflow-hidden relative"
    >
      {/* 1. Header: Operation & Status */}
      <div className="flex justify-between items-center p-4 pb-2">
         <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wide border ${getOpColor(order.operationType)}`}>
            {order.operationType}
         </span>
         <StatusBadge status={order.status} />
      </div>

      {/* 2. Primary Info: Container Code & ID */}
      <div className="px-4 pb-4 border-b border-dashed border-slate-200 dark:border-slate-800">
         <div className="flex justify-between items-end">
            <div>
               <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">Số Container</p>
               <h3 className="text-xl font-black text-slate-800 dark:text-white font-mono tracking-tight">{order.containerCode}</h3>
            </div>
            <div className="text-right">
               <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">Mã đơn</p>
               <p className="text-sm font-semibold text-slate-600 dark:text-slate-400 font-mono">#{order.id}</p>
            </div>
         </div>
      </div>

      {/* 3. Route Visualization */}
      <div className="p-4 relative">
         {/* Vertical Line */}
         <div className="absolute left-[29px] top-6 bottom-6 w-0.5 bg-slate-200 dark:bg-slate-700"></div>
         
         {/* Pickup */}
         <div className="flex gap-4 mb-6 relative z-10">
            <div className="w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 flex items-center justify-center shrink-0">
               <div className="w-2.5 h-2.5 rounded-full bg-blue-500"></div>
            </div>
            <div className="flex-1 min-w-0 pt-0.5">
               <p className="text-[10px] text-slate-400 font-bold uppercase mb-0.5">Điểm lấy hàng</p>
               <p className="text-sm font-bold text-slate-800 dark:text-slate-100 truncate">{order.origin}</p>
               <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 flex items-center gap-1">
                  <Clock size={10} /> {order.pickupDate}
               </p>
            </div>
         </div>

         {/* Dropoff */}
         <div className="flex gap-4 relative z-10">
            <div className="w-8 h-8 rounded-full bg-orange-50 dark:bg-orange-900/20 border border-orange-100 dark:border-orange-800 flex items-center justify-center shrink-0">
               <div className="w-2.5 h-2.5 rounded-sm bg-orange-500 rotate-45"></div>
            </div>
            <div className="flex-1 min-w-0 pt-0.5">
               <p className="text-[10px] text-slate-400 font-bold uppercase mb-0.5">Điểm trả hàng</p>
               <p className="text-sm font-bold text-slate-800 dark:text-slate-100 truncate">{order.destination}</p>
               {order.deliveryDate && (
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 flex items-center gap-1">
                     <Clock size={10} /> {order.deliveryDate}
                  </p>
               )}
            </div>
         </div>
      </div>

      {/* 4. Footer Info Grid */}
      <div className="bg-slate-50 dark:bg-slate-800/50 px-4 py-3 flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
         <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
               <Map size={14} className="text-slate-400" />
               <span className="text-xs font-bold text-slate-600 dark:text-slate-300">{order.distance} km</span>
            </div>
            <div className="w-px h-3 bg-slate-300 dark:bg-slate-700"></div>
            <div className="flex items-center gap-1.5">
               <User size={14} className="text-slate-400" />
               <span className="text-xs font-semibold text-slate-600 dark:text-slate-300 truncate max-w-[100px]">{order.customer.name.split(' ')[0]}...</span>
            </div>
         </div>
         <div className="flex items-center text-blue-600 dark:text-blue-400 text-xs font-bold">
            Chi tiết <ChevronRight size={14} className="ml-0.5" />
         </div>
      </div>
    </div>
  );
};

// --- Dashboard (Active Orders) ---
export const DashboardScreen: React.FC = () => {
  const { orders } = useGlobalState();
  const [search, setSearch] = useState('');
  
  // Filter States
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [selectedOp, setSelectedOp] = useState<string>('');

  const activeOrders = orders.filter(o => {
    // Basic Status Filter
    if (o.status === 'Hoàn tất' || o.status === 'Đã hủy') return false;
    
    // Search Text
    const matchesSearch = o.id.includes(search) || o.containerCode.includes(search);
    if (!matchesSearch) return false;

    // Operation Filter
    if (selectedOp && o.operationType !== selectedOp) return false;

    // Date Range Filter (Compare YYYY-MM-DD)
    if (fromDate || toDate) {
      const orderDate = parseDate(o.pickupDate);
      if (orderDate) {
        if (fromDate) {
          const from = new Date(fromDate);
          from.setHours(0,0,0,0);
          if (orderDate < from) return false;
        }
        if (toDate) {
          const to = new Date(toDate);
          to.setHours(23,59,59,999);
          if (orderDate > to) return false;
        }
      }
    }

    return true;
  });

  const hasActiveFilter = fromDate || toDate || selectedOp;

  const resetFilters = () => {
    setFromDate('');
    setToDate('');
    setSelectedOp('');
  };

  return (
    <div className="bg-slate-100 dark:bg-slate-950 min-h-full transition-colors">
      <Header 
        title="Đơn hàng hiện tại" 
        rightAction={
          <div className="relative">
             <div className="w-10 h-10 bg-white dark:bg-slate-800 rounded-full border border-slate-100 dark:border-slate-700 flex items-center justify-center shadow-sm">
                <Truck size={20} className="text-slate-600 dark:text-slate-300"/>
             </div>
             {activeOrders.length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-slate-50 dark:border-slate-900">
                  {activeOrders.length}
                </span>
             )}
          </div>
        }
      />
      
      <div className="sticky top-14 bg-slate-100 dark:bg-slate-950 z-30 transition-colors shadow-sm">
        <div className="px-4 py-4">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                className="w-full h-11 pl-11 pr-4 rounded-xl border-none bg-white dark:bg-slate-900 dark:text-white text-sm font-medium focus:ring-2 focus:ring-blue-500 shadow-sm placeholder:text-slate-400 outline-none"
                placeholder="Tìm mã container, mã đơn..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <button 
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={`h-11 w-11 flex items-center justify-center rounded-xl shadow-sm active:scale-95 transition-all border ${isFilterOpen || hasActiveFilter ? 'bg-blue-600 text-white border-blue-600' : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-transparent'}`}
            >
              <Filter size={20} />
            </button>
          </div>
        </div>
        
        {/* Collapsible Filter Panel */}
        {isFilterOpen && (
          <div className="px-4 pb-4 animate-fade-in-down">
            <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
               {/* Date Range */}
               <div>
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-2 block">Thời gian lấy hàng</label>
                  <div className="flex gap-3">
                     <div className="flex-1">
                        <input 
                          type="date" 
                          className="w-full h-10 px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 dark:text-white text-sm outline-none focus:border-blue-500"
                          value={fromDate}
                          onChange={(e) => setFromDate(e.target.value)}
                        />
                     </div>
                     <span className="self-center text-slate-400">-</span>
                     <div className="flex-1">
                        <input 
                          type="date" 
                          className="w-full h-10 px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 dark:text-white text-sm outline-none focus:border-blue-500"
                          value={toDate}
                          onChange={(e) => setToDate(e.target.value)}
                        />
                     </div>
                  </div>
               </div>

               {/* Operation Type Chips - Hide if only 1 type exists */}
               {OPERATION_TYPES.length > 1 && (
                 <div>
                    <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-2 block">Loại tác nghiệp</label>
                    <div className="flex flex-wrap gap-2">
                       {OPERATION_TYPES.map(op => (
                          <button
                            key={op}
                            onClick={() => setSelectedOp(selectedOp === op ? '' : op)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors border ${selectedOp === op ? 'bg-blue-600 text-white border-blue-600' : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-blue-300'}`}
                          >
                             {op}
                          </button>
                       ))}
                    </div>
                 </div>
               )}

               {/* Footer Actions */}
               <div className="pt-2 flex justify-between items-center border-t border-slate-100 dark:border-slate-800 mt-2">
                  <button 
                    onClick={resetFilters}
                    disabled={!hasActiveFilter}
                    className="text-slate-500 dark:text-slate-400 text-sm font-semibold flex items-center gap-1 hover:text-red-500 disabled:opacity-50"
                  >
                     <X size={16} /> Xóa bộ lọc
                  </button>
                  <button 
                    onClick={() => setIsFilterOpen(false)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-sm active:scale-95 transition-transform"
                  >
                     Áp dụng {hasActiveFilter ? `(${activeOrders.length})` : ''}
                  </button>
               </div>
            </div>
          </div>
        )}
      </div>

      <div className="px-4 pb-4">
        {activeOrders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400">
            <div className="w-20 h-20 bg-slate-200 dark:bg-slate-900 rounded-full flex items-center justify-center mb-4">
               <Package size={32} />
            </div>
            <p className="font-medium">Không tìm thấy đơn hàng</p>
            {hasActiveFilter && (
               <button onClick={resetFilters} className="text-blue-600 font-bold text-sm mt-2">
                  Xóa bộ lọc tìm kiếm
               </button>
            )}
          </div>
        ) : (
          activeOrders.map(order => <OrderItem key={order.id} order={order} />)
        )}
      </div>
    </div>
  );
};

// --- Completed Orders Screen ---
export const CompletedOrderScreen: React.FC = () => {
  const { orders } = useGlobalState();
  const [search, setSearch] = useState('');

  const completedOrders = orders.filter(o => 
    o.status === 'Hoàn tất' &&
    (o.id.includes(search) || o.containerCode.includes(search))
  );

  const totalWeight = completedOrders.reduce((sum, o) => sum + (o.weight || 0), 0);

  return (
    <div className="bg-slate-100 dark:bg-slate-950 min-h-full transition-colors">
      <Header title="Đơn đã hoàn tất" />
      
      {/* Summary Stats */}
      <div className="px-4 py-4">
         <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-5 text-white shadow-sm">
            <div className="flex items-center gap-3 mb-2 opacity-90">
               <CheckCircle2 size={20} />
               <span className="text-sm font-semibold">Tổng kết chuyến đi</span>
            </div>
            <div className="flex justify-between items-end">
               <div>
                  <p className="text-3xl font-bold">{completedOrders.length}</p>
                  <p className="text-xs text-green-100 font-medium mt-1">Chuyến hoàn thành</p>
               </div>
               <div className="text-right">
                  <p className="text-xl font-bold">{totalWeight} Tấn</p>
                  <p className="text-xs text-green-100 font-medium mt-1">Tổng sản lượng</p>
               </div>
            </div>
         </div>
      </div>

      <div className="px-4 pb-2 sticky top-14 bg-slate-100 dark:bg-slate-950 z-30 transition-colors">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            className="w-full h-11 pl-11 pr-4 rounded-xl border-none bg-white dark:bg-slate-900 dark:text-white text-sm font-medium focus:ring-2 focus:ring-green-500 shadow-sm placeholder:text-slate-400 outline-none"
            placeholder="Tìm đơn đã xong..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="px-4 pb-4 mt-2">
        {completedOrders.length === 0 ? (
          <div className="text-center py-10 text-slate-400">
             <p>Chưa có đơn hàng nào hoàn tất</p>
          </div>
        ) : (
          completedOrders.map(order => <OrderItem key={order.id} order={order} />)
        )}
      </div>
    </div>
  );
};

// --- History Screen ---
export const HistoryScreen: React.FC = () => {
  const { orders } = useGlobalState();
  const [search, setSearch] = useState('');

  const historyOrders = orders.filter(o => 
    (o.status === 'Hoàn tất' || o.status === 'Đã hủy') &&
    (o.id.includes(search) || o.containerCode.includes(search))
  );

  return (
    <div className="bg-slate-100 dark:bg-slate-950 min-h-full transition-colors">
      <Header title="Lịch sử toàn bộ" />
      <div className="px-4 py-4 sticky top-14 bg-slate-100 dark:bg-slate-950 z-30 transition-colors">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            className="w-full h-11 pl-11 pr-4 rounded-xl border-none bg-white dark:bg-slate-900 dark:text-white text-sm font-medium focus:ring-2 focus:ring-blue-500 shadow-sm placeholder:text-slate-400 outline-none"
            placeholder="Tra cứu lịch sử..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>
      <div className="px-4 pb-4">
        {historyOrders.map(order => <OrderItem key={order.id} order={order} />)}
      </div>
    </div>
  );
};

// --- Order Detail ---
export const OrderDetailScreen: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { orders, updateOrderStatus } = useGlobalState();
  const order = orders.find(o => o.id === id);

  // States
  const [sealInput, setSealInput] = useState('');
  const [showSealInput, setShowSealInput] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  
  // Header Expand State
  const [isHeaderExpanded, setIsHeaderExpanded] = useState(false);

  if (!order) return <div className="p-10 text-center text-slate-500 dark:text-slate-400">Không tìm thấy đơn hàng</div>;

  // --- Logic Handlers ---

  const handleStartOrder = () => {
    if (confirm("Xác nhận bắt đầu đơn hàng này?")) {
      updateOrderStatus(order.id, 'Hạ hàng');
    }
  };

  const handleConfirmSeal = () => {
    if (!sealInput) return alert("Vui lòng nhập mã Seal");
    updateOrderStatus(order.id, 'Hạ hàng', { sealNumber: sealInput });
    setShowSealInput(false);
  };

  const handleDropContainer = () => {
    if (confirm("Xác nhận đã hạ container?")) {
       updateOrderStatus(order.id, 'Đang vận chuyển');
    }
  };

  const handleFinishTransport = () => {
    setShowUpload(true);
  };

  const handleMockUpload = () => {
    setUploadedImage("https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=400&fit=crop");
  };

  const handleCompleteOrder = () => {
    if (!uploadedImage) return alert("Vui lòng chụp ảnh POD trước khi hoàn tất");
    updateOrderStatus(order.id, 'Hoàn tất', { podImage: uploadedImage });
    alert("Đơn hàng đã hoàn tất!");
    navigate('/app/completed');
  };

  const renderActions = () => {
     if (order.status === 'Hoàn tất') return null;

     if (order.status === 'Sẵn sàng' || order.status === 'Đã thanh toán' || order.status === 'Mới') {
       return (
         <Button fullWidth size="lg" onClick={handleStartOrder} className="shadow-lg shadow-blue-200 dark:shadow-none bg-blue-600">
           <Truck className="mr-2" size={20} /> Bắt đầu đơn hàng
         </Button>
       );
     }

     if (order.status === 'Hạ hàng') {
       if (!order.sealNumber) {
         if (showSealInput) {
            return (
              <div className="space-y-3 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 animate-fade-in-up">
                 <p className="font-bold text-slate-800 dark:text-white">Nhập số Seal</p>
                 <Input 
                    placeholder="Nhập mã seal..." 
                    value={sealInput} 
                    onChange={e => setSealInput(e.target.value)} 
                    icon={<PenTool size={18}/>}
                    autoFocus
                 />
                 <div className="flex gap-3">
                    <Button variant="ghost" fullWidth onClick={() => setShowSealInput(false)}>Hủy</Button>
                    <Button fullWidth onClick={handleConfirmSeal}>Lưu Seal</Button>
                 </div>
              </div>
            );
         }
         return (
            <Button fullWidth size="lg" onClick={() => setShowSealInput(true)} className="bg-orange-600 hover:bg-orange-700 shadow-lg shadow-orange-200 dark:shadow-none">
               <PenTool className="mr-2" size={20} /> Nhập số Seal
            </Button>
         );
       } else {
         return (
            <div className="space-y-3">
               <div className="flex justify-between items-center bg-green-50 dark:bg-green-900/20 p-3 rounded-xl border border-green-100 dark:border-green-800">
                  <div className="flex items-center gap-2 text-green-700 dark:text-green-400 font-bold">
                     <CheckCircle2 size={20} /> Seal: {order.sealNumber}
                  </div>
                  <button onClick={() => updateOrderStatus(order.id, 'Hạ hàng', { sealNumber: undefined })} className="text-xs text-slate-400 underline">Sửa</button>
               </div>
               <Button fullWidth size="lg" onClick={handleDropContainer} className="bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200 dark:shadow-none">
                  <ArrowDownCircle className="mr-2" size={20} /> Hạ Container
               </Button>
            </div>
         );
       }
     }

     if (order.status === 'Đang vận chuyển') {
        if (showUpload) {
           return (
              <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 animate-fade-in-up">
                 <h3 className="font-bold text-slate-800 dark:text-white mb-4">Cập nhật bằng chứng giao hàng (POD)</h3>
                 
                 <div onClick={handleMockUpload} className="w-full h-48 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl flex flex-col items-center justify-center mb-4 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors relative overflow-hidden">
                    {uploadedImage ? (
                       <img src={uploadedImage} alt="POD" className="w-full h-full object-cover" />
                    ) : (
                       <>
                          <Camera size={40} className="text-slate-400 mb-2" />
                          <p className="text-sm text-slate-500 font-medium">Chạm để chụp ảnh</p>
                       </>
                    )}
                 </div>

                 <div className="flex gap-3">
                    <Button variant="ghost" fullWidth onClick={() => { setShowUpload(false); setUploadedImage(null); }}>Quay lại</Button>
                    <Button fullWidth disabled={!uploadedImage} onClick={handleCompleteOrder} className="bg-green-600 hover:bg-green-700">
                       Hoàn tất đơn hàng
                    </Button>
                 </div>
              </div>
           );
        }
        return (
           <Button fullWidth size="lg" onClick={handleFinishTransport} className="bg-purple-600 hover:bg-purple-700 shadow-lg shadow-purple-200 dark:shadow-none">
              <CheckCircle2 className="mr-2" size={20} /> Kết thúc vận chuyển
           </Button>
        );
     }
  };

  const actionContent = renderActions();

  return (
    <div className="bg-slate-100 dark:bg-slate-950 min-h-full pb-32 transition-colors relative">
      <Header title="Chi tiết đơn hàng" showBack />
      
      <div className="px-4 mt-2 mb-6">
         {/* Top Summary Card (Expandable) */}
         <div 
           className={`bg-white dark:bg-slate-900 rounded-2xl border transition-all overflow-hidden relative ${isHeaderExpanded ? 'border-blue-500 ring-1 ring-blue-500 shadow-lg shadow-blue-100 dark:shadow-none' : 'border-slate-200 dark:border-slate-700 shadow-sm'}`}
         >
            {/* Header (Always Visible) */}
            <div 
              onClick={() => setIsHeaderExpanded(!isHeaderExpanded)}
              className="p-5 cursor-pointer active:bg-slate-50 dark:active:bg-slate-800 transition-colors relative group"
            >
              {/* Prominent Hint Badge */}
              {!isHeaderExpanded && (
                 <div className="absolute top-0 right-0 bg-blue-600 text-white text-[10px] font-bold px-3 py-1.5 rounded-bl-xl shadow-sm animate-pulse z-10 flex items-center gap-1">
                    <Eye size={12} /> Chạm để xem
                 </div>
              )}
              
              <div className="flex justify-between items-start mb-4">
                 <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 uppercase font-bold tracking-wider mb-1">Mã đơn hàng</p>
                    <div className="flex items-center gap-2">
                       <p className="text-2xl font-black text-blue-600 dark:text-blue-400 font-mono tracking-tight">{order.id}</p>
                    </div>
                 </div>
                 <div className="pt-2">
                    <StatusBadge status={order.status} />
                 </div>
              </div>
              
              <div className="flex gap-4 text-sm overflow-x-auto no-scrollbar pb-1">
                 <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800 px-3 py-1.5 rounded-lg whitespace-nowrap">
                    <Calendar size={16} className="text-blue-500"/> 
                    <span className="font-medium">{order.pickupDate.split(' ')[0]}</span>
                 </div>
                 <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800 px-3 py-1.5 rounded-lg whitespace-nowrap">
                    <Map size={16} className="text-orange-500"/> 
                    <span className="font-medium">{order.distance} km</span>
                 </div>
              </div>

              {/* Action Call Footer */}
              <div className={`mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-center items-center gap-1.5 text-xs font-bold uppercase tracking-wide transition-colors ${isHeaderExpanded ? 'text-slate-400' : 'text-blue-600 dark:text-blue-400'}`}>
                  {isHeaderExpanded ? 'Thu gọn' : 'Xem chi tiết đầy đủ'} 
                  {isHeaderExpanded ? <ChevronUp size={14}/> : <ChevronDown size={14} className="animate-bounce"/>}
              </div>
            </div>

            {/* Expanded Content (Dropdown) */}
            {isHeaderExpanded && (
               <div className="px-5 pb-5 pt-0 border-t border-slate-100 dark:border-slate-800 animate-fade-in-down bg-slate-50/50 dark:bg-slate-800/20">
                  <div className="mt-4 flex flex-col items-center mb-6">
                     <div className="bg-white p-2 rounded-xl border border-slate-200 shadow-sm">
                        <img src={order.qrCodeUrl} alt="QR Code" className="w-32 h-32" />
                     </div>
                     <p className="text-[10px] text-slate-400 mt-2 font-mono">{order.id}</p>
                  </div>

                  {/* 1. Customer Section (Moved here) */}
                  <div className="bg-purple-50 dark:bg-purple-900/10 p-3 rounded-xl border border-purple-100 dark:border-purple-900/30 mb-4">
                     <div className="flex items-center gap-2 text-purple-700 dark:text-purple-400 font-bold uppercase text-xs mb-2">
                        <User size={14} /> Khách hàng
                     </div>
                     <p className="font-bold text-slate-900 dark:text-white text-sm">{order.customer.name}</p>
                     <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">Đối tác Doanh Nghiệp</p>
                     
                     <div className="mt-2 pt-2 border-t border-purple-100 dark:border-purple-900/30 space-y-1.5">
                        <div className="flex items-center gap-2 text-sm">
                           <Phone size={12} className="text-purple-400"/>
                           <span className="text-blue-600 dark:text-blue-400 font-semibold">{order.customer.phone}</span>
                        </div>
                        <div className="flex items-start gap-2 text-sm">
                           <MapPin size={12} className="text-purple-400 mt-0.5"/>
                           <span className="text-slate-600 dark:text-slate-300">{order.customer.address}</span>
                        </div>
                     </div>
                  </div>

                  {/* 2. Cargo & Container Section (Consolidated) */}
                  <div className="space-y-4 text-sm mb-4">
                     <div className="grid grid-cols-[100px_1fr] gap-2 items-start">
                        <span className="text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1.5"><Container size={14}/> Số Cont</span>
                        <span className="text-slate-900 dark:text-white font-bold font-mono text-right text-lg leading-none">{order.containerCode}</span>
                     </div>
                     
                     <div className="grid grid-cols-[100px_1fr] gap-2 items-start">
                        <span className="text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1.5"><Info size={14}/> Chủ Cont</span>
                        <span className="text-slate-900 dark:text-white font-semibold text-right">{order.containerOwner || 'Hapag-Lloyd'}</span>
                     </div>
                     
                     <div className="grid grid-cols-[100px_1fr] gap-2 items-start">
                        <span className="text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1.5"><Package size={14}/> Hàng hóa</span>
                        <span className="text-slate-900 dark:text-white font-semibold text-right">{order.cargoType} ({order.containerSize || '40HC'})</span>
                     </div>
                     
                     <div className="grid grid-cols-[100px_1fr] gap-2 items-start">
                        <span className="text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1.5"><Anchor size={14}/> Rơ-mooc</span>
                        <span className="text-slate-900 dark:text-white font-semibold text-right">RM-2992</span>
                     </div>

                     <div className="grid grid-cols-[100px_1fr] gap-2 items-start">
                        <span className="text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1.5"><PenTool size={14}/> Tác nghiệp</span>
                        <span className="text-slate-900 dark:text-white font-semibold text-right">{order.operationType || 'Hạ bãi'}</span>
                     </div>

                     {order.sealNumber && (
                        <div className="grid grid-cols-[100px_1fr] gap-2 items-start">
                           <span className="text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1.5"><CheckCircle2 size={14} className="text-green-500"/> Mã Seal</span>
                           <span className="text-blue-600 dark:text-blue-400 font-bold font-mono text-right">{order.sealNumber}</span>
                        </div>
                     )}
                  </div>

                  <div className="h-px bg-slate-200 dark:bg-slate-700 my-4"></div>

                  {/* 3. Route & Services (Existing) */}
                  <div className="space-y-4 text-sm">
                     <div className="grid grid-cols-[100px_1fr] gap-2 items-start">
                        <span className="text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1.5"><MapPin size={14} className="text-green-500"/> Điểm đi</span>
                        <span className="text-slate-900 dark:text-white font-semibold text-right">{order.origin}</span>
                     </div>
                     <div className="grid grid-cols-[100px_1fr] gap-2 items-start">
                        <span className="text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1.5"><MapPin size={14} className="text-orange-500"/> Điểm đích</span>
                        <span className="text-slate-900 dark:text-white font-semibold text-right">{order.destination}</span>
                     </div>

                     <div className="bg-blue-50 dark:bg-blue-900/10 p-3 rounded-lg border border-blue-100 dark:border-blue-900/30 mt-4">
                        <p className="text-xs text-blue-500 dark:text-blue-400 font-bold uppercase mb-1 flex items-center gap-1"><ShieldCheck size={12}/> Dịch vụ kèm theo</p>
                        <ul className="text-sm text-blue-900 dark:text-blue-100 list-disc list-inside font-medium">
                           {order.services?.map((s, idx) => <li key={idx}>{s}</li>) || <li>Bảo hiểm thân vỏ container</li>}
                        </ul>
                     </div>

                     {order.note && (
                        <div className="bg-orange-50 dark:bg-orange-900/10 p-3 rounded-lg border border-orange-100 dark:border-orange-900/30">
                           <p className="text-xs text-orange-500 dark:text-orange-400 font-bold uppercase mb-1 flex items-center gap-1"><StickyNote size={12}/> Ghi chú</p>
                           <p className="text-sm text-orange-900 dark:text-orange-100 font-medium italic">"{order.note}"</p>
                        </div>
                     )}
                  </div>
               </div>
            )}
         </div>
      </div>

      <div className="px-4 space-y-6">
        {/* Payment Info (New Block) */}
        <div>
           <h3 className="font-bold text-slate-800 dark:text-slate-200 mb-3 flex items-center gap-2 text-base px-1">
             <Banknote size={18} className="text-green-600" /> Thông tin thanh toán
           </h3>
           <Card className="!p-5 border-l-4 border-l-green-500">
              <div className="space-y-3">
                 <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-500 dark:text-slate-400 font-medium">Cước vận chuyển</span>
                    <span className="text-slate-900 dark:text-white font-semibold">{formatCurrency(order.payment.transportFee)}</span>
                 </div>
                 <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-500 dark:text-slate-400 font-medium">Phí nâng hạ</span>
                    <span className="text-slate-900 dark:text-white font-semibold">{formatCurrency(order.payment.liftFee)}</span>
                 </div>
                 {order.payment.forbiddenRoadFee > 0 && (
                    <div className="flex justify-between items-center text-sm">
                       <span className="text-slate-500 dark:text-slate-400 font-medium">Luật đường cấm</span>
                       <span className="text-slate-900 dark:text-white font-semibold">{formatCurrency(order.payment.forbiddenRoadFee)}</span>
                    </div>
                 )}
                 
                 <div className="h-px bg-slate-100 dark:bg-slate-800 border-dashed border-b border-slate-200 dark:border-slate-700 my-2"></div>
                 
                 <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-500 dark:text-slate-400 font-medium">Đã tạm ứng</span>
                    <span className="text-red-500 font-semibold">-{formatCurrency(order.payment.advance)}</span>
                 </div>
                 
                 <div className="mt-2 pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-between items-end">
                    <span className="text-slate-900 dark:text-white font-bold uppercase text-xs">Thực nhận</span>
                    <span className="text-green-600 dark:text-green-400 font-black text-xl">{formatCurrency(order.payment.totalReal)}</span>
                 </div>
              </div>
           </Card>
        </div>

        {/* Timeline (Vertical) */}
        <div>
          <h3 className="font-bold text-slate-800 dark:text-slate-200 mb-3 flex items-center gap-2 text-base px-1">
             <Navigation size={18} className="text-blue-600 dark:text-blue-400" /> Tiến trình vận chuyển
          </h3>
          <Card className="!p-6">
            <div className="space-y-0 relative">
               {/* Connecting Line */}
               <div className="absolute left-[15px] top-2 bottom-6 w-0.5 bg-slate-100 dark:bg-slate-800"></div>

               {order.timeline.map((event, index) => {
                 const isLast = index === order.timeline.length - 1;
                 const isCompleted = event.status === 'completed';
                 const isCurrent = event.status === 'current';
                 
                 return (
                  <div key={event.id} className={`relative pl-10 ${isLast ? '' : 'pb-8'}`}>
                    {/* Dot Indicator */}
                    <div className={`absolute left-0 top-0.5 w-8 h-8 rounded-full border-4 border-white dark:border-slate-900 flex items-center justify-center z-10 transition-colors ${
                      isCompleted ? 'bg-green-500 shadow-sm' : 
                      isCurrent ? 'bg-blue-600 shadow-md scale-110' : 'bg-slate-200 dark:bg-slate-700'
                    }`}>
                       {isCompleted && <div className="w-2.5 h-1.5 border-l-2 border-b-2 border-white -mt-0.5 -rotate-45"></div>}
                       {isCurrent && <div className="w-2.5 h-2.5 bg-white rounded-full animate-pulse"></div>}
                    </div>
                    
                    <div className={`${isCurrent ? 'opacity-100' : isCompleted ? 'opacity-80' : 'opacity-50'}`}>
                      <p className={`text-sm font-bold ${isCurrent ? 'text-blue-600 dark:text-blue-400' : 'text-slate-800 dark:text-slate-200'}`}>
                        {event.label}
                      </p>
                      {event.time && <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">{event.time}</p>}
                      {event.description && <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 leading-relaxed bg-slate-50 dark:bg-slate-800 p-2 rounded-lg inline-block">{event.description}</p>}
                    </div>
                  </div>
                 );
               })}
            </div>
          </Card>
        </div>

        {/* POD Image if exists */}
        {order.podImage && (
           <div>
             <h3 className="font-bold text-slate-800 dark:text-slate-200 mb-3 flex items-center gap-2 text-base px-1">
                <Upload size={18} className="text-green-500" /> Ảnh POD
             </h3>
             <Card className="!p-0 overflow-hidden">
                <img src={order.podImage} alt="POD" className="w-full h-auto object-cover" />
             </Card>
           </div>
        )}

        {/* Dynamic Action Buttons - FIXED AT BOTTOM */}
        {actionContent && (
           <div className="fixed bottom-[68px] left-0 right-0 max-w-md mx-auto px-4 py-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 z-40 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
               {actionContent}
           </div>
        )}
      </div>
    </div>
  );
};
