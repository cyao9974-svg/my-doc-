import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { MobileMoneyModal } from '../../components/common/MobileMoneyModal';
import { Pill, ShoppingBag, ShieldCheck, CheckCircle2, Clock, MapPin, Receipt } from 'lucide-react';
import { PharmacyPrescription } from '../../types';

export const PatientPharmacyView: React.FC = () => {
  const { prescriptions, payPrescription } = useApp();
  const [selectedPrescription, setSelectedPrescription] = useState<PharmacyPrescription | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const handlePayOrder = (prescription: PharmacyPrescription) => {
    setSelectedPrescription(prescription);
    setShowPaymentModal(true);
  };

  const handlePaymentSuccess = () => {
    if (selectedPrescription) {
      payPrescription(selectedPrescription.id);
      setShowPaymentModal(false);
    }
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 rounded-3xl border border-[#EDF2F7] shadow-card">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#FFF4E8] text-[#D97706] flex items-center justify-center shrink-0">
            <Pill className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#D97706]">
              Pharmacies Partenaires CMU
            </span>
            <h1 className="text-xl font-bold text-[#1A365D]">Ordonnances & Médicaments</h1>
            <p className="text-xs text-[#718096]">
              Retrait prioritaire ou livraison à domicile de vos traitements.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#E9F7EF] text-[#27AE60] border border-[#27AE60]/20 text-xs font-semibold">
          <ShieldCheck className="w-4 h-4" />
          <span>Tiers Payant CMU Actif</span>
        </div>
      </div>

      {/* Prescriptions List */}
      <div className="space-y-4">
        {prescriptions.map((presc) => {
          const isPaid = presc.status === 'paid' || presc.status === 'delivered';

          return (
            <div
              key={presc.id}
              className="bg-white rounded-3xl border border-[#EDF2F7] p-6 shadow-card hover:shadow-card-hover transition-all"
            >
              {/* Presc header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#EDF2F7] pb-4 mb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-sm text-[#1A365D]">
                      {presc.prescriptionNumber}
                    </span>
                    <span
                      className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                        isPaid
                          ? 'bg-[#E9F7EF] text-[#27AE60]'
                          : 'bg-[#FFF4E8] text-[#D97706]'
                      }`}
                    >
                      {isPaid ? 'Règlement validé' : 'Prête pour commande'}
                    </span>
                  </div>
                  <p className="text-xs text-[#718096] mt-0.5">
                    Délivrée le {new Date(presc.date).toLocaleDateString('fr-FR')} par{' '}
                    <span className="font-semibold text-[#1A365D]">{presc.doctorName}</span> (
                    {presc.doctorSpecialty})
                  </p>
                </div>

                {presc.pharmacyName && (
                  <div className="flex items-center gap-1.5 text-xs text-[#2D9CDB] bg-[#E7F3FB] px-3 py-1 rounded-xl">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{presc.pharmacyName}</span>
                  </div>
                )}
              </div>

              {/* Medications Table */}
              <div className="space-y-2 mb-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#718096]">
                  Médicaments prescrits
                </h4>
                <div className="divide-y divide-[#EDF2F7] border border-[#EDF2F7] rounded-2xl overflow-hidden bg-[#FDFCF8]">
                  {presc.medications.map((med, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
                    >
                      <div>
                        <span className="font-bold text-sm text-[#1A365D]">{med.name}</span>
                        <div className="text-[#718096] text-[11px] mt-0.5">
                          Posologie : {med.dosage} • Durée : {med.duration}
                        </div>
                      </div>
                      <span className="font-mono font-bold text-[#1A365D] self-end sm:self-center">
                        {med.price.toLocaleString('fr-FR')} FCFA
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total & Action */}
              <div className="pt-3 border-t border-[#EDF2F7] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-[#718096]">Total ordonnance :</span>
                    <span className="text-base font-bold text-[#1A365D]">
                      {presc.totalAmount.toLocaleString('fr-FR')} FCFA
                    </span>
                  </div>
                  <span className="text-[11px] text-[#27AE60] font-medium">
                    Soit {(presc.totalAmount * 0.3).toLocaleString('fr-FR')} FCFA reste à charge patient avec CMU (70% déduit)
                  </span>
                </div>

                {isPaid ? (
                  <div className="flex items-center gap-2 text-xs font-semibold text-[#27AE60] bg-[#E9F7EF] px-4 py-2 rounded-xl">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Commande payée • Retrait au guichet disponible</span>
                  </div>
                ) : (
                  <button
                    onClick={() => handlePayOrder(presc)}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#2D9CDB] text-white font-semibold text-xs hover:bg-[#2587be] transition-colors shadow-xs active:scale-95 flex items-center justify-center gap-2"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Commander & Régler par Mobile Money</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Payment Modal */}
      {selectedPrescription && (
        <MobileMoneyModal
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          title={`Paiement Ordonnance ${selectedPrescription.prescriptionNumber}`}
          amount={Math.round(selectedPrescription.totalAmount * 0.3)} // Patient co-pay with CMU
          description={`Règlement reste à charge CMU (30%) pour ${selectedPrescription.pharmacyName || 'Pharmacie Partenaire'}`}
          onSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  );
};
