import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { HealthIdCard } from '../../components/common/HealthIdCard';
import { AppointmentCard } from '../../components/common/AppointmentCard';
import { DoctorCard } from '../../components/common/DoctorCard';
import { QrCodeModal } from '../../components/common/QrCodeModal';
import {
  Search,
  PhoneCall,
  Calendar,
  FileText,
  Syringe,
  UserCheck,
  Pill,
  Sparkles,
  ArrowRight,
  Shield,
  Clock,
  Filter,
} from 'lucide-react';
import { DoctorModel } from '../../types';

interface PatientHomeViewProps {
  onSelectDoctor: (doc: DoctorModel) => void;
  onOpenAppointments: () => void;
  onOpenMedicalRecord: () => void;
  onOpenVaccines: () => void;
  onOpenPharmacy: () => void;
  onOpenEmergency: () => void;
}

export const PatientHomeView: React.FC<PatientHomeViewProps> = ({
  onSelectDoctor,
  onOpenAppointments,
  onOpenMedicalRecord,
  onOpenVaccines,
  onOpenPharmacy,
  onOpenEmergency,
}) => {
  const {
    currentUser,
    cmuCard,
    appointments,
    doctors,
    treatingRequests,
    startVideoCall,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('Tous');
  const [showQrModal, setShowQrModal] = useState(false);

  // Next upcoming appointment
  const upcomingAppointments = appointments.filter(
    (a) =>
      a.patientId === currentUser?.id &&
      (a.status === 'confirmed' || a.status === 'pending' || a.status === 'inProgress')
  );
  const nextApt = upcomingAppointments[0];

  // Treating doctor status
  const acceptedTreatingReq = treatingRequests.find(
    (r) => r.patientId === currentUser?.id && r.status === 'accepted'
  );

  const specialties = [
    'Tous',
    'Cardiologue',
    'Pédiatre',
    'Médecine Générale',
    'Gynécologue Obstétricienne',
  ];

  // Filter doctors
  const filteredDoctors = doctors.filter((doc) => {
    const matchesSearch =
      doc.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.city.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSpecialty =
      selectedSpecialty === 'Tous' || doc.specialty === selectedSpecialty;
    return matchesSearch && matchesSpecialty;
  });

  return (
    <div className="space-y-6 pb-12 animate-in fade-in">
      {/* Welcome Banner & Quick Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 rounded-3xl border border-[#EDF2F7] shadow-card">
        <div>
          <span className="text-[11px] uppercase font-bold tracking-wider text-[#2D9CDB]">
            Espace Santé Patient
          </span>
          <h1 className="text-xl sm:text-2xl font-bold text-[#1A365D] mt-0.5">
            Bonjour, {currentUser?.firstName || 'Patient'}
          </h1>
          <p className="text-xs text-[#718096] mt-0.5">
            Suivi médical, rendez-vous et téléconsultations en Côte d'Ivoire.
          </p>
        </div>

        {/* Quick emergency button */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenEmergency}
            className="w-full sm:w-auto px-4 py-2.5 rounded-2xl bg-[#FFF0F0] text-[#EB5757] hover:bg-[#FFE5E5] transition-all flex items-center justify-center gap-2 text-xs font-bold border border-[#EB5757]/20 shadow-xs active:scale-95"
          >
            <PhoneCall className="w-4 h-4 animate-pulse" />
            <span>SAMU 185 / Pompiers 180</span>
          </button>
        </div>
      </div>

      {/* CMU Health Card */}
      <div>
        <div className="flex items-center justify-between mb-2.5 px-1">
          <h2 className="text-sm font-bold text-[#1A365D] flex items-center gap-2">
            <Shield className="w-4 h-4 text-[#2D9CDB]" />
            <span>Ma Carte CMU (Assurance Maladie Universelle)</span>
          </h2>
          <span className="text-[11px] text-[#718096] font-medium">Côte d'Ivoire</span>
        </div>
        <HealthIdCard card={cmuCard} onOpenQr={() => setShowQrModal(true)} />
      </div>

      {/* Next Appointment Card (if any) */}
      {nextApt && (
        <div>
          <div className="flex items-center justify-between mb-2.5 px-1">
            <h2 className="text-sm font-bold text-[#1A365D] flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#27AE60]" />
              <span>Prochaine Consultation</span>
            </h2>
            <button
              onClick={onOpenAppointments}
              className="text-xs font-semibold text-[#2D9CDB] hover:underline flex items-center gap-1"
            >
              <span>Voir tout ({upcomingAppointments.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <AppointmentCard
            appointment={nextApt}
            onJoinVideo={
              nextApt.type === 'teleconsultation'
                ? () => startVideoCall(nextApt, false)
                : undefined
            }
          />
        </div>
      )}

      {/* Quick Healthcare Shortcuts */}
      <div>
        <h2 className="text-sm font-bold text-[#1A365D] mb-3 px-1">
          Services & Raccourcis Médicaux
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <button
            onClick={onOpenMedicalRecord}
            className="p-4 rounded-2xl bg-white border border-[#EDF2F7] shadow-card hover:shadow-card-hover transition-all text-left flex flex-col justify-between group"
          >
            <div className="w-10 h-10 rounded-xl bg-[#E7F3FB] text-[#2D9CDB] flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-xs text-[#1A365D]">Dossier Médical</h3>
              <p className="text-[11px] text-[#718096] mt-0.5">Analyses & Bilans</p>
            </div>
          </button>

          <button
            onClick={onOpenVaccines}
            className="p-4 rounded-2xl bg-white border border-[#EDF2F7] shadow-card hover:shadow-card-hover transition-all text-left flex flex-col justify-between group"
          >
            <div className="w-10 h-10 rounded-xl bg-[#E9F7EF] text-[#27AE60] flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <Syringe className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-xs text-[#1A365D]">Vaccinations</h3>
              <p className="text-[11px] text-[#718096] mt-0.5">Carnet électronique</p>
            </div>
          </button>

          <button
            onClick={onOpenPharmacy}
            className="p-4 rounded-2xl bg-white border border-[#EDF2F7] shadow-card hover:shadow-card-hover transition-all text-left flex flex-col justify-between group"
          >
            <div className="w-10 h-10 rounded-xl bg-[#FFF4E8] text-[#D97706] flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <Pill className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-xs text-[#1A365D]">Pharmacie & Ordo</h3>
              <p className="text-[11px] text-[#718096] mt-0.5">Paiement Mobile</p>
            </div>
          </button>

          <button
            onClick={onOpenAppointments}
            className="p-4 rounded-2xl bg-white border border-[#EDF2F7] shadow-card hover:shadow-card-hover transition-all text-left flex flex-col justify-between group"
          >
            <div className="w-10 h-10 rounded-xl bg-[#F3E8FF] text-[#9333EA] flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-xs text-[#1A365D]">Médecin Traitant</h3>
              <p className="text-[11px] text-[#718096] mt-0.5">
                {acceptedTreatingReq ? 'Assigné (Dr. Koffi)' : 'Choisir (750 FCFA)'}
              </p>
            </div>
          </button>
        </div>
      </div>

      {/* Doctor Search & Booking Section */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-1">
          <div>
            <h2 className="text-base font-bold text-[#1A365D]">
              Trouver un Médecin & Téléconsulter
            </h2>
            <p className="text-xs text-[#718096]">
              Praticiens conventionnés et inscrits à l'Ordre National des Médecins CI.
            </p>
          </div>
          <span className="text-xs text-[#2D9CDB] font-semibold">
            {filteredDoctors.length} médecins disponibles
          </span>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-[#718096] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher par médecin, spécialité (Cardiologue, Pédiatre...) ou commune (Cocody, Marcory...)"
            className="w-full pl-10 pr-4 py-3 rounded-2xl border border-[#EDF2F7] bg-white text-xs sm:text-sm text-[#1A365D] placeholder-[#718096] shadow-xs focus:outline-none focus:border-[#2D9CDB] focus:ring-2 focus:ring-[#2D9CDB]/20"
          />
        </div>

        {/* Specialty Filter Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {specialties.map((spec) => (
            <button
              key={spec}
              onClick={() => setSelectedSpecialty(spec)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                selectedSpecialty === spec
                  ? 'bg-[#2D9CDB] text-white shadow-xs font-semibold'
                  : 'bg-white border border-[#EDF2F7] text-[#4A5568] hover:bg-[#F7FAFC]'
              }`}
            >
              {spec}
            </button>
          ))}
        </div>

        {/* Doctors List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredDoctors.map((doc) => (
            <DoctorCard
              key={doc.id}
              doctor={doc}
              onSelect={() => onSelectDoctor(doc)}
              isTreatingDoctor={acceptedTreatingReq?.doctorId === doc.id}
            />
          ))}

          {filteredDoctors.length === 0 && (
            <div className="col-span-full py-12 text-center bg-white rounded-2xl border border-[#EDF2F7] p-6">
              <p className="text-sm text-[#718096]">
                Aucun médecin trouvé pour votre recherche.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedSpecialty('Tous');
                }}
                className="mt-2 text-xs text-[#2D9CDB] font-semibold hover:underline"
              >
                Réinitialiser les filtres
              </button>
            </div>
          )}
        </div>
      </div>

      {/* QR Code Modal for CMU */}
      <QrCodeModal
        card={cmuCard}
        isOpen={showQrModal}
        onClose={() => setShowQrModal(false)}
      />
    </div>
  );
};
