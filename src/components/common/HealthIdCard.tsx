import React, { useState } from 'react';
import { Eye, EyeOff, QrCode, ShieldCheck, Calendar, MapPin, User } from 'lucide-react';
import { CmuCard } from '../../types';

interface HealthIdCardProps {
  card: CmuCard;
  onOpenQr?: () => void;
}

export const HealthIdCard: React.FC<HealthIdCardProps> = ({ card, onOpenQr }) => {
  const [showNumber, setShowNumber] = useState(false);

  // Format masked number: 1029••••••
  const formattedCmu = showNumber
    ? card.cmuNumber
    : card.cmuNumber.slice(0, 4) + ' •••• ••••';

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#1A365D] via-[#1E4273] to-[#0A5C80] text-white p-5 shadow-card">
      {/* Background decorative watermark */}
      <div className="absolute -right-8 -bottom-8 w-44 h-44 rounded-full bg-white/5 pointer-events-none blur-xl" />
      <div className="absolute right-4 top-4 opacity-15 pointer-events-none font-bold text-6xl text-white">
        CMU
      </div>

      {/* Card Header: Official flag badge & CNAM */}
      <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-3 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="flex flex-col gap-0.5">
            <div className="w-4 h-1 bg-[#F97316] rounded-full" />
            <div className="w-4 h-1 bg-[#FFFFFF] rounded-full" />
            <div className="w-4 h-1 bg-[#22C55E] rounded-full" />
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold tracking-wider text-[#2D9CDB]">
              RÉPUBLIQUE DE CÔTE D'IVOIRE
            </p>
            <h3 className="text-xs font-semibold text-white/90">
              Caisse Nationale d'Assurance Maladie (CNAM)
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-1.5 bg-[#27AE60]/20 border border-[#27AE60]/40 px-2 py-0.5 rounded-full text-[10px] font-semibold text-[#6EE7B7]">
          <ShieldCheck className="w-3 h-3" />
          <span>Droits Ouverts</span>
        </div>
      </div>

      {/* Main card content */}
      <div className="flex items-center justify-between gap-4">
        {/* Left: User details */}
        <div className="space-y-3">
          <div>
            <p className="text-[10px] uppercase text-white/60 font-semibold tracking-wider">
              Assuré Principal
            </p>
            <h4 className="text-base font-bold text-white tracking-wide">
              {card.lastName.toUpperCase()} {card.firstName}
            </h4>
            <div className="flex items-center gap-3 text-xs text-white/80 mt-0.5">
              <span className="flex items-center gap-1">
                <User className="w-3 h-3 text-white/60" />
                {card.gender === 'M' ? 'Masculin' : 'Féminin'}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3 text-white/60" />
                {new Date(card.birthDate).toLocaleDateString('fr-FR')}
              </span>
            </div>
          </div>

          {/* CMU Number with mask toggle */}
          <div>
            <p className="text-[10px] uppercase text-white/60 font-semibold tracking-wider">
              N° d'Immatriculation CMU
            </p>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="font-mono font-bold text-sm tracking-wider bg-white/10 px-2.5 py-1 rounded-lg">
                {formattedCmu}
              </span>
              <button
                type="button"
                onClick={() => setShowNumber(!showNumber)}
                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white/80 transition-colors"
                title={showNumber ? 'Masquer' : 'Afficher le numéro complet'}
              >
                {showNumber ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Right: QR Code & Avatar */}
        <div className="flex flex-col items-center gap-2">
          {card.photoUrl && (
            <div className="w-14 h-16 rounded-xl border-2 border-white/20 overflow-hidden shadow-xs bg-white/10">
              <img
                src={card.photoUrl}
                alt="Photo CMU"
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <button
            onClick={onOpenQr}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white text-[#1A365D] hover:bg-white/90 text-xs font-semibold shadow-xs transition-transform active:scale-95"
            title="Afficher le QR code pour la pharmacie ou l'hôpital"
          >
            <QrCode className="w-3.5 h-3.5 text-[#2D9CDB]" />
            <span>QR Code</span>
          </button>
        </div>
      </div>

      {/* Card Footer: Validity and locality */}
      <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-white/75">
        <div className="flex items-center gap-1.5">
          <MapPin className="w-3 h-3 text-[#2D9CDB]" />
          <span>{card.commune}, {card.city}</span>
        </div>
        <div>
          <span>Valable jusqu'au: </span>
          <span className="font-semibold text-white">
            {new Date(card.expiryDate).toLocaleDateString('fr-FR')}
          </span>
        </div>
      </div>
    </div>
  );
};
