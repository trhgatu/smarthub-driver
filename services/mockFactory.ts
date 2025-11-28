
import { Order, TimelineEvent, Vehicle, Remooc, Driver, OrderStatus, Carrier } from '../types';

// Utils
const randomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
const randomChoice = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

// ONLY "Hạ bãi chờ xuất" as requested
export const OPERATION_TYPES = ["Hạ bãi chờ xuất"];

// Generators
const generateContainerCode = (): string => {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let code = "";
  for (let i = 0; i < 4; i++) code += letters.charAt(randomInt(0, 25));
  for (let i = 0; i < 7; i++) code += randomInt(0, 9);
  return code;
};

const generateOrderId = (): string => {
  const datePart = new Date().toISOString().slice(2, 10).replace(/-/g, ''); // YYMMDD
  const randomPart = Math.floor(Math.random() * 10000000000).toString().slice(0, 5);
  return `SLT${datePart}${randomPart}`;
};

const generateDate = (offsetDays: number = 0, hour?: number): string => {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  // Random time or specific if needed
  d.setHours(hour !== undefined ? hour : randomInt(7, 20), randomInt(0, 59));
  // Use a consistent format for parsing later if needed, but keeping display friendly
  // For filter logic, we will assume this format: DD/MM/YYYY
  const day = d.getDate().toString().padStart(2, '0');
  const month = (d.getMonth() + 1).toString().padStart(2, '0');
  const year = d.getFullYear();
  const time = d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
  return `${day}/${month}/${year} ${time}`;
};

// Mock Data Creation
export const createMockTimeline = (status: OrderStatus): TimelineEvent[] => {
  const isCompleted = status === 'Hoàn tất';
  // Simplified logic: modify status based on order status
  
  const events: TimelineEvent[] = [
    { id: '1', label: "Khởi tạo đơn hàng", time: generateDate(isCompleted ? -3 : -2, 8), status: 'completed', description: "Đơn hàng đã được tạo trên hệ thống" },
    { id: '2', label: "Nhà xe nhận đơn", time: generateDate(isCompleted ? -3 : -2, 10), status: 'completed', description: "Điều phối viên đã tiếp nhận" },
    { id: '3', label: "Tài xế nhận đơn", time: generateDate(isCompleted ? -2 : -1, 14), status: status === 'Mới' || status === 'Sẵn sàng' || status === 'Đã thanh toán' ? 'current' : 'completed', description: "Bạn đã nhận đơn hàng này" },
    { id: '4', label: "Tài xế di chuyển", time: generateDate(isCompleted ? -1 : 0), status: isCompleted ? 'completed' : (status === 'Đang vận chuyển' ? 'current' : 'pending'), description: "Xe đang di chuyển đến kho khách hàng" },
    { id: '5', label: "Hoàn tất", time: isCompleted ? generateDate(0, 9) : "", status: isCompleted ? 'completed' : 'pending', description: "Đã giao hàng và ký nhận" },
  ];
  return events;
};

