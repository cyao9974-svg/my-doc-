import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UserCheck, CheckCircle2, XCircle, Clock, ShieldCheck, DollarSign } from 'lucide-react';

export const DoctorRequestsView: React.FC = () => {
  const { currentUser, doctors, treatingRequests, respondTreatingRequest } = useApp();
  const [filter, setFilter] = useState<'all' | 'pending' | 'accepted' | 'rejected'>('all');

  const myDoctor = doctors.find((d) => d.userId === currentUser?.id) || doctors[0];
  const myRequests = treatingRequests.filter((r) => r.doctorId === myDoctor.id);

  const filteredRequests =
    filter === 'all' ? myRequests : myRequests.filter((r) => r.status === filter);

  const acceptedCount = myRequests.filter((r) => r.status === 'accepted').length;
  const totalEarned = acceptedCount * 750;

  return (
    <div className="space-y-6 pb-12 animate-in fade-in max-w-4xl mx-auto">
      {/* Header banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 rounded-3xl border border-[#EDF2F7] shadow-card">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#E7F3FB] text-[#2D9CDB] flex items-center justify-center shrink-0">
            <UserCheck className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#2D9CDB]">
              Dispositif Médecin Traitant (750 FCFA)
            </span>
            <h1 className="text-xl font-bold text-[#1A365D]">Demandes d'Assignation</h1>
            <p className="text-xs text-[#718096]">
              Patients souhaitant vous désigner comme praticien référent de coordination.
            </p>
          </div>
        </div>

        <div className="bg-[#E9F7EF] border border-[#27AE60]/20 p-3 rounded-2xl text-right">
          <span className="text-[10px] uppercase font-bold text-[#718096] block">
            Honoraires Référent Débloqués
          </span>
          <span className="text-lg font-black text-[#27AE60] font-mono">
            {totalEarned.toLocaleString('fr-FR')} FCFA
          </span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-[#EDF2F7] pb-2">
        {(['all', 'pending', 'accepted', 'rejected'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold capitalize transition-all ${
              filter === tab
                ? 'bg-[#2D9CDB] text-white shadow-xs'
                : 'text-[#718096] hover:bg-[#F7FAFC]'
            }`}
          >
            {tab === 'all'
              ? 'Toutes les demandes'
              : tab === 'pending'
              ? 'En attente'
              : tab === 'accepted'
              ? 'Acceptées'
              : 'Refusées'}
          </button>
        ))}
      </div>

      {/* Requests list */}
      <div className="space-y-3">
        {filteredRequests.map((req) => (
          <div
            key={req.id}
            className="p-5 rounded-3xl bg-white border border-[#EDF2F7] shadow-card hover:shadow-card-hover transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-bold text-sm text-[#1A365D]">{req.patientName}</h3>
                <span
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                    req.status === 'accepted'
                      ? 'bg-[#E9F7EF] text-[#27AE60]'
                      : req.status === 'pending'
                      ? 'bg-[#FFF4E8] text-[#C05621]'
                      : 'bg-[#FFF0F0] text-[#EB5757]'
                  }`}
                >
                  {req.status === 'accepted'
                    ? 'Patient référent validé'
                    : req.status === 'pending'
                    ? 'En attente de réponse'
                    : 'Refusé'}
                </span>
                <span className="text-[10px] text-[#27AE60] font-mono font-medium">
                  {req.amount} FCFA payé ({req.paymentMethod})
                </span>
              </div>

              <p className="text-xs text-[#4A5568] italic">"{req.message}"</p>

              <span className="text-[11px] text-[#718096] block">
                Reçu le {new Date(req.createdAt).toLocaleDateString('fr-FR')} • Réf : {req.paymentRef}
              </span>
            </div>

            {req.status === 'pending' && (
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => respondTreatingRequest(req.id, false, 'Patientèle saturée')}
                  className="px-3.5 py-1.5 rounded-xl border border-[#EDF2F7] text-xs font-semibold text-[#EB5757] hover:bg-[#FFF0F0]"
                >
                  Décliner
                </button>
                <button
                  onClick={() => respondTreatingRequest(req.id, true)}
                  className="px-4 py-1.5 rounded-xl bg-[#27AE60] text-white text-xs font-semibold hover:bg-[#219653]"
                >
                  Accepter
                </button>
              </div>
            )}
          </div>
        ))}

        {filteredRequests.length === 0 && (
          <div className="py-12 text-center bg-white rounded-3xl border border-[#EDF2F7] p-6 text-[#718096] text-xs">
            Aucune demande trouvée pour ce filtre.
          </div>
        )}
      </div>
    </div>
  );
};
