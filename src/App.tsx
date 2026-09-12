import React, { useState } from 'react';
import { useApp } from './context/AppContext';
import { Header } from './components/Header';
import { BottomNavigation } from './components/BottomNavigation';
import { EmergencyModal } from './components/common/EmergencyModal';
import { VideoCallModal } from './components/common/VideoCallModal';

// Auth views
import { LoginView } from './views/auth/LoginView';
import { RegisterView } from './views/auth/RegisterView';

// Patient views
import { PatientHomeView } from './views/patient/PatientHomeView';
import { DoctorDetailView } from './views/patient/DoctorDetailView';
import { PatientAppointmentsView } from './views/patient/PatientAppointmentsView';
import { PatientMessagesView } from './views/patient/PatientMessagesView';
import { PatientMedicalRecordView } from './views/patient/PatientMedicalRecordView';
import { PatientVaccinationView } from './views/patient/PatientVaccinationView';
import { PatientPharmacyView } from './views/patient/PatientPharmacyView';
import { PatientProfileView } from './views/patient/PatientProfileView';

// Doctor views
import { DoctorHomeView } from './views/doctor/DoctorHomeView';
import { DoctorPatientsView } from './views/doctor/DoctorPatientsView';
import { DoctorRequestsView } from './views/doctor/DoctorRequestsView';
import { DoctorProfileView } from './views/doctor/DoctorProfileView';

// Admin views
import { AdminDashboardView } from './views/admin/AdminDashboardView';

export function App() {
  const {
    currentUser,
    activeTab,
    setActiveTab,
    selectedDoctorForBooking,
    setSelectedDoctorForBooking,
  } = useApp();

  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);
  const [patientSubScreen, setPatientSubScreen] = useState<'none' | 'vaccines' | 'pharmacy'>('none');

  // If user is not logged in, render Auth flow
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-[#FDFCF8] flex flex-col justify-center">
        {authMode === 'login' ? (
          <LoginView onSwitchToRegister={() => setAuthMode('register')} />
        ) : (
          <RegisterView onSwitchToLogin={() => setAuthMode('login')} />
        )}
      </div>
    );
  }

  // Render view based on role and tab
  const renderContent = () => {
    // PATIENT ROLE
    if (currentUser.role === 'patient') {
      // Subscreens
      if (selectedDoctorForBooking) {
        return (
          <DoctorDetailView
            doctor={selectedDoctorForBooking}
            onBack={() => setSelectedDoctorForBooking(null)}
            onBookingComplete={() => {
              setSelectedDoctorForBooking(null);
              setActiveTab(1); // switch to appointments tab
            }}
          />
        );
      }

      if (patientSubScreen === 'vaccines') {
        return (
          <div className="space-y-4">
            <button
              onClick={() => setPatientSubScreen('none')}
              className="text-xs font-semibold text-[#2D9CDB] hover:underline"
            >
              ← Retour à l'accueil
            </button>
            <PatientVaccinationView />
          </div>
        );
      }

      if (patientSubScreen === 'pharmacy') {
        return (
          <div className="space-y-4">
            <button
              onClick={() => setPatientSubScreen('none')}
              className="text-xs font-semibold text-[#2D9CDB] hover:underline"
            >
              ← Retour à l'accueil
            </button>
            <PatientPharmacyView />
          </div>
        );
      }

      // Main tabs
      switch (activeTab) {
        case 0:
          return (
            <PatientHomeView
              onSelectDoctor={(doc) => setSelectedDoctorForBooking(doc)}
              onOpenAppointments={() => setActiveTab(1)}
              onOpenMedicalRecord={() => setActiveTab(3)}
              onOpenVaccines={() => setPatientSubScreen('vaccines')}
              onOpenPharmacy={() => setPatientSubScreen('pharmacy')}
              onOpenEmergency={() => setShowEmergencyModal(true)}
            />
          );
        case 1:
          return (
            <PatientAppointmentsView
              onBookNew={() => {
                setActiveTab(0);
                window.scrollTo({ top: 500, behavior: 'smooth' });
              }}
            />
          );
        case 2:
          return <PatientMessagesView />;
        case 3:
          return <PatientMedicalRecordView />;
        case 4:
          return <PatientProfileView />;
        default:
          return null;
      }
    }

    // DOCTOR ROLE
    if (currentUser.role === 'doctor') {
      switch (activeTab) {
        case 0:
          return (
            <DoctorHomeView
              onOpenAppointments={() => setActiveTab(1)}
              onOpenRequests={() => setActiveTab(1)}
              onOpenPatients={() => setActiveTab(3)}
            />
          );
        case 1:
          return (
            <div className="space-y-8">
              <DoctorRequestsView />
              <div className="pt-6 border-t border-[#EDF2F7]">
                <PatientAppointmentsView onBookNew={() => setActiveTab(0)} />
              </div>
            </div>
          );
        case 2:
          return <PatientMessagesView />;
        case 3:
          return <DoctorPatientsView />;
        case 4:
          return <DoctorProfileView />;
        default:
          return null;
      }
    }

    // ADMIN ROLE
    if (currentUser.role === 'admin') {
      switch (activeTab) {
        case 0:
        case 1:
          return <AdminDashboardView />;
        case 2:
          return <PatientProfileView />;
        default:
          return <AdminDashboardView />;
      }
    }

    return null;
  };

  return (
    <div className="min-h-screen bg-[#FDFCF8] flex flex-col font-sans text-[#1A365D]">
      {/* Top Header */}
      <Header onOpenEmergency={() => setShowEmergencyModal(true)} />

      {/* Main Content Area */}
      <main className="flex-1 max-w-5xl w-full mx-auto p-4 sm:p-6 pb-24">
        {renderContent()}
      </main>

      {/* Bottom Navigation */}
      <BottomNavigation
        currentTab={activeTab}
        onSelectTab={(idx) => {
          setSelectedDoctorForBooking(null);
          setPatientSubScreen('none');
          setActiveTab(idx);
        }}
      />

      {/* Emergency Modal */}
      <EmergencyModal
        isOpen={showEmergencyModal}
        onClose={() => setShowEmergencyModal(false)}
      />

      {/* Real-time Video Call Overlay */}
      <VideoCallModal />
    </div>
  );
}

export default App;
