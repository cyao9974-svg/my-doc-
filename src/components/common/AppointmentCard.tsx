import React from 'react';
import { AppointmentModel } from '../../types';
import {
  Calendar,
  Clock,
  Video,
  MapPin,
  CreditCard,
  XCircle,
  PlayCircle,
  Building2,
} from 'lucide-react';

interface AppointmentCardProps {
  appointment: AppointmentModel;
  isDoctorView?: boolean;
  onJoinVideo?: () => void;
  onPay?: () => void;
  onCancel?: () => void;
  onUpdateStatus?: (status: any) => void;
}

export const AppointmentCard: React.FC<AppointmentCardProps> = ({
  appointment,
  isDoctorView,
  onJoinVideo,
  onPay,
  onCancel,
  onUpdateStatus,
}) => {
  const dateObj = new Date(appointment.scheduledAt);
  const formattedDate = dateObj.toLocaleDateString('fr-FR', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
  const formattedTime = dateObj.toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
  });

  const getStatusBadge = () => {
    switch (appointment.status) {
      case 'confirmed':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#E9F7EF] text-[#27AE60] border border-[#27AE60]/20">
            Confirmé
          </span>
        );
      case 'pending':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#FFF4E8] text-[#C05621] border border-[#FDBA74]/30">
            En attente
          </span>
        );
      case 'completed':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#EDF2F7] text-[#4A5568]">
            Terminé
          </span>
        );
      case 'cancelled':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#FFF0F0] text-[#EB5757]">
            Annulé
          </span>
        );
      case 'inProgress':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#E7F3FB] text-[#2D9CDB] animate-pulse">
            En cours
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-[#EDF2F7] p-4 shadow-card hover:shadow-card-hover transition-all">
      <div className="flex items-start justify-between gap-3 border-b border-[#EDF2F7] pb-3 mb-3">
        <div className="flex items-center gap-2.5">
          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
              appointment.type === 'teleconsultation'
                ? 'bg-[#E7F3FB] text-[#2D9CDB]'
                : 'bg-[#F7FAFC] text-[#1A365D] border border-[#EDF2F7]'
            }`}
          >
            {appointment.type === 'teleconsultation' ? (
              <Video className="w-5 h-5" />
            ) : (
              <Building2 className="w-5 h-5" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-[#1A365D]">
              <span>{appointment.type === 'teleconsultation' ? 'Téléconsultation' : 'Cabinet'}</span>
              <span className="text-[#718096]">•</span>
              <span className="text-[#718096]">{appointment.durationMinutes} min</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-[#718096] mt-0.5">
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {formattedDate}
              </span>
              <span>à</span>
              <span className="font-semibold text-[#1A365D] flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {formattedTime}
              </span>
            </div>
          </div>
        </div>

        {getStatusBadge()}
      </div>

      {/* Doctor / Patient information */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl overflow-hidden bg-[#F7FAFC] border border-[#EDF2F7] shrink-0">
            {isDoctorView ? (
              appointment.patientAvatar ? (
                <img
                  src={appointment.patientAvatar}
                  alt={appointment.patientName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center font-bold text-sm text-[#2D9CDB] bg-[#E7F3FB]">
                  {appointment.patientName[0]}
                </div>
              )
            ) : appointment.doctorAvatar ? (
              <img
                src={appointment.doctorAvatar}
                alt={appointment.doctorName}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center font-bold text-sm text-[#2D9CDB] bg-[#E7F3FB]">
                {appointment.doctorName[0]}
              </div>
            )}
          </div>

          <div>
            <h4 className="font-bold text-sm text-[#1A365D]">
              {isDoctorView ? appointment.patientName : appointment.doctorName}
            </h4>
            <p className="text-xs text-[#718096]">
              {isDoctorView ? 'Patient' : appointment.doctorSpecialty}
            </p>
            {appointment.reason && (
              <p className="text-[11px] text-[#4A5568] line-clamp-1 italic mt-0.5">
                "{appointment.reason}"
              </p>
            )}
          </div>
        </div>

        {/* Pricing / Payment status badge */}
        <div className="text-right shrink-0">
          <div className="font-bold text-sm text-[#1A365D]">
            {(appointment.consultationPrice || 15000).toLocaleString('fr-FR')} FCFA
          </div>
          <span
            className={`text-[10px] font-semibold block ${
              appointment.isPaid ? 'text-[#27AE60]' : 'text-[#C05621]'
            }`}
          >
            {appointment.isPaid ? 'Payé' : 'À régler'}
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-3.5 pt-3 border-t border-[#EDF2F7] flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2">
          {appointment.status !== 'cancelled' && appointment.status !== 'completed' && onCancel && (
            <button
              onClick={onCancel}
              className="text-xs text-[#EB5757] hover:bg-[#FFF0F0] px-2.5 py-1.5 rounded-lg transition-colors flex items-center gap-1 font-medium"
            >
              <XCircle className="w-3.5 h-3.5" />
              <span>Annuler</span>
            </button>
          )}

          {!appointment.isPaid && onPay && appointment.status !== 'cancelled' && (
            <button
              onClick={onPay}
              className="text-xs text-[#2D9CDB] hover:bg-[#E7F3FB] px-2.5 py-1.5 rounded-lg transition-colors flex items-center gap-1 font-medium"
            >
              <CreditCard className="w-3.5 h-3.5" />
              <span>Payer en ligne</span>
            </button>
          )}
        </div>

        {/* Teleconsultation action */}
        {appointment.type === 'teleconsultation' &&
          (appointment.status === 'confirmed' || appointment.status === 'inProgress') &&
          onJoinVideo && (
            <button
              onClick={onJoinVideo}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#27AE60] text-white font-semibold text-xs hover:bg-[#219653] transition-colors shadow-xs active:scale-95 animate-bounce-subtle"
            >
              <PlayCircle className="w-4 h-4" />
              <span>Rejoindre la téléconsultation</span>
            </button>
          )}

        {/* Doctor status management actions */}
        {isDoctorView && appointment.status === 'pending' && onUpdateStatus && (
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => onUpdateStatus('cancelled')}
              className="px-3 py-1 rounded-lg border border-[#EDF2F7] text-xs text-[#EB5757] hover:bg-[#FFF0F0]"
            >
              Décliner
            </button>
            <button
              onClick={() => onUpdateStatus('confirmed')}
              className="px-3 py-1 rounded-lg bg-[#2D9CDB] text-white text-xs font-semibold hover:bg-[#2587be]"
            >
              Confirmer
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
