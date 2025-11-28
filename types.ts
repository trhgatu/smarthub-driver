
export interface Carrier {
  id: string;
  name: string;
  phone: string;
  address: string;
  logo: string;
}

export interface Driver {
  id: string;
  name: string;
  phone: string;
  email?: string;
  password?: string; // For mock login
  avatar: string;
  cccd?: string;
  dob?: string;
  carrierId?: string; // Linked Carrier
}

export interface Vehicle {
  id: string;
  plateNumber: string;
  type: 'Truck' | 'Container';
  brand: string;
  expiryDate: string;
  carrierId: string; // Owned by
  assignedDriverId?: string | null; // Used by
}

export interface Remooc {
  id: string;
  code: string;
  type: string;
  expiryDate: string;
  carrierId: string; // Owned by
  assignedDriverId?: string | null; // Used by
}

export type OrderStatus = 'Mới' | 'Sẵn sàng' | 'Đã thanh toán' | 'Hạ hàng' | 'Đang vận chuyển' | 'Hoàn tất' | 'Đã hủy';

export interface TimelineEvent {
  id: string;
  label: string;
  time: string; // ISO string or formatted string
  status: 'completed' | 'current' | 'pending';
  description?: string;
}

export interface Customer {
  name: string;
  phone: string;
  address: string;
}

export interface PaymentDetails {
  transportFee: number; // Cước vận chuyển
  liftFee: number;      // Phí nâng hạ
  forbiddenRoadFee: number; // Luật đường cấm
  advance: number;      // Tạm ứng
  totalReal: number;    // Thực nhận
}

export interface Order {
  id: string;
  containerCode: string;
  status: OrderStatus;
  pickupDate: string;
  deliveryDate?: string;
  customer: Customer;
  timeline: TimelineEvent[];
  origin: string;
  destination: string;
  cargoType: string;
  weight: number; // tons
  distance: number; // km (NEW)
  payment: PaymentDetails; // (NEW)
  sealNumber?: string;
  podImage?: string;
  
  // New fields for expanded view
  operationType: string; // Tác nghiệp (Hạ bãi, etc.)
  containerOwner: string; // Chủ container (Line)
  containerSize: string; // Kích cỡ (40HC, 20DC)
  note?: string; // Ghi chú
  services: string[]; // Dịch vụ (Bảo hiểm...)
  qrCodeUrl: string; // URL ảnh QR mock
}

export interface MockDB {
  driver: Driver | null;
  orders: Order[];
  vehicles: Vehicle[];
  remoocs: Remooc[];
  carrier: Carrier | null;
}