export const createMockOrders = (count: number, type: 'active' | 'completed'): Order[] => {
  const orders: Order[] = [];
  const customers = [
    { name: "CÔNG TY TNHH XNK HÒA PHÁT", phone: "+84987654321", address: "KCN Sóng Thần, Bình Dương" },
    { name: "CTY LOGISTICS VIETNAM", phone: "+84912345678", address: "Cảng Cát Lái, TP.HCM" },
    { name: "TẬP ĐOÀN THÉP VIỆT", phone: "+84909090909", address: "KCN Nhơn Trạch, Đồng Nai" }
  ];

  for (let i = 0; i < count; i++) {
    let status: OrderStatus;
    
    if (type === 'completed') {
      status = 'Hoàn tất';
    } else {
      // FORCE ALL ACTIVE ORDERS TO BE 'PAID'
      status = 'Đã thanh toán';
    }

    const isComplete = status === 'Hoàn tất';
    const containerOwners = ["Hapag-Lloyd", "Maersk Line", "COSCO", "Evergreen", "MSC"];
    const sizes = ["40HC", "20DC", "40DC", "45HC"];
    
    // Calculate financial mocks
    const distance = randomInt(15, 450);
    const transportFee = Math.round((distance * 18000) / 1000) * 1000; // ~18k/km
    const liftFee = Math.random() > 0.5 ? 450000 : 0;
    const forbiddenRoadFee = Math.random() > 0.8 ? 200000 : 0;
    const advance = Math.floor((transportFee + liftFee) * 0.3 / 1000) * 1000; // 30% advance rounded
    const totalReal = transportFee + liftFee + forbiddenRoadFee - advance;

    orders.push({
      id: generateOrderId(),
      containerCode: generateContainerCode(),
      status: status,
      pickupDate: generateDate(isComplete ? -3 : 0),
      deliveryDate: isComplete ? generateDate(0) : undefined,
      customer: randomChoice(customers),
      timeline: createMockTimeline(status),
      origin: randomChoice(["Cảng Cát Lái", "ICD Phước Long", "Cảng VICT"]),
      destination: randomChoice(["KCN Vsip 1", "Kho Ngoại Quan", "KCN Amata", "KCN Mỹ Phước 3"]),
      cargoType: randomChoice(["Hàng khô", "Hàng lạnh", "Hàng rời"]),
      weight: randomInt(15, 30),
      
      // New mock fields
      distance: distance,
      payment: {
        transportFee,
        liftFee,
        forbiddenRoadFee,
        advance,
        totalReal
      },

      operationType: randomChoice(OPERATION_TYPES), 
      containerOwner: randomChoice(containerOwners),
      containerSize: randomChoice(sizes),
      qrCodeUrl: "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=SMARTHUB-DRIVER-MOCK",
      note: Math.random() > 0.5 ? "Hàng dễ vỡ, vui lòng nhẹ tay khi nâng hạ." : "",
      services: ["Bảo hiểm thân vỏ container"]
    });
  }
  return orders;
};

// Carrier Data
export const mockCarrier: Carrier = {
  id: "C001",
  name: "SmartHub Logistics",
  address: "123 Xa Lộ Hà Nội, TP. Thủ Đức, TP.HCM",
  phone: "028 3899 9999",
  logo: "https://images.unsplash.com/photo-1560179707-f14e90ef3dab?w=100&h=100&fit=crop"
};

// Vehicles Pool
export const initialVehicles: Vehicle[] = [
  { id: 'V001', plateNumber: '51C-123.45', brand: 'HINO', type: 'Container', expiryDate: '2026-05-20', carrierId: 'C001', assignedDriverId: 'DRV001' },
  { id: 'V002', plateNumber: '50H-999.99', brand: 'HYUNDAI', type: 'Container', expiryDate: '2025-12-10', carrierId: 'C001', assignedDriverId: null }, // Available
  { id: 'V003', plateNumber: '60C-567.89', brand: 'ISUZU', type: 'Container', expiryDate: '2025-10-15', carrierId: 'C001', assignedDriverId: 'DRV_OTHER' }, // Busy
  { id: 'V004', plateNumber: '61C-444.22', brand: 'DAEWOO', type: 'Container', expiryDate: '2026-01-01', carrierId: 'C001', assignedDriverId: null },
  { id: 'V005', plateNumber: '29C-111.11', brand: 'THACO', type: 'Container', expiryDate: '2025-08-20', carrierId: 'C001', assignedDriverId: 'DRV_OTHER' },
];

export const initialRemoocs: Remooc[] = [
  { id: 'R001', code: 'RM-5555', type: 'Sàn 40 feet', expiryDate: '2026-01-15', carrierId: 'C001', assignedDriverId: 'DRV001' },
  { id: 'R002', code: 'RM-8888', type: 'Xương 20 feet', expiryDate: '2025-11-20', carrierId: 'C001', assignedDriverId: null },
  { id: 'R003', code: 'RM-7777', type: 'Sàn 40 feet', expiryDate: '2025-09-05', carrierId: 'C001', assignedDriverId: 'DRV_OTHER' },
  { id: 'R004', code: 'RM-3333', type: 'Xương 40 feet', expiryDate: '2026-03-30', carrierId: 'C001', assignedDriverId: null },
  { id: 'R005', code: 'RM-1212', type: 'Cổ cò 40 feet', expiryDate: '2025-12-25', carrierId: 'C001', assignedDriverId: null },
];

export const defaultDriver: Driver = {
  id: "DRV001",
  name: "Nguyen Hoang Duy",
  phone: "0942322454",
  password: "123", // Simplified for mock
  email: "duynguyen2454@gmail.com",
  avatar: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=400&h=400&fit=crop",
  cccd: "079090000001",
  dob: "1990-01-01",
  carrierId: "C001"
};
