import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AppointmentCard } from '../../components/common/AppointmentCard';
import { MobileMoneyModal } from '../../components/common/MobileMoneyModal';
import { Calendar, Plus, Filter, Search } from 'lucide-react';
import { AppointmentModel } from '../../types';

interface PatientAppointmentsViewProps {
  onBookNew: () => void;
}

export const PatientAppointmentsView: React.FC<PatientAppointmentsViewProps> = ({ onBookNew }) => {
  const {
    currentUser,
    appointments,
    updateAppointmentStatus,
    payAppointment,
    startVideoCall,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'upcoming' | 'past' | 'all'>('upcoming');
  const [payingApt, setPayingApt] = useState<AppointmentModel | null>(null);

  const myAppointments = appointments.filter((a) => a.patientId === currentUser?.id);

  const upcomingApts = myAppointments.filter(
    (a) => a.status === 'confirmed' || a.status === 'pending' || a.status === 'inProgress'
  );

  const pastApts = myAppointments.filter(
    (a) => a.status === 'completed' || a.status === 'cancelled'
  );

  const displayedApts =
    activeTab === 'upcoming'
      ? upcomingApts
      : activeTab === 'past'
      ? pastApts
      : myAppointments;

  const handlePay = (apt: AppointmentModel) => {
    setPayingApt(apt);
  };

  const handlePaymentSuccess = (provider: string, _phone: string, ref: string) => {
    if (payingApt) {
      payAppointment(payingApt.id, provider, ref);
      setPayingApt(null);
    }
  };

  return (
    <div className="space-y-5 pb-12 animate-in fade-in max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 rounded-3xl border border-[#EDF2F7] shadow-card">
        <div>
          <h1 className="text-xl font-bold text-[#1A365D]">Mes Rendez-vous Médicaux</h1>
          <p className="text-xs text-[#718096] mt-0.5">
            Gérez vos téléconsultations et rendez-vous en cabinet.
          </p>
        </div>

        <button
          onClick={onBookNew}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-[#2D9CDB] text-white font-semibold text-xs hover:bg-[#2587be] transition-colors shadow-xs active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Prendre un RDV</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-[#EDF2F7] pb-2">
        <button
          onClick={() => setActiveTab('upcoming')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors flex items-center gap-2 ${
            activeTab === 'upcoming'
              ? 'bg-[#2D9CDB] text-white shadow-xs'
              : 'text-[#718096] hover:bg-[#F7FAFC]'
          }`}
        >
          <span>À venir</span>
          <span
            className={`px-1.5 py-0.2 rounded-full text-[10px] ${
              activeTab === 'upcoming' ? 'bg-white/20 text-white' : 'bg-[#EDF2F7] text-[#4A5568]'
            }`}
          >
            {upcomingApts.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('past')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors flex items-center gap-2 ${
            activeTab === 'past'
              ? 'bg-[#2D9CDB] text-white shadow-xs'
              : 'text-[#718096] hover:bg-[#F7FAFC]'
          }`}
        >
          <span>Passés & Archivés</span>
          <span
            className={`px-1.5 py-0.2 rounded-full text-[10px] ${
              activeTab === 'past' ? 'bg-white/20 text-white' : 'bg-[#EDF2F7] text-[#4A5568]'
            }`}
          >
            {pastApts.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('all')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors flex items-center gap-2 ${
            activeTab === 'all'
              ? 'bg-[#2D9CDB] text-white shadow-xs'
              : 'text-[#718096] hover:bg-[#F7FAFC]'
          }`}
        >
          <span>Tous</span>
          <span
            className={`px-1.5 py-0.2 rounded-full text-[10px] ${
              activeTab === 'all' ? 'bg-white/20 text-white' : 'bg-[#EDF2F7] text-[#4A5568]'
            }`}
          >
            {myAppointments.length}
          </span>
        </button>
      </div>

      {/* Appointments List */}
      <div className="space-y-3">
        {displayedApts.map((apt) => (
          <AppointmentCard
            key={apt.id}
            appointment={apt}
            onJoinVideo={
              apt.type === 'teleconsultation' ? () => startVideoCall(apt, false) : undefined
            }
            onPay={() => handlePay(apt)}
            onCancel={() => {
              if (confirm('Êtes-vous sûr de vouloir annuler ce rendez-vous ?')) {
                updateAppointmentStatus(apt.id, 'cancelled');
              }
            }}
          />
        ))}

        {displayedApts.length === 0 && (
          <div className="py-16 text-center bg-white rounded-3xl border border-[#EDF2F7] p-8">
            <div className="w-14 h-14 rounded-2xl bg-[#E7F3FB] text-[#2D9CDB] flex items-center justify-center mx-auto mb-3">
              <Calendar className="w-7 h-7" />
            </div>
            <h3 className="font-bold text-base text-[#1A365D]">Aucun rendez-vous trouvé</h3>
            <p className="text-xs text-[#718096] mt-1 max-w-sm mx-auto">
              Vous n'avez pas de rendez-vous dans cette section. Prenez rendez-vous avec un de nos médecins certifiés.
            </p>
            <button
              onClick={onBookNew}
              className="mt-4 px-5 py-2.5 rounded-xl bg-[#2D9CDB] text-white font-semibold text-xs hover:bg-[#2587be] transition-colors shadow-xs"
            >
              Consulter la liste des médecins
            </button>
          </div>
        )}
      </div>

      {/* Mobile Money Modal for Unpaid appointments */}
      {payingApt && (
        <MobileMoneyModal
          isOpen={!!payingApt}
          onClose={() => setPayingApt(null)}
          title={`Règlement Consultation - ${payingApt.doctorName}`}
          amount={payingApt.consultationPrice || 15000}
          description={`Consultation ${payingApt.doctorSpecialty} (${payingApt.type === 'teleconsultation' ? 'Téléconsultation' : 'Cabinet'})`}
          onSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  );
};
