import React from 'react';
import { DoctorModel } from '../../types';
import { Star, ShieldCheck, MapPin, Calendar, Clock, ArrowRight } from 'lucide-react';

interface DoctorCardProps {
  doctor: DoctorModel;
  onSelect: () => void;
  isTreatingDoctor?: boolean;
}

export const DoctorCard: React.FC<DoctorCardProps> = ({ doctor, onSelect, isTreatingDoctor }) => {
  return (
    <div className="bg-white rounded-2xl border border-[#EDF2F7] p-4 shadow-card hover:shadow-card-hover transition-all duration-200 flex flex-col justify-between">
      <div>
        {/* Top Info: Avatar, Name, Specialty, Verification */}
        <div className="flex items-start gap-3.5">
          <div className="relative shrink-0">
            <div className="w-14 h-14 rounded-2xl overflow-hidden bg-[#F7FAFC] border border-[#EDF2F7]">
              {doctor.avatarUrl ? (
                <img
                  src={doctor.avatarUrl}
                  alt={doctor.firstName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center font-bold text-lg text-[#2D9CDB] bg-[#E7F3FB]">
                  {doctor.firstName[0]}
                  {doctor.lastName[0]}
                </div>
              )}
            </div>
            {doctor.isOnline && (
              <span
                className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-[#27AE60] border-2 border-white rounded-full"
                title="En ligne pour téléconsultation"
              />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <h3 className="font-bold text-base text-[#1A365D] truncate">
                Dr. {doctor.firstName} {doctor.lastName}
              </h3>
              {doctor.isVerified && (
                <span title="Inscrit à l'Ordre National des Médecins de Côte d'Ivoire">
                  <ShieldCheck className="w-4 h-4 text-[#27AE60] shrink-0" />
                </span>
              )}
            </div>

            <p className="text-xs font-semibold text-[#2D9CDB] mt-0.5">{doctor.specialty}</p>

            <div className="flex items-center gap-3 text-xs text-[#718096] mt-1.5 flex-wrap">
              <span className="flex items-center gap-1 text-[#D97706] font-semibold">
                <Star className="w-3.5 h-3.5 fill-current" />
                {doctor.rating.toFixed(1)}
                <span className="text-[#718096] font-normal">({doctor.reviewCount})</span>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {doctor.city}
              </span>
            </div>
          </div>
        </div>

        {/* Badges / Details: Ordre, Exp, Distance */}
        <div className="mt-3.5 pt-3 border-t border-[#EDF2F7] flex items-center justify-between text-xs text-[#718096] flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-md bg-[#F7FAFC] border border-[#EDF2F7] text-[11px] font-mono">
              Ordre N° {doctor.orderNumber}
            </span>
            <span className="text-[11px] text-[#4A5568]">
              {doctor.experienceYears} ans exp.
            </span>
          </div>

          {isTreatingDoctor && (
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#E9F7EF] text-[#27AE60]">
              Mon Médecin Traitant
            </span>
          )}
        </div>
      </div>

      {/* Bottom price & CTA */}
      <div className="mt-4 pt-3 border-t border-[#EDF2F7] flex items-center justify-between gap-3">
        <div>
          <span className="text-[10px] uppercase tracking-wider text-[#718096] block">
            Tarif Consultation
          </span>
          <span className="font-bold text-sm text-[#1A365D]">
            {doctor.consultationPrice.toLocaleString('fr-FR')} FCFA
          </span>
        </div>

        <button
          onClick={onSelect}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#2D9CDB] text-white font-semibold text-xs hover:bg-[#2587be] transition-colors shadow-xs active:scale-95"
        >
          <span>Prendre RDV</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
