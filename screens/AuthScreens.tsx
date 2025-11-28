import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGlobalState } from '../context/GlobalState';
import { Button, Input } from '../components/Shared';
import { Phone, Lock, User, Upload, ShieldCheck, Mail, Truck, Calendar, CreditCard, CheckCircle2 } from 'lucide-react';

// --- Splash Screen ---
export const SplashScreen: React.FC = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/login');
    }, 2500);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-blue-600 flex flex-col items-center justify-center text-white relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full translate-x-1/3 translate-y-1/3"></div>

      <div className="z-10 flex flex-col items-center animate-fade-in-up">
        <div className="w-28 h-28 bg-white rounded-3xl flex items-center justify-center mb-8 shadow-2xl shadow-blue-900/20 transform -rotate-6">
          <Truck size={56} className="text-blue-600" strokeWidth={1.5} />
        </div>
        <h1 className="text-4xl font-black mb-2 tracking-tight">SmartHub</h1>
        <div className="flex items-center gap-2 bg-blue-500/50 px-3 py-1 rounded-full backdrop-blur-sm">
           <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
           <p className="text-blue-50 text-xs font-bold tracking-widest uppercase">Driver Partner</p>
        </div>
      </div>
      
      <div className="absolute bottom-12 w-full px-10">
         <div className="w-full h-1.5 bg-blue-800/50 rounded-full overflow-hidden">
            <div className="h-full bg-white w-2/3 animate-[pulse_2s_infinite]"></div>
         </div>
         <p className="text-center text-blue-300/80 text-[10px] mt-4 font-medium uppercase tracking-wider">Phiên bản 1.0.0 Mock</p>
      </div>
    </div>
  );
};

