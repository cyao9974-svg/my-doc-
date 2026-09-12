import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  UserModel,
  UserRole,
  DoctorModel,
  AppointmentModel,
  AppointmentStatus,
  TreatingDoctorRequest,
  CmuCard,
  HealthMetric,
  MedicalRecord,
  VaccineRecord,
  PharmacyPrescription,
  ChatMessage,
} from '../types';
import {
  initialUsers,
  initialDoctors,
  initialAppointments,
  initialTreatingRequests,
  initialCmuCard,
  initialHealthMetrics,
  initialMedicalRecords,
  initialVaccines,
  initialPrescriptions,
  initialMessages,
} from '../data/mockData';

interface VideoCallSession {
  appointment: AppointmentModel;
  isDoctor: boolean;
}

interface AppContextType {
  currentUser: UserModel | null;
  users: UserModel[];
  doctors: DoctorModel[];
  appointments: AppointmentModel[];
  treatingRequests: TreatingDoctorRequest[];
  messages: Record<string, ChatMessage[]>;
  cmuCard: CmuCard;
  healthMetrics: HealthMetric[];
  medicalRecords: MedicalRecord[];
  vaccines: VaccineRecord[];
  prescriptions: PharmacyPrescription[];
  activeVideoCall: VideoCallSession | null;
  systemSettings: {
    messageQuota: number;
    manualDoctorApproval: boolean;
  };
  activeTab: number;
  setActiveTab: (tab: number) => void;
  selectedDoctorForBooking: DoctorModel | null;
  setSelectedDoctorForBooking: (doc: DoctorModel | null) => void;

