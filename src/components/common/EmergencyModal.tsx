import React from 'react';
import { X, PhoneCall, AlertTriangle, ShieldAlert } from 'lucide-react';

interface EmergencyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EmergencyModal: React.FC<EmergencyModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const emergencyContacts = [
    {
      name: 'SAMU Côte d’Ivoire',
      subtitle: 'Service d’Aide Médicale Urgente',
      number: '185',
      desc: 'Détresse respiratoire, arrêt cardiaque, coma, accident grave.',
      color: 'bg-[#EB5757] text-white',
      badge: 'Urgence Vitale 24/7',
    },
    {
      name: 'Sapeurs-Pompiers Militaires (GSPM)',
      subtitle: 'Secours et incendies',
      number: '180',
      desc: 'Accidents de la route, incendies, effondrements, inondations.',
      color: 'bg-[#E65100] text-white',
      badge: 'Secours 24/7',
    },
    {
      name: 'Police Secours',
      subtitle: 'Assistance et sécurité',
      number: '170',
      desc: 'Agression, péril imminent, signalement.',
      color: 'bg-[#1A365D] text-white',
      badge: 'Sécurité Publique',
    },
    {
      name: 'Centre Anti-Poison (INHP)',
      subtitle: 'Intoxication & empoisonnement',
      number: '27 20 25 97 00',
      desc: 'Intoxication alimentaire, morsure de serpent, produits toxiques.',
      color: 'bg-[#00897B] text-white',
      badge: 'Toxicologie',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl relative border border-[#EDF2F7] max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-[#718096] hover:bg-[#F7FAFC] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-[#FFF0F0] text-[#EB5757] flex items-center justify-center">
            <AlertTriangle className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-[#1A365D]">Numéros d'Urgence Côte d'Ivoire</h3>
            <p className="text-xs text-[#718096]">
              En cas d'urgence médicale vitale, contactez immédiatement les secours.
            </p>
          </div>
        </div>

        <div className="space-y-3 my-4">
          {emergencyContacts.map((contact) => (
            <div
              key={contact.number}
              className="p-4 rounded-2xl border border-[#EDF2F7] hover:border-[#EB5757]/30 transition-all bg-[#FDFCF8] flex items-start justify-between gap-3"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-sm text-[#1A365D]">{contact.name}</h4>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#EDF2F7] text-[#4A5568]">
                    {contact.badge}
                  </span>
                </div>
                <p className="text-[11px] text-[#2D9CDB] font-medium">{contact.subtitle}</p>
                <p className="text-xs text-[#718096] leading-relaxed">{contact.desc}</p>
              </div>

              <a
                href={`tel:${contact.number.replace(/\s+/g, '')}`}
                className={`px-4 py-2.5 rounded-xl font-bold font-mono text-sm flex items-center gap-2 shadow-xs transition-transform active:scale-95 shrink-0 ${contact.color}`}
              >
                <PhoneCall className="w-4 h-4" />
                <span>{contact.number}</span>
              </a>
            </div>
          ))}
        </div>

        <div className="p-3.5 rounded-2xl bg-[#FFF4E8] border border-[#FDBA74]/30 text-xs text-[#9A3412] flex items-start gap-2.5">
          <ShieldAlert className="w-4 h-4 text-[#EA580C] shrink-0 mt-0.5" />
          <p>
            Pour une consultation médicale de routine ou non-urgente, utilisez la prise de rendez-vous avec un de nos médecins certifiés.
          </p>
        </div>

        <button
          onClick={onClose}
          className="mt-4 w-full py-2.5 rounded-xl bg-[#EDF2F7] text-[#4A5568] font-semibold text-xs hover:bg-[#E2E8F0] transition-colors"
        >
          Fermer
        </button>
      </div>
    </div>
  );
};
