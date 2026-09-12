import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AppointmentCard } from '../../components/common/AppointmentCard';
import {
  Users,
  Calendar,
  Clock,
  DollarSign,
  UserCheck,
  CheckCircle2,
  XCircle,
  Video,
  ChevronRight,
  TrendingUp,
  Stethoscope,
} from 'lucide-react';

interface DoctorHomeViewProps {
  onOpenAppointments: () => void;
  onOpenRequests: () => void;
  onOpenPatients: () => void;
}

export const DoctorHomeView: React.FC<DoctorHomeViewProps> = ({
  onOpenAppointments,
  onOpenRequests,
  onOpenPatients,
}) => {
  const {
    currentUser,
    doctors,
    appointments,
    treatingRequests,
    respondTreatingRequest,
    updateAppointmentStatus,
    startVideoCall,
  } = useApp();

  const [rejectionReason, setRejectionReason] = useState('');
  const [activeRejectId, setActiveRejectId] = useState<string | null>(null);

  // Find doctor record for currently logged-in user
  const myDoctorProfile =
    doctors.find((d) => d.userId === currentUser?.id || d.email === currentUser?.email) ||
    doctors[0];

  const myAppointments = appointments.filter((a) => a.doctorId === myDoctorProfile?.id);
  const todayAppointments = myAppointments.filter(
    (a) => a.status === 'confirmed' || a.status === 'inProgress' || a.status === 'pending'
  );

  const pendingTreatingRequests = treatingRequests.filter(
    (r) => r.doctorId === myDoctorProfile?.id && r.status === 'pending'
  );

  const totalEarnings = myAppointments
    .filter((a) => a.isPaid)
    .reduce((acc, curr) => acc + (curr.consultationPrice || 15000), 0);

  return (
    <div className="space-y-6 pb-12 animate-in fade-in max-w-5xl mx-auto">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 rounded-3xl border border-[#EDF2F7] shadow-card">
        <div className="flex items-center gap-3.5">
          <div className="w-14 h-14 rounded-2xl overflow-hidden bg-[#E7F3FB] border border-[#EDF2F7] shrink-0">
            {myDoctorProfile?.avatarUrl ? (
              <img
                src={myDoctorProfile.avatarUrl}
                alt={myDoctorProfile.firstName}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center font-bold text-xl text-[#2D9CDB]">
                Dr
              </div>
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold text-[#1A365D]">
                Dr. {myDoctorProfile?.firstName} {myDoctorProfile?.lastName}
              </h1>
              <span className="text-[10px] font-semibold text-[#27AE60] bg-[#E9F7EF] px-2 py-0.5 rounded-full">
                Ordre N° {myDoctorProfile?.orderNumber}
              </span>
            </div>
            <p className="text-xs text-[#718096] mt-0.5">
              Cabinet & Téléconsultations • {myDoctorProfile?.specialty} ({myDoctorProfile?.city})
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-3.5 py-1.5 rounded-xl bg-[#E9F7EF] text-[#27AE60] text-xs font-semibold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#27AE60] animate-pulse" />
            <span>Téléconsultation Active</span>
          </div>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-2xl bg-white border border-[#EDF2F7] shadow-card">
          <div className="flex items-center justify-between text-[#2D9CDB] mb-2">
            <span className="text-xs font-bold text-[#718096]">RDV Prévus</span>
            <Calendar className="w-4 h-4" />
          </div>
          <div className="text-2xl font-black text-[#1A365D] font-mono">
            {todayAppointments.length}
          </div>
          <span className="text-[10px] text-[#27AE60] font-medium block mt-0.5">
            Téléconsultations & Cabinet
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-[#EDF2F7] shadow-card">
          <div className="flex items-center justify-between text-[#9333EA] mb-2">
            <span className="text-xs font-bold text-[#718096]">Demandes Traitant</span>
            <UserCheck className="w-4 h-4" />
          </div>
          <div className="text-2xl font-black text-[#1A365D] font-mono">
            {pendingTreatingRequests.length}
          </div>
          <span className="text-[10px] text-[#C05621] font-medium block mt-0.5">
            À valider (750 FCFA/dossier)
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-[#EDF2F7] shadow-card">
          <div className="flex items-center justify-between text-[#27AE60] mb-2">
            <span className="text-xs font-bold text-[#718096]">File Active Patients</span>
            <Users className="w-4 h-4" />
          </div>
          <div className="text-2xl font-black text-[#1A365D] font-mono">
            {myDoctorProfile?.patientCount || 890}
          </div>
          <span className="text-[10px] text-[#27AE60] font-medium block mt-0.5">
            Patients suivis
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-[#EDF2F7] shadow-card">
          <div className="flex items-center justify-between text-[#D97706] mb-2">
            <span className="text-xs font-bold text-[#718096]">Revenus Encaissés</span>
            <TrendingUp className="w-4 h-4" />
          </div>
          <div className="text-xl font-black text-[#1A365D] font-mono">
            {totalEarnings.toLocaleString('fr-FR')} <span className="text-xs font-normal">FCFA</span>
          </div>
          <span className="text-[10px] text-[#718096] font-medium block mt-0.5">
            Mobile Money & Virement
          </span>
        </div>
      </div>

      {/* Treating Doctor Requests Section */}
      {pendingTreatingRequests.length > 0 && (
        <div className="bg-white rounded-3xl border border-[#EDF2F7] p-5 shadow-card space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-[#2D9CDB]" />
              <h2 className="text-base font-bold text-[#1A365D]">
                Demandes d'Assignation comme Médecin Traitant
              </h2>
            </div>
            <span className="text-xs font-bold bg-[#E7F3FB] text-[#2D9CDB] px-2 py-0.5 rounded-full">
              {pendingTreatingRequests.length} en attente
            </span>
          </div>

          <div className="divide-y divide-[#EDF2F7]">
            {pendingTreatingRequests.map((req) => (
              <div key={req.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-[#1A365D]">{req.patientName}</span>
                    <span className="text-[10px] text-[#27AE60] bg-[#E9F7EF] px-2 py-0.5 rounded-full font-semibold">
                      Frais de 750 FCFA réglés ({req.paymentMethod})
                    </span>
                  </div>
                  <p className="text-xs text-[#718096] italic">"{req.message}"</p>
                  <span className="text-[10px] text-[#718096]">
                    Demandé le {new Date(req.createdAt).toLocaleDateString('fr-FR')}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveRejectId(req.id)}
                    className="px-3.5 py-1.5 rounded-xl border border-[#EDF2F7] text-xs font-semibold text-[#EB5757] hover:bg-[#FFF0F0] transition-colors"
                  >
                    Refuser
                  </button>
                  <button
                    onClick={() => respondTreatingRequest(req.id, true)}
                    className="px-4 py-1.5 rounded-xl bg-[#27AE60] text-white text-xs font-semibold hover:bg-[#219653] transition-colors shadow-xs"
                  >
                    Accepter le patient
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Rejection reason modal */}
          {activeRejectId && (
            <div className="p-3 bg-[#FFF0F0] rounded-2xl border border-[#EB5757]/20 flex flex-col sm:flex-row gap-2 items-center">
              <input
                type="text"
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Motif du refus (ex: patientèle complète)..."
                className="flex-1 p-2 rounded-xl border border-[#EDF2F7] text-xs bg-white"
              />
              <div className="flex gap-2">
                <button
                  onClick={() => setActiveRejectId(null)}
                  className="px-3 py-1.5 text-xs text-[#718096]"
                >
                  Annuler
                </button>
                <button
                  onClick={() => {
                    respondTreatingRequest(activeRejectId, false, rejectionReason);
                    setActiveRejectId(null);
                    setRejectionReason('');
                  }}
                  className="px-3 py-1.5 bg-[#EB5757] text-white text-xs font-semibold rounded-xl"
                >
                  Confirmer le refus
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Consultations List for Doctor */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <div>
            <h2 className="text-base font-bold text-[#1A365D]">Consultations à Venir</h2>
            <p className="text-xs text-[#718096]">
              Patients programmés pour aujourd'hui et les prochains jours.
            </p>
          </div>
          <button
            onClick={onOpenAppointments}
            className="text-xs text-[#2D9CDB] font-semibold hover:underline flex items-center gap-1"
          >
            <span>Gérer l'agenda ({myAppointments.length})</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-3">
          {todayAppointments.map((apt) => (
            <AppointmentCard
              key={apt.id}
              appointment={apt}
              isDoctorView={true}
              onJoinVideo={
                apt.type === 'teleconsultation' ? () => startVideoCall(apt, true) : undefined
              }
              onUpdateStatus={(status) => updateAppointmentStatus(apt.id, status)}
            />
          ))}

          {todayAppointments.length === 0 && (
            <div className="py-12 text-center bg-white rounded-3xl border border-[#EDF2F7] p-6 text-[#718096] text-xs">
              Aucune consultation programmée pour le moment.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