  // Actions
  login: (identifier: string, role: UserRole) => boolean;
  logout: () => void;
  quickSwitchUser: (role: UserRole) => void;
  registerPatient: (data: Partial<UserModel>) => void;
  registerDoctor: (data: Partial<DoctorModel> & { password?: string }) => void;
  bookAppointment: (aptData: Omit<AppointmentModel, 'id' | 'createdAt'>) => AppointmentModel;
  updateAppointmentStatus: (id: string, status: AppointmentStatus) => void;
  payAppointment: (id: string, paymentMethod: string, paymentRef: string) => void;
  requestTreatingDoctor: (doctorId: string, message: string, paymentMethod: string) => void;
  respondTreatingRequest: (requestId: string, accept: boolean, reason?: string) => void;
  sendMessage: (conversationId: string, content: string) => void;
  addHealthMetric: (metric: Omit<HealthMetric, 'id'>) => void;
  addMedicalRecord: (record: Omit<MedicalRecord, 'id' | 'createdAt'>) => void;
  addVaccine: (vaccine: Omit<VaccineRecord, 'id'>) => void;
  updateCmuCard: (data: Partial<CmuCard>) => void;
  updateUserProfile: (data: Partial<UserModel>) => void;
  verifyDoctor: (doctorId: string, isVerified: boolean) => void;
  toggleUserStatus: (userId: string) => void;
  updateSystemSettings: (settings: { messageQuota?: number; manualDoctorApproval?: boolean }) => void;
  startVideoCall: (appointment: AppointmentModel, isDoctor: boolean) => void;
  endVideoCall: () => void;
  resetDemoData: () => void;
  payPrescription: (prescriptionId: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserModel | null>(() => {
    const saved = localStorage.getItem('md_current_user');
    return saved ? JSON.parse(saved) : initialUsers[0]; // Default: Jean-Marc Kouassi (Patient)
  });

  const [users, setUsers] = useState<UserModel[]>(() => {
    const saved = localStorage.getItem('md_users');
    return saved ? JSON.parse(saved) : initialUsers;
  });

  const [doctors, setDoctors] = useState<DoctorModel[]>(() => {
    const saved = localStorage.getItem('md_doctors');
    return saved ? JSON.parse(saved) : initialDoctors;
  });

  const [appointments, setAppointments] = useState<AppointmentModel[]>(() => {
    const saved = localStorage.getItem('md_appointments');
    return saved ? JSON.parse(saved) : initialAppointments;
  });

  const [treatingRequests, setTreatingRequests] = useState<TreatingDoctorRequest[]>(() => {
    const saved = localStorage.getItem('md_treating_requests');
    return saved ? JSON.parse(saved) : initialTreatingRequests;
  });

  const [messages, setMessages] = useState<Record<string, ChatMessage[]>>(() => {
    const saved = localStorage.getItem('md_messages');
    return saved ? JSON.parse(saved) : initialMessages;
  });

  const [cmuCard, setCmuCard] = useState<CmuCard>(() => {
    const saved = localStorage.getItem('md_cmu_card');
    return saved ? JSON.parse(saved) : initialCmuCard;
  });

  const [healthMetrics, setHealthMetrics] = useState<HealthMetric[]>(() => {
    const saved = localStorage.getItem('md_health_metrics');
    return saved ? JSON.parse(saved) : initialHealthMetrics;
  });

  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>(() => {
    const saved = localStorage.getItem('md_medical_records');
    return saved ? JSON.parse(saved) : initialMedicalRecords;
  });

  const [vaccines, setVaccines] = useState<VaccineRecord[]>(() => {
    const saved = localStorage.getItem('md_vaccines');
    return saved ? JSON.parse(saved) : initialVaccines;
  });

  const [prescriptions, setPrescriptions] = useState<PharmacyPrescription[]>(() => {
    const saved = localStorage.getItem('md_prescriptions');
    return saved ? JSON.parse(saved) : initialPrescriptions;
  });

  const [systemSettings, setSystemSettings] = useState(() => {
    const saved = localStorage.getItem('md_system_settings');
    return saved ? JSON.parse(saved) : { messageQuota: 15, manualDoctorApproval: true };
  });

  const [activeVideoCall, setActiveVideoCall] = useState<VideoCallSession | null>(null);
  const [activeTab, setActiveTab] = useState<number>(0);
  const [selectedDoctorForBooking, setSelectedDoctorForBooking] = useState<DoctorModel | null>(null);

  // Persistence effects
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('md_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('md_current_user');
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('md_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('md_doctors', JSON.stringify(doctors));
  }, [doctors]);

  useEffect(() => {
    localStorage.setItem('md_appointments', JSON.stringify(appointments));
  }, [appointments]);

  useEffect(() => {
    localStorage.setItem('md_treating_requests', JSON.stringify(treatingRequests));
  }, [treatingRequests]);

  useEffect(() => {
    localStorage.setItem('md_messages', JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    localStorage.setItem('md_cmu_card', JSON.stringify(cmuCard));
  }, [cmuCard]);

  useEffect(() => {
    localStorage.setItem('md_health_metrics', JSON.stringify(healthMetrics));
  }, [healthMetrics]);

  useEffect(() => {
    localStorage.setItem('md_medical_records', JSON.stringify(medicalRecords));
  }, [medicalRecords]);

  useEffect(() => {
    localStorage.setItem('md_vaccines', JSON.stringify(vaccines));
  }, [vaccines]);

  useEffect(() => {
    localStorage.setItem('md_prescriptions', JSON.stringify(prescriptions));
  }, [prescriptions]);

  useEffect(() => {
    localStorage.setItem('md_system_settings', JSON.stringify(systemSettings));
  }, [systemSettings]);

  const login = (identifier: string, role: UserRole) => {
    const found = users.find(
      (u) =>
        u.role === role &&
        (u.email.toLowerCase() === identifier.toLowerCase() ||
          u.phone.replace(/\s+/g, '').includes(identifier.replace(/\s+/g, '')) ||
          u.firstName.toLowerCase().includes(identifier.toLowerCase()))
    );
    if (found) {
      setCurrentUser(found);
      setActiveTab(0);
      return true;
    }
    // Fallback: match first with role
    const fallback = users.find((u) => u.role === role);
    if (fallback) {
      setCurrentUser(fallback);
      setActiveTab(0);
      return true;
    }
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
    setActiveTab(0);
    setSelectedDoctorForBooking(null);
  };

  const quickSwitchUser = (role: UserRole) => {
    const target = users.find((u) => u.role === role);
    if (target) {
      setCurrentUser(target);
      setActiveTab(0);
      setSelectedDoctorForBooking(null);
    }
  };

  const registerPatient = (data: Partial<UserModel>) => {
    const newUser: UserModel = {
      id: `user_p_${Date.now()}`,
      firstName: data.firstName || 'Nouveau',
      lastName: data.lastName || 'Patient',
      email: data.email || `patient_${Date.now()}@example.ci`,
      phone: data.phone || '+225 00 00 00 00',
      role: 'patient',
      status: 'active',
      is2FAEnabled: true,
      isEmailVerified: true,
      isPhoneVerified: true,
      createdAt: new Date().toISOString(),
      cmuNumber: data.cmuNumber || '10' + Math.floor(10000000 + Math.random() * 90000000),
      commune: data.commune || 'Abidjan',
      city: data.city || 'Abidjan',
      gender: data.gender || 'M',
      profession: data.profession || 'Particulier',
    };
    setUsers((prev) => [newUser, ...prev]);
    setCurrentUser(newUser);
    setActiveTab(0);
  };

  const registerDoctor = (data: Partial<DoctorModel> & { password?: string }) => {
    const userId = `user_doc_${Date.now()}`;
    const docId = `doc_${Date.now()}`;

    const newUser: UserModel = {
      id: userId,
      firstName: data.firstName || 'Docteur',
      lastName: data.lastName || 'Spécialiste',
      email: data.email || `dr_${Date.now()}@medilink.ci`,
      phone: data.phone || '+225 00 00 00 00',
      role: 'doctor',
      status: systemSettings.manualDoctorApproval ? 'pending' : 'active',
      is2FAEnabled: true,
      isEmailVerified: true,
      isPhoneVerified: true,
      createdAt: new Date().toISOString(),
      city: data.city || 'Abidjan',
    };

    const newDoctor: DoctorModel = {
      id: docId,
      userId,
      firstName: data.firstName || 'Docteur',
      lastName: data.lastName || 'Spécialiste',
      email: data.email || newUser.email,
      phone: data.phone || newUser.phone,
      specialty: data.specialty || 'Médecine Générale',
      orderNumber: data.orderNumber || String(Math.floor(10000 + Math.random() * 90000)),
      bio: data.bio || 'Médecin diplômé engagé pour la santé et le bien-être des patients.',
      avatarUrl: data.avatarUrl || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=200&auto=format&fit=crop&q=80',
      latitude: 5.348,
      longitude: -4.015,
      city: data.city || 'Abidjan',
      rating: 5.0,
      reviewCount: 0,
      patientCount: 0,
      experienceYears: data.experienceYears || 5,
      successRate: 99.0,
      consultationPrice: data.consultationPrice || 15000,
      isAvailable: true,
      isVerified: !systemSettings.manualDoctorApproval,
      isOnline: true,
      availableDays: ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi'],
      availableSlots: {
        Aujourdhui: ['09:00', '10:30', '14:30', '16:00'],
        Demain: ['09:30', '11:00', '15:00'],
      },
      documentUrls: ['diplome.pdf'],
      createdAt: new Date().toISOString(),
      distanceKm: 3.5,
    };

    setUsers((prev) => [newUser, ...prev]);
    setDoctors((prev) => [newDoctor, ...prev]);
    setCurrentUser(newUser);
    setActiveTab(0);
  };

  const bookAppointment = (aptData: Omit<AppointmentModel, 'id' | 'createdAt'>): AppointmentModel => {
    const newApt: AppointmentModel = {
      ...aptData,
      id: `apt_${Date.now()}`,
      createdAt: new Date().toISOString(),
      videoRoomId: aptData.type === 'teleconsultation' ? `room_${Date.now()}` : undefined,
    };
    setAppointments((prev) => [newApt, ...prev]);
    return newApt;
  };

  const updateAppointmentStatus = (id: string, status: AppointmentStatus) => {
    setAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status } : a))
    );
  };

  const payAppointment = (id: string, paymentMethod: string, _paymentRef: string) => {
    setAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, isPaid: true } : a))
    );
  };

  const requestTreatingDoctor = (doctorId: string, message: string, paymentMethod: string) => {
    if (!currentUser) return;
    const doc = doctors.find((d) => d.id === doctorId);
    if (!doc) return;

    const newReq: TreatingDoctorRequest = {
      id: `tr_${Date.now()}`,
      patientId: currentUser.id,
      patientName: `${currentUser.lastName} ${currentUser.firstName}`,
      patientAvatar: currentUser.avatarUrl,
      doctorId: doc.id,
      doctorName: `Dr. ${doc.firstName} ${doc.lastName}`,
      doctorSpecialty: doc.specialty,
      message,
      status: 'pending',
      isPaid: true,
      amount: 750,
      paymentMethod,
      paymentRef: `PAY_${Math.floor(100000 + Math.random() * 900000)}`,
      createdAt: new Date().toISOString(),
    };

    setTreatingRequests((prev) => [newReq, ...prev]);
  };

  const respondTreatingRequest = (requestId: string, accept: boolean, reason?: string) => {
    setTreatingRequests((prev) =>
      prev.map((r) =>
        r.id === requestId
          ? {
              ...r,
              status: accept ? 'accepted' : 'rejected',
              rejectionReason: reason,
              respondedAt: new Date().toISOString(),
            }
          : r
      )
    );
  };

  const sendMessage = (conversationId: string, content: string) => {
    if (!currentUser || !content.trim()) return;

    const newMsg: ChatMessage = {
      id: `msg_${Date.now()}`,
      conversationId,
      senderId: currentUser.id,
      senderName: `${currentUser.lastName} ${currentUser.firstName}`,
      senderRole: currentUser.role === 'doctor' ? 'doctor' : 'patient',
      content: content.trim(),
      timestamp: new Date().toISOString(),
      isRead: false,
    };

    setMessages((prev) => ({
      ...prev,
      [conversationId]: [...(prev[conversationId] || []), newMsg],
    }));
  };

  const addHealthMetric = (metric: Omit<HealthMetric, 'id'>) => {
    const newM: HealthMetric = {
      ...metric,
      id: `hm_${Date.now()}`,
    };
    setHealthMetrics((prev) => [newM, ...prev]);
  };

  const addMedicalRecord = (record: Omit<MedicalRecord, 'id' | 'createdAt'>) => {
    const newRec: MedicalRecord = {
      ...record,
      id: `mr_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setMedicalRecords((prev) => [newRec, ...prev]);
  };

  const addVaccine = (vaccine: Omit<VaccineRecord, 'id'>) => {
    const newV: VaccineRecord = {
      ...vaccine,
      id: `vac_${Date.now()}`,
    };
    setVaccines((prev) => [newV, ...prev]);
  };

  const updateCmuCard = (data: Partial<CmuCard>) => {
    setCmuCard((prev) => ({ ...prev, ...data }));
  };

  const updateUserProfile = (data: Partial<UserModel>) => {
    if (!currentUser) return;
    const updated = { ...currentUser, ...data };
    setCurrentUser(updated);
    setUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
  };

  const verifyDoctor = (doctorId: string, isVerified: boolean) => {
    setDoctors((prev) =>
      prev.map((d) => (d.id === doctorId ? { ...d, isVerified } : d))
    );
  };

  const toggleUserStatus = (userId: string) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          const newStatus = u.status === 'active' ? 'suspended' : 'active';
          return { ...u, status: newStatus };
        }
        return u;
      })
    );
  };

  const updateSystemSettings = (settings: { messageQuota?: number; manualDoctorApproval?: boolean }) => {
    setSystemSettings((prev: any) => ({ ...prev, ...settings }));
  };

  const startVideoCall = (appointment: AppointmentModel, isDoctor: boolean) => {
    setActiveVideoCall({ appointment, isDoctor });
  };

  const endVideoCall = () => {
    setActiveVideoCall(null);
  };

  const payPrescription = (prescriptionId: string) => {
    setPrescriptions((prev) =>
      prev.map((p) => (p.id === prescriptionId ? { ...p, status: 'paid' } : p))
    );
  };

  const resetDemoData = () => {
    localStorage.clear();
    setUsers(initialUsers);
    setDoctors(initialDoctors);
    setAppointments(initialAppointments);
    setTreatingRequests(initialTreatingRequests);
    setMessages(initialMessages);
    setCmuCard(initialCmuCard);
    setHealthMetrics(initialHealthMetrics);
    setMedicalRecords(initialMedicalRecords);
    setVaccines(initialVaccines);
    setPrescriptions(initialPrescriptions);
    setSystemSettings({ messageQuota: 15, manualDoctorApproval: true });
    setCurrentUser(initialUsers[0]);
    setActiveTab(0);
    setSelectedDoctorForBooking(null);
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        users,
        doctors,
        appointments,
        treatingRequests,
        messages,
        cmuCard,
        healthMetrics,
        medicalRecords,
        vaccines,
        prescriptions,
        activeVideoCall,
        systemSettings,
        activeTab,
        setActiveTab,
        selectedDoctorForBooking,
        setSelectedDoctorForBooking,
        login,
        logout,
        quickSwitchUser,
        registerPatient,
        registerDoctor,
        bookAppointment,
        updateAppointmentStatus,
        payAppointment,
        requestTreatingDoctor,
        respondTreatingRequest,
        sendMessage,
        addHealthMetric,
        addMedicalRecord,
        addVaccine,
        updateCmuCard,
        updateUserProfile,
        verifyDoctor,
        toggleUserStatus,
        updateSystemSettings,
        startVideoCall,
        endVideoCall,
        resetDemoData,
        payPrescription,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
