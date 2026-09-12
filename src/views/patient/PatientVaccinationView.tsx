import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Syringe, Plus, Calendar, CheckCircle2, AlertCircle, X, Shield } from 'lucide-react';

export const PatientVaccinationView: React.FC = () => {
  const { vaccines, addVaccine } = useApp();
  const [showAddModal, setShowAddModal] = useState(false);

  const [disease, setDisease] = useState('');
  const [vaccineName, setVaccineName] = useState('');
  const [administeredAt, setAdministeredAt] = useState(new Date().toISOString().split('T')[0]);
  const [batchNumber, setBatchNumber] = useState('');
  const [doctorName, setDoctorName] = useState('Centre de Santé');
  const [nextDueDate, setNextDueDate] = useState('');

  const handleAddVaccine = (e: React.FormEvent) => {
    e.preventDefault();
    if (!disease || !vaccineName) return;

    addVaccine({
      disease,
      vaccineName,
      administeredAt,
      batchNumber: batchNumber || 'LOT-CI-' + Math.floor(1000 + Math.random() * 9000),
      doctorName,
      nextDueDate: nextDueDate || undefined,
      status: nextDueDate && new Date(nextDueDate) > new Date() ? 'completed' : 'completed',
    });

    setShowAddModal(false);
    setDisease('');
    setVaccineName('');
    setBatchNumber('');
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in max-w-4xl mx-auto">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 rounded-3xl border border-[#EDF2F7] shadow-card">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#E9F7EF] text-[#27AE60] flex items-center justify-center shrink-0">
            <Syringe className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#27AE60]">
              Santé Publique & Prévention
            </span>
            <h1 className="text-xl font-bold text-[#1A365D]">Carnet Vaccinal Électronique</h1>
            <p className="text-xs text-[#718096]">
              Suivi conforme aux recommandations de l'INHP (Institut National d'Hygiène Publique).
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-[#2D9CDB] text-white font-semibold text-xs hover:bg-[#2587be] transition-colors shadow-xs active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Ajouter un Vaccin</span>
        </button>
      </div>

      {/* Yellow Fever / International Travel Compliance note */}
      <div className="p-4 rounded-2xl bg-[#FEF3C7] border border-[#F59E0B]/30 flex items-start gap-3">
        <Shield className="w-5 h-5 text-[#D97706] shrink-0 mt-0.5" />
        <div className="text-xs text-[#92400E] leading-relaxed">
          <span className="font-bold block text-sm">Vaccination antiamarile (Fièvre Jaune) :</span>
          Obligatoire pour tout voyageur en Côte d'Ivoire. La dose confère une protection à vie selon le Règlement Sanitaire International de l'OMS.
        </div>
      </div>

      {/* Vaccine Records List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {vaccines.map((vac) => {
          const isCompleted = vac.status === 'completed';
          return (
            <div
              key={vac.id}
              className="p-5 rounded-3xl bg-white border border-[#EDF2F7] shadow-card hover:shadow-card-hover transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#2D9CDB]">
                      {vac.disease}
                    </span>
                    <h3 className="font-bold text-base text-[#1A365D] mt-0.5">
                      {vac.vaccineName}
                    </h3>
                  </div>

                  <span
                    className={`flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${
                      isCompleted
                        ? 'bg-[#E9F7EF] text-[#27AE60]'
                        : 'bg-[#FFF4E8] text-[#C05621]'
                    }`}
                  >
                    {isCompleted ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>À jour</span>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="w-3.5 h-3.5" />
                        <span>Rappel prévu</span>
                      </>
                    )}
                  </span>
                </div>

                <div className="text-xs text-[#718096] space-y-1 mt-3">
                  <div className="flex justify-between">
                    <span>Date injection :</span>
                    <span className="font-semibold text-[#1A365D]">
                      {new Date(vac.administeredAt).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Praticien / Centre :</span>
                    <span className="font-medium text-[#1A365D]">{vac.doctorName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>N° de Lot :</span>
                    <span className="font-mono text-[11px] text-[#4A5568]">{vac.batchNumber}</span>
                  </div>
                </div>
              </div>

              {vac.nextDueDate && (
                <div className="mt-4 pt-3 border-t border-[#EDF2F7] flex items-center justify-between text-xs">
                  <span className="text-[#718096]">Prochain rappel :</span>
                  <span className="font-bold text-[#2D9CDB]">
                    {new Date(vac.nextDueDate).toLocaleDateString('fr-FR')}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Add Vaccine Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl relative border border-[#EDF2F7]">
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute top-4 right-4 p-2 rounded-full text-[#718096] hover:bg-[#F7FAFC]"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-bold text-base text-[#1A365D] mb-4">
              Enregistrer un nouveau vaccin
            </h3>

            <form onSubmit={handleAddVaccine} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-[#1A365D] mb-1">
                  Pathologie ciblée
                </label>
                <input
                  type="text"
                  required
                  value={disease}
                  onChange={(e) => setDisease(e.target.value)}
                  placeholder="Ex: Fièvre Jaune, Hépatite B, Tétanos..."
                  className="w-full p-2.5 rounded-xl border border-[#EDF2F7]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#1A365D] mb-1">
                  Nom commercial du vaccin
                </label>
                <input
                  type="text"
                  required
                  value={vaccineName}
                  onChange={(e) => setVaccineName(e.target.value)}
                  placeholder="Ex: Stamaril, Engerix B..."
                  className="w-full p-2.5 rounded-xl border border-[#EDF2F7]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-[#1A365D] mb-1">
                    Date injection
                  </label>
                  <input
                    type="date"
                    required
                    value={administeredAt}
                    onChange={(e) => setAdministeredAt(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-[#EDF2F7]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#1A365D] mb-1">
                    Prochain rappel
                  </label>
                  <input
                    type="date"
                    value={nextDueDate}
                    onChange={(e) => setNextDueDate(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-[#EDF2F7]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#1A365D] mb-1">
                  Centre ou Médecin vaccinateur
                </label>
                <input
                  type="text"
                  value={doctorName}
                  onChange={(e) => setDoctorName(e.target.value)}
                  placeholder="Ex: INHP Plateau / Dr. Koffi"
                  className="w-full p-2.5 rounded-xl border border-[#EDF2F7]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#1A365D] mb-1">
                  Numéro de Lot
                </label>
                <input
                  type="text"
                  value={batchNumber}
                  onChange={(e) => setBatchNumber(e.target.value)}
                  placeholder="Ex: FJ-9821-CI"
                  className="w-full p-2.5 rounded-xl border border-[#EDF2F7]"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2.5 rounded-xl border border-[#EDF2F7] text-[#718096]"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-[#2D9CDB] text-white font-semibold hover:bg-[#2587be]"
                >
                  Ajouter au carnet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
