import React from 'react';
import { X, QrCode, Copy, Check, ShieldCheck } from 'lucide-react';
import { CmuCard } from '../../types';

interface QrCodeModalProps {
  card: CmuCard;
  isOpen: boolean;
  onClose: () => void;
}

export const QrCodeModal: React.FC<QrCodeModalProps> = ({ card, isOpen, onClose }) => {
  const [copied, setCopied] = React.useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(card.cmuNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl relative border border-[#EDF2F7]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-[#718096] hover:bg-[#F7FAFC] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center">
          <div className="w-12 h-12 rounded-2xl bg-[#E7F3FB] text-[#2D9CDB] flex items-center justify-center mx-auto mb-3">
            <QrCode className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-lg text-[#1A365D]">Pass Santé & CMU-CI</h3>
          <p className="text-xs text-[#718096] mt-0.5">
            À présenter aux bornes de soins, hôpitaux et pharmacies partenaires.
          </p>
        </div>

        {/* QR Code Graphic (SVG) */}
        <div className="my-6 p-4 rounded-2xl bg-[#F7FAFC] border border-[#EDF2F7] flex flex-col items-center justify-center">
          {/* Stylized QR Code SVG */}
          <div className="p-3 bg-white rounded-xl shadow-xs border border-[#EDF2F7]">
            <svg
              className="w-48 h-48"
              viewBox="0 0 100 100"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect width="100" height="100" fill="white" />
              {/* Corner 1 */}
              <rect x="10" y="10" width="25" height="25" fill="#1A365D" rx="4" />
              <rect x="15" y="15" width="15" height="15" fill="white" rx="2" />
              <rect x="19" y="19" width="7" height="7" fill="#2D9CDB" rx="1" />
              {/* Corner 2 */}
              <rect x="65" y="10" width="25" height="25" fill="#1A365D" rx="4" />
              <rect x="70" y="15" width="15" height="15" fill="white" rx="2" />
              <rect x="74" y="19" width="7" height="7" fill="#2D9CDB" rx="1" />
              {/* Corner 3 */}
              <rect x="10" y="65" width="25" height="25" fill="#1A365D" rx="4" />
              <rect x="15" y="70" width="15" height="15" fill="white" rx="2" />
              <rect x="19" y="74" width="7" height="7" fill="#27AE60" rx="1" />
              {/* Data matrix dots */}
              <rect x="42" y="12" width="6" height="6" fill="#1A365D" rx="1" />
              <rect x="52" y="12" width="6" height="6" fill="#1A365D" rx="1" />
              <rect x="42" y="24" width="6" height="6" fill="#2D9CDB" rx="1" />
              <rect x="52" y="30" width="6" height="6" fill="#1A365D" rx="1" />
              <rect x="42" y="42" width="16" height="16" fill="#1A365D" rx="3" />
              <rect x="46" y="46" width="8" height="8" fill="white" rx="1" />
              <rect x="14" y="42" width="6" height="6" fill="#1A365D" rx="1" />
              <rect x="26" y="48" width="6" height="6" fill="#27AE60" rx="1" />
              <rect x="68" y="44" width="6" height="6" fill="#1A365D" rx="1" />
              <rect x="80" y="50" width="6" height="6" fill="#2D9CDB" rx="1" />
              <rect x="42" y="68" width="6" height="6" fill="#1A365D" rx="1" />
              <rect x="52" y="76" width="6" height="6" fill="#27AE60" rx="1" />
              <rect x="68" y="68" width="18" height="6" fill="#1A365D" rx="1" />
              <rect x="74" y="80" width="12" height="6" fill="#1A365D" rx="1" />
            </svg>
          </div>

          <div className="mt-3 text-center">
            <span className="text-[10px] uppercase tracking-wider text-[#718096] font-medium">
              Matricule CMU
            </span>
            <div className="flex items-center gap-2 justify-center mt-0.5">
              <span className="font-mono font-bold text-base text-[#1A365D] tracking-wider">
                {card.cmuNumber}
              </span>
              <button
                onClick={handleCopy}
                className="p-1 rounded-md text-[#718096] hover:text-[#2D9CDB] hover:bg-white transition-colors"
                title="Copier le numéro"
              >
                {copied ? (
                  <Check className="w-3.5 h-3.5 text-[#27AE60]" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Security badge */}
        <div className="flex items-center justify-between text-xs text-[#718096] bg-[#F7FAFC] px-3 py-2 rounded-xl border border-[#EDF2F7]">
          <div className="flex items-center gap-1.5 text-[#27AE60] font-medium">
            <ShieldCheck className="w-4 h-4" />
            <span>Droits vérifiés en ligne</span>
          </div>
          <span className="text-[11px] font-mono">ID: CI-{card.cmuNumber.slice(-4)}</span>
        </div>

        <button
          onClick={onClose}
          className="mt-4 w-full py-2.5 rounded-xl bg-[#2D9CDB] text-white font-semibold text-sm hover:bg-[#2587be] transition-colors shadow-xs"
        >
          Fermer
        </button>
      </div>
    </div>
  );
};
