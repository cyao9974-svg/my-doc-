import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Users, Search, FileText, Plus, Calendar, ShieldCheck, X } from 'lucide-react';
import { UserModel } from '../../types';

export const DoctorPatientsView: React.FC = () => {
  const { users, medicalRecords, addMedicalRecord, doctors, currentUser } = useApp();

  const [search, setSearch] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<UserModel | null>(null);
  const [showAddReportModal, setShowAddReportModal] = useState(false);

  // New report state
  const [reportTitle, setReportTitle] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [prescription, setPrescription] = useState('');
  const [description, setDescription] = useState('');

  const myDoctor = doctors.find((d) => d.userId === currentUser?.id) || doctors[0];
  const patientUsers = users.filter((u) => u.role === 'patient');

  const filteredPatients = patientUsers.filter(
    (p) =>
      p.firstName.toLowerCase().includes(search.toLowerCase()) ||
      p.lastName.toLowerCase().includes(search.toLowerCase()) ||
      p.phone.includes(search) ||
      (p.cmuNumber && p.cmuNumber.includes(search))
  );

  const activePatient = selectedPatient || filteredPatients[0];

  const patientRecords = medicalRecords.filter(
    (r) => r.patientId === activePatient?.id
  );

  const handleCreateReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activePatient || !reportTitle) return;

    addMedicalRecord({
      patientId: activePatient.id,
      patientName: `${activePatient.lastName} ${activePatient.firstName}`,
      doctorId: myDoctor.id,
      doctorName: `Dr. ${myDoctor.firstName} ${myDoctor.lastName}`,
      doctorSpecialty: myDoctor.specialty,
      type: 'consultation',
      title: reportTitle,
      description,
      diagnosis,
      prescription,
      tags: [myDoctor.specialty, 'Consultation'],
      isConfidential: false,
      consultationDate: new Date().toISOString(),
    });

    setShowAddReportModal(false);
    setReportTitle('');
    setDiagnosis('');
    setPrescription('');
    setDescription('');
  };

  return (
    <div className="bg-white rounded-3xl border border-[#EDF2F7] shadow-card overflow-hidden h-[calc(100vh-175px)] min-h-[500px] flex flex-col md:flex-row animate-in fade-in">
      {/* Patient Directory Sidebar */}
      <div className="w-full md:w-80 border-b md:border-b-0 md:border-r border-[#EDF2F7] flex flex-col bg-[#FDFCF8]">
        <div className="p-4 border-b border-[#EDF2F7] space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-sm text-[#1A365D] flex items-center gap-2">
              <Users className="w-4 h-4 text-[#2D9CDB]" />
              <span>Dossiers Patients</span>
            </h2>
            <span className="text-xs font-semibold text-[#718096]">
              {patientUsers.length} patients
            </span>
          </div>

          <div className="relative">
            <Search className="w-3.5 h-3.5 text-[#718096] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Nom, tél ou N° CMU..."
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#EDF2F7] bg-white text-xs text-[#1A365D] focus:outline-none focus:border-[#2D9CDB]"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-[#EDF2F7]">
          {filteredPatients.map((patient) => {
            const isSelected = activePatient?.id === patient.id;
            return (
              <button
                key={patient.id}
                onClick={() => setSelectedPatient(patient)}
                className={`w-full p-3.5 text-left flex items-center gap-3 transition-colors ${
                  isSelected ? 'bg-white border-l-4 border-l-[#2D9CDB]' : 'hover:bg-white/60'
                }`}
              >
                <div className="w-10 h-10 rounded-xl overflow-hidden bg-[#E7F3FB] text-[#2D9CDB] flex items-center justify-center font-bold text-sm shrink-0">
                  {patient.avatarUrl ? (
                    <img
                      src={patient.avatarUrl}
                      alt={patient.firstName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    patient.firstName[0]
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-xs text-[#1A365D] truncate">
                    {patient.lastName.toUpperCase()} {patient.firstName}
                  </div>
                  <div className="text-[11px] text-[#718096] truncate">
                    CMU : {patient.cmuNumber || 'Non renseigné'}
                  </div>
                  <div className="text-[10px] text-[#27AE60] mt-0.5">
                    {patient.commune}, {patient.city}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Patient Detail View */}
      {activePatient ? (
        <div className="flex-1 flex flex-col h-full bg-white overflow-y-auto">
          {/* Patient Header Bar */}
          <div className="p-5 border-b border-[#EDF2F7] flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#FBFBFA]">
            <div className="flex items-center gap-3.5">
              <div className="w-14 h-14 rounded-2xl overflow-hidden bg-[#E7F3FB] border border-[#EDF2F7] shrink-0">
                {activePatient.avatarUrl ? (
                  <img
                    src={activePatient.avatarUrl}
                    alt={activePatient.firstName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center font-bold text-xl text-[#2D9CDB]">
                    {activePatient.firstName[0]}
                  </div>
                )}
              </div>
              <div>
                <h3 className="font-bold text-base text-[#1A365D]">
                  {activePatient.lastName.toUpperCase()} {activePatient.firstName}
                </h3>
                <div className="flex items-center gap-2 text-xs text-[#718096] mt-0.5 flex-wrap">
                  <span className="font-mono text-[11px] bg-white px-2 py-0.5 rounded border border-[#EDF2F7]">
                    CMU: {activePatient.cmuNumber || '1029384756'}
                  </span>
                  <span>•</span>
                  <span>Tél: {activePatient.phone}</span>
                  <span>•</span>
                  <span>{activePatient.commune}</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowAddReportModal(true)}
              className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-[#2D9CDB] text-white font-semibold text-xs hover:bg-[#2587be] transition-colors shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Nouveau Compte-Rendu</span>
            </button>
          </div>

          {/* Medical Records for this patient */}
          <div className="p-6 space-y-4 flex-1">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#718096]">
              Historique des Consultations & Examens ({patientRecords.length})
            </h4>

            <div className="space-y-3">
              {patientRecords.map((rec) => (
                <div
                  key={rec.id}
                  className="p-4 rounded-2xl bg-[#FDFCF8] border border-[#EDF2F7] shadow-xs space-y-2.5 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-[#1A365D]">{rec.title}</span>
                    <span className="text-[#718096] text-[11px]">
                      {new Date(rec.consultationDate).toLocaleDateString('fr-FR')}
                    </span>
                  </div>

                  {rec.diagnosis && (
                    <div>
                      <span className="font-semibold text-[#1A365D]">Diagnostic : </span>
                      <span className="text-[#4A5568]">{rec.diagnosis}</span>
                    </div>
                  )}

                  {rec.description && (
                    <p className="text-[#4A5568] bg-white p-2.5 rounded-xl border border-[#EDF2F7]">
                      {rec.description}
                    </p>
                  )}

                  {rec.prescription && (
                    <div className="p-2.5 rounded-xl bg-[#E9F7EF] border border-[#27AE60]/30 text-[#1E7E34]">
                      <span className="font-semibold block">Ordonnance :</span>
                      <span>{rec.prescription}</span>
                    </div>
                  )}
                </div>
              ))}

              {patientRecords.length === 0 && (
                <div className="py-12 text-center text-[#718096] text-xs">
                  Aucun compte-rendu enregistré pour ce patient. Cliquez sur "Nouveau Compte-Rendu" pour en ajouter un.
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center p-8 text-center text-[#718096] text-xs">
          Sélectionnez un patient pour consulter son dossier.
        </div>
      )}

      {/* Add Report Modal */}
      {showAddReportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl relative border border-[#EDF2F7] max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowAddReportModal(false)}
              className="absolute top-4 right-4 p-2 rounded-full text-[#718096] hover:bg-[#F7FAFC]"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-bold text-base text-[#1A365D] mb-1">
              Rédiger un compte-rendu médical
            </h3>
            <p className="text-xs text-[#718096] mb-4">
              Patient : {activePatient?.lastName.toUpperCase()} {activePatient?.firstName}
            </p>

            <form onSubmit={handleCreateReport} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-[#1A365D] mb-1">
                  Titre de la consultation
                </label>
                <input
                  type="text"
                  required
                  value={reportTitle}
                  onChange={(e) => setReportTitle(e.target.value)}
                  placeholder="Ex: Suivi tensionnel, Consultation cardiologique..."
                  className="w-full p-2.5 rounded-xl border border-[#EDF2F7]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#1A365D] mb-1">
                  Observations cliniques
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Symptômes décrits, constantes mesurées..."
                  className="w-full p-2.5 rounded-xl border border-[#EDF2F7]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#1A365D] mb-1">Diagnostic</label>
                <input
                  type="text"
                  value={diagnosis}
                  onChange={(e) => setDiagnosis(e.target.value)}
                  placeholder="Ex: HTA stade 1 stabilisée"
                  className="w-full p-2.5 rounded-xl border border-[#EDF2F7]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#1A365D] mb-1">
                  Ordonnance / Traitement prescrit
                </label>
                <textarea
                  rows={3}
                  value={prescription}
                  onChange={(e) => setPrescription(e.target.value)}
                  placeholder="Médicaments, posologie et durée..."
                  className="w-full p-2.5 rounded-xl border border-[#EDF2F7]"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddReportModal(false)}
                  className="flex-1 py-2.5 rounded-xl border border-[#EDF2F7] text-[#718096]"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-[#2D9CDB] text-white font-semibold hover:bg-[#2587be]"
                >
                  Enregistrer au dossier
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