// --- Login Screen ---
export const LoginScreen: React.FC = () => {
  const [method, setMethod] = useState<'otp' | 'password'>('password');
  const [phone, setPhone] = useState('');
  const [passOrOtp, setPassOrOtp] = useState('');
  const [error, setError] = useState('');
  const [step, setStep] = useState<1 | 2>(1); // For OTP flow
  const { login } = useGlobalState();
  const navigate = useNavigate();

  const handleLogin = async () => {
    setError('');
    if (!phone) return setError("Vui lòng nhập số điện thoại");
    
    // For OTP flow step 1
    if (method === 'otp' && step === 1) {
       // Mock Requirement: Exact 10 digits
       const phoneRegex = /^\d{10}$/;
       if (!phoneRegex.test(phone)) return setError("Vui lòng nhập đúng 10 số điện thoại");
       
       // Mock sending OTP
       setStep(2);
       // Show alert as mock notification
       alert("MOCK OTP: 123456");
       return;
    }

    if (!passOrOtp) return setError(method === 'otp' ? "Nhập mã OTP" : "Nhập mật khẩu");

    const success = await login(phone, passOrOtp, method);
    if (success) {
      navigate('/app/dashboard', { replace: true });
    } else {
      setError(method === 'otp' ? "Mã OTP sai (thử 123456)" : "Sai số điện thoại hoặc mật khẩu (thử 0942322454 / 123)");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col transition-colors">
      {/* Modern Header */}
      <div className="bg-blue-600 pt-16 pb-24 px-8 relative overflow-hidden">
         <div className="absolute top-[-50px] right-[-50px] w-64 h-64 bg-white/5 rounded-full pointer-events-none"></div>
         <div className="absolute bottom-[20px] left-[-20px] w-32 h-32 bg-white/5 rounded-full pointer-events-none"></div>

         <div className="relative z-10">
            <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mb-6 text-white backdrop-blur-md border border-white/20">
                <Truck size={32} strokeWidth={2} />
            </div>
            <h2 className="text-4xl font-bold text-white mb-3 leading-tight tracking-tight">Xin chào, <br/>Bác tài!</h2>
            <p className="text-blue-100 font-medium text-base opacity-90">Sẵn sàng cho chuyến đi mới?</p>
         </div>
      </div>

      <div className="flex-1 px-4 -mt-12 relative z-20 pb-8">
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-100 dark:border-slate-800 shadow-xl shadow-blue-900/5 dark:shadow-none transition-colors">
           {/* Tabs Segmented Control */}
           <div className="flex bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl mb-8 relative transition-colors">
             <div className={`absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] bg-white dark:bg-slate-700 rounded-xl shadow-sm transition-transform duration-300 ease-out ${method === 'otp' ? 'translate-x-full left-1.5' : 'left-1.5'}`}></div>
             <button 
                onClick={() => { setMethod('password'); setStep(1); setError(''); }}
                className={`flex-1 py-2.5 rounded-xl text-sm font-bold z-10 transition-colors ${method === 'password' ? 'text-blue-700 dark:text-blue-400' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'}`}
             >
               Mật khẩu
             </button>
             <button 
                onClick={() => { setMethod('otp'); setStep(1); setError(''); }}
                className={`flex-1 py-2.5 rounded-xl text-sm font-bold z-10 transition-colors ${method === 'otp' ? 'text-blue-700 dark:text-blue-400' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'}`}
             >
               OTP SMS
             </button>
           </div>

           <div className="space-y-2">
             <Input 
                label="Số điện thoại" 
                placeholder="09xx xxx xxx" 
                icon={<Phone size={20} />} 
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                disabled={step === 2 && method === 'otp'}
                type="tel"
                className="mb-4"
             />
             
             {(method === 'password' || step === 2) && (
               <Input 
                  label={method === 'password' ? "Mật khẩu" : "Nhập mã OTP"}
                  type={method === 'password' ? "password" : "text"}
                  placeholder={method === 'password' ? "••••••" : "6 số OTP từ tin nhắn"}
                  icon={method === 'password' ? <Lock size={20} /> : <ShieldCheck size={20} />}
                  value={passOrOtp}
                  onChange={(e) => setPassOrOtp(e.target.value)}
                  className="mb-4"
               />
             )}

             {error && (
               <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm font-medium rounded-xl flex items-start gap-3 border border-red-100 dark:border-red-900/30 animate-shake">
                 <div className="mt-0.5"><CheckCircle2 size={16} className="text-red-500 dark:text-red-400 rotate-45"/></div>
                 {error}
               </div>
             )}

             <div className="pt-4">
               <Button fullWidth onClick={handleLogin} size="lg" className="shadow-lg shadow-blue-200 dark:shadow-none">
                 {method === 'otp' && step === 1 ? 'Gửi mã xác thực' : 'Đăng Nhập'}
               </Button>
             </div>
           </div>
           
           <div className="mt-10 text-center border-t border-slate-50 dark:border-slate-800 pt-6">
             <p className="text-slate-400 text-sm font-medium mb-3">Bạn chưa có tài khoản?</p>
             <button onClick={() => navigate('/register')} className="text-blue-600 font-bold text-sm bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400 px-6 py-3 rounded-xl hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors">
               Đăng ký đối tác mới
             </button>
           </div>
        </div>
      </div>
    </div>
  );
};

// --- Register Screen ---
export const RegisterScreen: React.FC = () => {
  const navigate = useNavigate();
  const { register } = useGlobalState();
  const [form, setForm] = useState({ phone: '', name: '', password: '', email: '', cccd: '', dob: '' });
  const [avatar, setAvatar] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!form.phone || !form.name || !form.password) return alert("Vui lòng điền đầy đủ thông tin bắt buộc");
    
    await register({
      ...form,
      avatar: avatar || "mock://avatar.jpg"
    });
    
    navigate('/app/dashboard');
  };

  const handleMockUpload = () => {
    // Mock upload action
    setAvatar("https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=400&h=400&fit=crop");
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 flex flex-col transition-colors">
       <div className="sticky top-0 z-10 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 px-4 flex items-center h-14">
          <button onClick={() => navigate(-1)} className="w-10 h-10 flex items-center justify-center rounded-full text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900 mr-2">
             <div className="text-2xl pb-1">←</div>
          </button>
          <h1 className="text-lg font-bold text-slate-800 dark:text-white">Đăng ký đối tác</h1>
       </div>

       <div className="p-6 pb-12 space-y-8">
          {/* Avatar Upload */}
          <div className="flex flex-col items-center">
             <div 
               onClick={handleMockUpload}
               className="w-28 h-28 rounded-full bg-slate-50 dark:bg-slate-900 border-2 border-dashed border-slate-300 dark:border-slate-700 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-all relative overflow-hidden group"
             >
               {avatar ? (
                 <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
               ) : (
                 <>
                   <div className="w-10 h-10 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center shadow-sm mb-2 group-hover:scale-110 transition-transform">
                      <Upload size={20} className="text-blue-500" />
                   </div>
                   <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Tải ảnh lên</span>
                 </>
               )}
             </div>
             <p className="text-xs text-slate-400 mt-3 font-medium">Chạm để tải ảnh đại diện rõ mặt</p>
          </div>

          <div className="space-y-1">
             <Input 
               label="Họ và tên" 
               placeholder="NGUYEN VAN A" 
               icon={<User size={20}/>}
               value={form.name}
               onChange={e => setForm({...form, name: e.target.value})}
             />
             <Input 
               label="Số điện thoại" 
               placeholder="09xx xxx xxx" 
               type="tel"
               icon={<Phone size={20}/>}
               value={form.phone}
               onChange={e => setForm({...form, phone: e.target.value})}
             />
             <Input 
               label="Mật khẩu" 
               type="password" 
               placeholder="••••••" 
               icon={<Lock size={20}/>}
               value={form.password}
               onChange={e => setForm({...form, password: e.target.value})}
             />
             
             <div className="grid grid-cols-2 gap-4">
                <Input 
                   label="CCCD/CMND" 
                   placeholder="12 số" 
                   icon={<CreditCard size={20}/>}
                   value={form.cccd}
                   onChange={e => setForm({...form, cccd: e.target.value})}
                />
                <Input 
                   label="Ngày sinh" 
                   type="date"
                   icon={<Calendar size={20}/>}
                   value={form.dob}
                   onChange={e => setForm({...form, dob: e.target.value})}
                />
             </div>
             
             <Input 
               label="Email (Tùy chọn)" 
               type="email" 
               placeholder="email@example.com" 
               icon={<Mail size={20}/>}
               value={form.email}
               onChange={e => setForm({...form, email: e.target.value})}
             />
          </div>

          <div className="pt-2">
            <Button fullWidth size="lg" onClick={handleSubmit}>Hoàn tất đăng ký</Button>
          </div>
          
          <p className="text-center text-xs text-slate-400 px-6 leading-relaxed">
            Bằng việc đăng ký, bạn đồng ý với <span className="text-blue-600 font-bold cursor-pointer">Điều khoản sử dụng</span> và <span className="text-blue-600 font-bold cursor-pointer">Chính sách bảo mật</span> của SmartHub.
          </p>
       </div>
    </div>
  );
};