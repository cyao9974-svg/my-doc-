import React, { useState } from 'react';
import { DoctorModel, AppointmentType } from '../../types';
import { useApp } from '../../context/AppContext';
import { MobileMoneyModal } from '../../components/common/MobileMoneyModal';
import {
  ArrowLeft,
  Star,
  ShieldCheck,
  MapPin,
  Clock,
  Calendar,
  Video,
  Building2,
  CheckCircle2,
  UserCheck,
  Award,
  Phone,
  MessageSquare,
} from 'lucide-react';

interface DoctorDetailViewProps {
  doctor: DoctorModel;
  onBack: () => void;
  onBookingComplete: () => void;
}

export const DoctorDetailView: React.FC<DoctorDetailViewProps> = ({
  doctor,
  onBack,
  onBookingComplete,
}) => {
  const {
    currentUser,
    bookAppointment,
    requestTreatingDoctor,
    treatingRequests,
    setActiveTab,
  } = useApp();

  const [appointmentType, setAppointmentType] = useState<AppointmentType>('teleconsultation');
  const [selectedDay, setSelectedDay] = useState<string>('Aujourdhui');
  const [selectedSlot, setSelectedSlot] = useState<string>(
    doctor.availableSlots[selectedDay]?.[0] || '10:00'
  );
  const [reason, setReason] = useState<string>('');
  const [showPaymentModal, setShowPaymentModal] = useState<boolean>(false);
  const [paymentType, setPaymentType] = useState<'appointment' | 'treatingDoctor'>('appointment');
  const [pendingAptData, setPendingAptData] = useState<any>(null);
  const [treatingMessage, setTreatingMessage] = useState<string>(
    'Bonjour Docteur, je souhaite vous désigner comme mon médecin traitant référent pour mon suivi régulier.'
  );
  const [showTreatingModal, setShowTreatingModal] = useState<boolean>(false);
  const [bookingSuccess, setBookingSuccess] = useState<boolean>(false);

  // Check if treating doctor request already exists
  const existingTreatingReq = treatingRequests.find(
    (r) => r.patientId === currentUser?.id && r.doctorId === doctor.id
  );

  const availableDays = Object.keys(doctor.availableSlots);
  const currentSlots = doctor.availableSlots[selectedDay] || [];

  const handleBookNow = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    // Calculate scheduled date/time
    let scheduledDate = new Date();
    if (selectedDay === 'Demain') {
      scheduledDate.setDate(scheduledDate.getDate() + 1);
    } else if (selectedDay !== 'Aujourdhui') {
      scheduledDate.setDate(scheduledDate.getDate() + 3);
    }

    const [hours, mins] = selectedSlot.split(':').map(Number);
    scheduledDate.setHours(hours || 10, mins || 0, 0, 0);

    const aptData = {
      patientId: currentUser.id,
      patientName: `${currentUser.lastName} ${currentUser.firstName}`,
      patientAvatar: currentUser.avatarUrl,
      doctorId: doctor.id,
      doctorName: `Dr. ${doctor.firstName} ${doctor.lastName}`,
      doctorSpecialty: doctor.specialty,
      doctorAvatar: doctor.avatarUrl,
      scheduledAt: scheduledDate.toISOString(),
      durationMinutes: 30,
      status: 'confirmed' as const,
      type: appointmentType,
      reason: reason || 'Consultation générale',
      consultationPrice: doctor.consultationPrice,
      isPaid: false,
      hasReminder: true,
    };

    setPendingAptData(aptData);
    setPaymentType('appointment');
    setShowPaymentModal(true);
  };

  const handlePaymentSuccess = (provider: string, _phone: string, ref: string) => {
    if (paymentType === 'appointment' && pendingAptData) {
      bookAppointment({
        ...pendingAptData,
        isPaid: true,
        paymentMethod: provider,
        paymentRef: ref,
      });
      setBookingSuccess(true);
      setTimeout(() => {
        onBookingComplete();
      }, 1500);
    } else if (paymentType === 'treatingDoctor') {
      requestTreatingDoctor(doctor.id, treatingMessage, provider);
      setShowTreatingModal(false);
      alert('Demande de médecin traitant envoyée avec succès au Dr. ' + doctor.lastName);
    }
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in max-w-3xl mx-auto">
      {/* Top back nav */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-xs font-semibold text-[#1A365D] hover:text-[#2D9CDB] transition-colors py-1"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Retour aux médecins</span>
      </button>

      {/* Doctor Header Banner */}
      <div className="bg-white rounded-3xl border border-[#EDF2F7] p-6 shadow-card">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
          <div className="relative">
            <div className="w-24 h-24 rounded-3xl overflow-hidden bg-[#F7FAFC] border border-[#EDF2F7] shadow-sm">
              {doctor.avatarUrl ? (
                <img
                  src={doctor.avatarUrl}
                  alt={doctor.firstName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center font-bold text-2xl text-[#2D9CDB] bg-[#E7F3FB]">
                  {doctor.firstName[0]}
                  {doctor.lastName[0]}
                </div>
              )}
            </div>
            {doctor.isOnline && (
              <span className="absolute bottom-0 right-0 w-4 h-4 bg-[#27AE60] border-2 border-white rounded-full" />
            )}
          </div>

          <div className="flex-1 space-y-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-bold text-[#1A365D]">
                Dr. {doctor.firstName} {doctor.lastName}
              </h1>
              {doctor.isVerified && (
                <span className="flex items-center gap-1 text-[11px] font-semibold text-[#27AE60] bg-[#E9F7EF] px-2.5 py-0.5 rounded-full border border-[#27AE60]/20">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Ordre N° {doctor.orderNumber}
                </span>
              )}
            </div>

            <p className="text-sm font-semibold text-[#2D9CDB]">{doctor.specialty}</p>

            <div className="flex items-center gap-4 text-xs text-[#718096] flex-wrap">
              <span className="flex items-center gap-1 text-[#D97706] font-semibold">
                <Star className="w-4 h-4 fill-current" />
                {doctor.rating.toFixed(1)} ({doctor.reviewCount} avis)
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Award className="w-4 h-4 text-[#2D9CDB]" />
                {doctor.experienceYears} ans d'expérience
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {doctor.city}
              </span>
            </div>

            <div className="pt-2 flex items-center gap-2 flex-wrap">
              <span className="text-xs text-[#718096]">Tarif de consultation :</span>
              <span className="text-base font-bold text-[#1A365D]">
                {doctor.consultationPrice.toLocaleString('fr-FR')} FCFA
              </span>
              <span className="text-[11px] text-[#27AE60] bg-[#E9F7EF] px-2 py-0.5 rounded-md font-medium">
                Prise en charge CMU éligible
              </span>
            </div>
          </div>
        </div>

        {/* Doctor Bio & Practice details */}
        <div className="mt-5 pt-5 border-t border-[#EDF2F7]">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#718096] mb-1.5">
            À propos du praticien
          </h3>
          <p className="text-xs sm:text-sm text-[#4A5568] leading-relaxed">{doctor.bio}</p>
          <div className="mt-3 flex items-center gap-2 text-xs text-[#718096]">
            <MapPin className="w-3.5 h-3.5 text-[#2D9CDB]" />
            <span>Adresse du cabinet : {doctor.address}, {doctor.city}</span>
          </div>
        </div>

        {/* Action to designate as Treating Doctor */}
        <div className="mt-5 pt-4 border-t border-[#EDF2F7] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-[#F7FAFC] p-3.5 rounded-2xl">
          <div>
            <div className="flex items-center gap-1.5">
              <UserCheck className="w-4 h-4 text-[#27AE60]" />
              <h4 className="text-xs font-bold text-[#1A365D]">
                Désigner comme votre Médecin Traitant
              </h4>
            </div>
            <p className="text-[11px] text-[#718096] mt-0.5">
              Coordination globale, meilleur remboursement CMU. Frais de dossier: 750 FCFA.
            </p>
          </div>

          {existingTreatingReq ? (
            <span
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold ${
                existingTreatingReq.status === 'accepted'
                  ? 'bg-[#E9F7EF] text-[#27AE60]'
                  : 'bg-[#FFF4E8] text-[#C05621]'
              }`}
            >
              {existingTreatingReq.status === 'accepted'
                ? 'Médecin traitant actif'
                : 'Demande en cours d’examen'}
            </span>
          ) : (
            <button
              onClick={() => {
                setPaymentType('treatingDoctor');
                setShowTreatingModal(true);
              }}
              className="px-3.5 py-2 rounded-xl bg-white border border-[#27AE60] text-[#27AE60] hover:bg-[#27AE60] hover:text-white transition-all text-xs font-bold shadow-xs shrink-0"
            >
              Faire la demande (750 FCFA)
            </button>
          )}
        </div>
      </div>

      {/* Appointment Booking Form */}
      <form onSubmit={handleBookNow} className="bg-white rounded-3xl border border-[#EDF2F7] p-6 shadow-card space-y-6">
        <div>
          <h2 className="text-base font-bold text-[#1A365D]">Planifier une consultation</h2>
          <p className="text-xs text-[#718096]">
            Sélectionnez le mode de rendez-vous, la date et l'horaire qui vous conviennent.
          </p>
        </div>

        {/* Step 1: Mode Selection (Video vs Cabinet) */}
        <div>
          <label className="block text-xs font-semibold text-[#1A365D] mb-2">
            1. Mode de consultation
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setAppointmentType('teleconsultation')}
              className={`p-4 rounded-2xl border text-left transition-all flex items-start gap-3 ${
                appointmentType === 'teleconsultation'
                  ? 'border-[#2D9CDB] bg-[#E7F3FB]/40 ring-2 ring-[#2D9CDB]/20'
                  : 'border-[#EDF2F7] hover:border-gray-300'
              }`}
            >
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                  appointmentType === 'teleconsultation'
                    ? 'bg-[#2D9CDB] text-white'
                    : 'bg-[#F7FAFC] text-[#718096]'
                }`}
              >
                <Video className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-[#1A365D]">Téléconsultation Vidéo</span>
                  <span className="text-[10px] bg-[#27AE60] text-white px-1.5 py-0.2 rounded font-semibold">
                    Sans déplacement
                  </span>
                </div>
                <p className="text-[11px] text-[#718096] mt-0.5">
                  Appel vidéo HD sécurisé dans l'application avec envoi d'ordonnance.
                </p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setAppointmentType('inPerson')}
              className={`p-4 rounded-2xl border text-left transition-all flex items-start gap-3 ${
                appointmentType === 'inPerson'
                  ? 'border-[#2D9CDB] bg-[#E7F3FB]/40 ring-2 ring-[#2D9CDB]/20'
                  : 'border-[#EDF2F7] hover:border-gray-300'
              }`}
            >
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                  appointmentType === 'inPerson'
                    ? 'bg-[#2D9CDB] text-white'
                    : 'bg-[#F7FAFC] text-[#718096]'
                }`}
              >
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-[#1A365D]">Au Cabinet Médical</span>
                <p className="text-[11px] text-[#718096] mt-0.5">
                  Consultation physique à l'adresse du Dr. ({doctor.city}).
                </p>
              </div>
            </button>
          </div>
        </div>

        {/* Step 2: Day Selection */}
        <div>
          <label className="block text-xs font-semibold text-[#1A365D] mb-2">
            2. Choisissez le jour
          </label>
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            {availableDays.map((day) => (
              <button
                key={day}
                type="button"
                onClick={() => {
                  setSelectedDay(day);
                  setSelectedSlot(doctor.availableSlots[day]?.[0] || '10:00');
                }}
                className={`px-4 py-2.5 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  selectedDay === day
                    ? 'bg-[#1A365D] text-white shadow-xs'
                    : 'bg-[#F7FAFC] border border-[#EDF2F7] text-[#4A5568] hover:bg-[#EDF2F7]'
                }`}
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>{day}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Step 3: Slot Selection */}
        <div>
          <label className="block text-xs font-semibold text-[#1A365D] mb-2">
            3. Choisissez l'horaire
          </label>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
            {currentSlots.map((slot) => (
              <button
                key={slot}
                type="button"
                onClick={() => setSelectedSlot(slot)}
                className={`py-2 px-3 rounded-xl text-xs font-bold font-mono transition-all flex items-center justify-center gap-1.5 ${
                  selectedSlot === slot
                    ? 'bg-[#2D9CDB] text-white shadow-xs'
                    : 'bg-[#F7FAFC] border border-[#EDF2F7] text-[#1A365D] hover:border-[#2D9CDB]'
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                <span>{slot}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Step 4: Reason / Notes */}
        <div>
          <label className="block text-xs font-semibold text-[#1A365D] mb-1.5">
            4. Motif de la consultation (optionnel)
          </label>
          <textarea
            rows={2}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Ex: Douleurs thoraciques, renouvellement d'ordonnance, fièvre persistante..."
            className="w-full p-3 rounded-xl border border-[#EDF2F7] bg-[#F7FAFC] text-xs text-[#1A365D] placeholder-[#718096] focus:bg-white focus:outline-none focus:border-[#2D9CDB]"
          />
        </div>

        {/* Summary & Submit */}
        <div className="pt-2 border-t border-[#EDF2F7] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span className="text-xs text-[#718096]">Montant total à payer :</span>
            <div className="text-lg font-bold text-[#1A365D]">
              {doctor.consultationPrice.toLocaleString('fr-FR')} FCFA
            </div>
          </div>

          <button
            type="submit"
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#2D9CDB] text-white font-semibold text-sm hover:bg-[#2587be] transition-all shadow-xs active:scale-95 flex items-center justify-center gap-2"
          >
            <span>Confirmer & Payer par Mobile Money</span>
          </button>
        </div>
      </form>

      {/* Treating Doctor Request Modal */}
      {showTreatingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl relative border border-[#EDF2F7]">
            <h3 className="font-bold text-lg text-[#1A365D]">
              Désigner le Dr. {doctor.firstName} {doctor.lastName}
            </h3>
            <p className="text-xs text-[#718096] mt-1">
              La désignation d'un médecin traitant permet un suivi coordonné et un remboursement optimal avec la CMU.
            </p>

            <div className="my-4 p-3 rounded-xl bg-[#F7FAFC] border border-[#EDF2F7] text-xs space-y-1">
              <div className="flex justify-between">
                <span className="text-[#718096]">Praticien :</span>
                <span className="font-semibold text-[#1A365D]">Dr. {doctor.lastName} ({doctor.specialty})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#718096]">Frais d'adhésion :</span>
                <span className="font-bold text-[#27AE60]">750 FCFA</span>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-xs font-semibold text-[#1A365D] mb-1">
                Message à l'attention du médecin :
              </label>
              <textarea
                rows={3}
                value={treatingMessage}
                onChange={(e) => setTreatingMessage(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-[#EDF2F7] text-xs"
              />
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setShowTreatingModal(false)}
                className="flex-1 py-2.5 rounded-xl border border-[#EDF2F7] text-xs font-semibold text-[#718096]"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowTreatingModal(false);
                  setShowPaymentModal(true);
                }}
                className="flex-1 py-2.5 rounded-xl bg-[#27AE60] text-white text-xs font-semibold hover:bg-[#219653]"
              >
                Régler 750 FCFA
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Money Payment Modal */}
      <MobileMoneyModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        title={
          paymentType === 'appointment'
            ? `Consultation Dr. ${doctor.lastName}`
            : `Désignation Médecin Traitant`
        }
        amount={paymentType === 'appointment' ? doctor.consultationPrice : 750}
        description={
          paymentType === 'appointment'
            ? `${appointmentType === 'teleconsultation' ? 'Téléconsultation' : 'Au cabinet'} - ${selectedDay} à ${selectedSlot}`
            : `Frais d'enregistrement et transmission de dossier au Dr. ${doctor.lastName}`
        }
        onSuccess={handlePaymentSuccess}
      />
    </div>
  );
};
