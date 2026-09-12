export type UserRole = 'patient' | 'doctor' | 'admin';
export type AccountStatus = 'pending' | 'active' | 'suspended' | 'rejected';

export interface UserModel {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: UserRole;
  status: AccountStatus;
  avatarUrl?: string;
  avatarBase64?: string;
  is2FAEnabled: boolean;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  createdAt: string;
  lastLoginAt?: string;
  cmuNumber?: string;
  birthDate?: string;
  gender?: string;
  profession?: string;
  commune?: string;
  city?: string;
  idPhotoUrl?: string;
}

export interface DoctorModel {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  specialty: string;
  orderNumber: string; // 5-digit medical order number
  bio?: string;
  avatarUrl?: string;
  avatarBase64?: string;
  latitude: number;
  longitude: number;
  address?: string;
  city: string;
  rating: number;
  reviewCount: number;
  patientCount: number;
  experienceYears: number;
  successRate: number;
  consultationPrice: number;
  isAvailable: boolean;
  isVerified: boolean;
  isOnline: boolean;
  availableDays: string[];
  availableSlots: Record<string, string[]>;
  documentUrls: string[];
  diplomaUrl?: string;
  idCardUrl?: string;
  proCardUrl?: string;
  whatsappNumber?: string;
  createdAt: string;
  distanceKm?: number;
}

export type AppointmentStatus =
  | 'pending'
  | 'confirmed'
  | 'cancelled'
  | 'completed'
  | 'inProgress'
  | 'noShow';

export type AppointmentType = 'inPerson' | 'teleconsultation';

export interface AppointmentModel {
  id: string;
  patientId: string;
  patientName: string;
  patientAvatar?: string;
  doctorId: string;
  doctorName: string;
  doctorSpecialty: string;
  doctorAvatar?: string;
  scheduledAt: string;
  durationMinutes: number;
  status: AppointmentStatus;
  type: AppointmentType;
  reason?: string;
  notes?: string;
  consultationPrice?: number;
  isPaid: boolean;
  hasReminder: boolean;
  reminderAt?: string;
  videoRoomId?: string;
  createdAt: string;
}

export type TreatingDoctorStatus = 'pending' | 'accepted' | 'rejected' | 'cancelled';

export interface TreatingDoctorRequest {
  id: string;
  patientId: string;
  patientName: string;
  patientAvatar?: string;
  doctorId: string;
  doctorName: string;
  doctorSpecialty: string;
  message: string;
  status: TreatingDoctorStatus;
  isPaid: boolean;
  amount: number; // 750 FCFA
  paymentMethod?: string;
  paymentRef?: string;
  rejectionReason?: string;
  createdAt: string;
  respondedAt?: string;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderRole: 'patient' | 'doctor';
  content: string;
  timestamp: string;
  isRead: boolean;
}

export interface CmuCard {
  cmuNumber: string;
  lastName: string;
  firstName: string;
  gender: string;
  profession: string;
  commune: string;
  city: string;
  birthDate: string;
  issueDate: string;
  expiryDate: string;
  photoUrl?: string;
  photoBase64?: string;
  isActive: boolean;
}

export type HealthMetricType =
  | 'bloodPressure'
  | 'bloodSugar'
  | 'heartRate'
  | 'weight'
  | 'temperature'
  | 'oxygenSaturation';

export interface HealthMetric {
  id: string;
  type: HealthMetricType;
  value: number;
  value2?: number; // diastolic for blood pressure
  unit: string;
  recordedAt: string;
  note?: string;
}

export type RecordType =
  | 'consultation'
  | 'prescription'
  | 'labResult'
  | 'imaging'
  | 'vaccination'
  | 'surgery';

export interface MedicalRecord {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  doctorSpecialty: string;
  type: RecordType;
  title: string;
  description?: string;
  diagnosis?: string;
  prescription?: string;
  notes?: string;
  tags: string[];
  isConfidential: boolean;
  consultationDate: string;
  createdAt: string;
}

export interface VaccineRecord {
  id: string;
  disease: string;
  vaccineName: string;
  administeredAt: string;
  batchNumber: string;
  doctorName: string;
  nextDueDate?: string;
  status: 'completed' | 'due' | 'upcoming';
}

export interface PharmacyPrescription {
  id: string;
  prescriptionNumber: string;
  patientName: string;
  doctorName: string;
  doctorSpecialty: string;
  date: string;
  medications: {
    name: string;
    dosage: string;
    duration: string;
    price: number;
  }[];
  totalAmount: number;
  status: 'pending' | 'validated' | 'paid' | 'dispensed';
  pharmacyName?: string;
}
