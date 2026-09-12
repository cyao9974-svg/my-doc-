import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Activity,
  Heart,
  Droplets,
  Scale,
  Plus,
  FileText,
  Calendar,
  Stethoscope,
  ShieldCheck,
  X,
  ChevronRight,
  Download,
} from 'lucide-react';
import { HealthMetricType } from '../../types';

export const PatientMedicalRecordView: React.FC = () => {
  const { healthMetrics, medicalRecords, addHealthMetric, currentUser } = useApp();

  const [showMetricModal, setShowMetricModal] = useState(false);
  const [metricType, setMetricType] = useState<HealthMetricType>('bloodPressure');
  const [metricValue, setMetricValue] = useState<number>(120);
  const [metricValue2, setMetricValue2] = useState<number>(80);
  const [metricNote, setMetricNote] = useState<string>('');

  // Latest metrics
  const latestBP = healthMetrics.find((m) => m.type === 'bloodPressure');
  const latestSugar = healthMetrics.find((m) => m.type === 'bloodSugar');
  const latestHR = healthMetrics.find((m) => m.type === 'heartRate');
  const latestWeight = healthMetrics.find((m) => m.type === 'weight');

  const handleSaveMetric = (e: React.FormEvent) => {
    e.preventDefault();
    const unit =
      metricType === 'bloodPressure'
        ? 'mmHg'
        : metricType === 'bloodSugar'
        ? 'g/L'
        : metricType === 'heartRate'
        ? 'bpm'
        : 'kg';

    addHealthMetric({
      type: metricType,
      value: Number(metricValue),
      value2: metricType === 'bloodPressure' ? Number(metricValue2) : undefined,
      unit,
      recordedAt: new Date().toISOString(),
      note: metricNote || undefined,
    });

    setShowMetricModal(false);
    setMetricNote('');
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in max-w-4xl mx-auto">
      {/* Header banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 rounded-3xl border border-[#EDF2F7] shadow-card">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#2D9CDB]">
            Dossier Médical Personnel & Partagé
          </span>
          <h1 className="text-xl font-bold text-[#1A365D] mt-0.5">
            Dossier de Santé de {currentUser?.firstName}
          </h1>
          <p className="text-xs text-[#718096] mt-0.5">
            Centralisez vos constantes physiologiques, bilans d'analyses et comptes-rendus.
          </p>
        </div>

        <button
          onClick={() => setShowMetricModal(true)}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-[#27AE60] text-white font-semibold text-xs hover:bg-[#219653] transition-colors shadow-xs active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Ajouter une Constante</span>
        </button>
      </div>

      {/* Health Vitals / Constantes Cards */}
      <div>
        <h2 className="text-sm font-bold text-[#1A365D] mb-3 px-1">
          Constantes Vitales Récemment Mesurées
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Blood Pressure */}
          <div className="p-4 rounded-2xl bg-white border border-[#EDF2F7] shadow-card">
            <div className="flex items-center justify-between text-[#EB5757] mb-2">
              <span className="text-xs font-bold">Tension</span>
              <Activity className="w-4 h-4" />
            </div>
            <div className="text-xl font-extrabold text-[#1A365D] font-mono">
              {latestBP ? `${latestBP.value}/${latestBP.value2 || '--'}` : '--/--'}
              <span className="text-xs font-normal text-[#718096] ml-1">mmHg</span>
            </div>
            <span className="text-[10px] text-[#27AE60] font-semibold block mt-1">
              {latestBP ? 'Normal / Équilibré' : 'Aucune donnée'}
            </span>
          </div>

          {/* Blood Sugar */}
          <div className="p-4 rounded-2xl bg-white border border-[#EDF2F7] shadow-card">
            <div className="flex items-center justify-between text-[#D97706] mb-2">
              <span className="text-xs font-bold">Glycémie</span>
              <Droplets className="w-4 h-4" />
            </div>
            <div className="text-xl font-extrabold text-[#1A365D] font-mono">
              {latestSugar ? latestSugar.value : '--'}
              <span className="text-xs font-normal text-[#718096] ml-1">g/L</span>
            </div>
            <span className="text-[10px] text-[#27AE60] font-semibold block mt-1">
              À jeun • Cible atteinte
            </span>
          </div>

          {/* Heart Rate */}
          <div className="p-4 rounded-2xl bg-white border border-[#EDF2F7] shadow-card">
            <div className="flex items-center justify-between text-[#2D9CDB] mb-2">
              <span className="text-xs font-bold">Pouls</span>
              <Heart className="w-4 h-4" />
            </div>
            <div className="text-xl font-extrabold text-[#1A365D] font-mono">
              {latestHR ? latestHR.value : '--'}
              <span className="text-xs font-normal text-[#718096] ml-1">bpm</span>
            </div>
            <span className="text-[10px] text-[#27AE60] font-semibold block mt-1">
              Rythme régulier
            </span>
          </div>

          {/* Weight */}
          <div className="p-4 rounded-2xl bg-white border border-[#EDF2F7] shadow-card">
            <div className="flex items-center justify-between text-[#8B5CF6] mb-2">
              <span className="text-xs font-bold">Poids</span>
              <Scale className="w-4 h-4" />
            </div>
            <div className="text-xl font-extrabold text-[#1A365D] font-mono">
              {latestWeight ? latestWeight.value : '--'}
              <span className="text-xs font-normal text-[#718096] ml-1">kg</span>
            </div>
            <span className="text-[10px] text-[#718096] font-medium block mt-1">
              IMC : 23.4 (Normal)
            </span>
          </div>
        </div>
      </div>

      {/* CMU Coverage Benefits Box */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-[#E9F7EF] to-[#E7F3FB] border border-[#27AE60]/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#27AE60]" />
            <h3 className="font-bold text-xs sm:text-sm text-[#1A365D]">
              Prise en charge Couverture Maladie Universelle (CMU)
            </h3>
          </div>
          <p className="text-xs text-[#4A5568] max-w-xl">
            Grâce à votre carte CMU active, 70% des frais de consultations conventionnées et médicaments essentiels sont directement pris en charge par l'État. Ticket modérateur patient : 30%.
          </p>
        </div>
        <div className="text-right shrink-0 bg-white/80 backdrop-blur-xs px-3 py-2 rounded-xl border border-white">
          <span className="text-[10px] text-[#718096] block uppercase font-bold">Taux de couverture</span>
          <span className="text-lg font-black text-[#27AE60]">70% CMU</span>
        </div>
      </div>

      {/* Medical Documents & Consultation Reports */}
      <div>
        <div className="flex items-center justify-between mb-3 px-1">
          <h2 className="text-sm font-bold text-[#1A365D]">
            Comptes-Rendus Médicaux & Résultats d'Examens ({medicalRecords.length})
          </h2>
        </div>

        <div className="space-y-3">
          {medicalRecords.map((record) => (
            <div
              key={record.id}
              className="p-5 rounded-3xl bg-white border border-[#EDF2F7] shadow-card hover:shadow-card-hover transition-all space-y-3"
            >
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-[#E7F3FB] text-[#2D9CDB] flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-[#1A365D]">{record.title}</h3>
                    <div className="flex items-center gap-2 text-xs text-[#718096] mt-0.5">
                      <span className="font-medium text-[#2D9CDB]">{record.doctorName}</span>
                      <span>•</span>
                      <span>{record.doctorSpecialty}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-[#718096]">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>
                    {new Date(record.consultationDate).toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </span>
                </div>
              </div>

              {record.description && (
                <p className="text-xs text-[#4A5568] leading-relaxed bg-[#F7FAFC] p-3 rounded-xl border border-[#EDF2F7]">
                  {record.description}
                </p>
              )}

              {record.diagnosis && (
                <div className="text-xs">
                  <span className="font-bold text-[#1A365D]">Diagnostic : </span>
                  <span className="text-[#4A5568]">{record.diagnosis}</span>
                </div>
              )}

              {record.prescription && (
                <div className="text-xs p-3 rounded-xl bg-[#E9F7EF] border border-[#27AE60]/20 text-[#1E7E34]">
                  <span className="font-bold block mb-0.5">Traitement prescrit :</span>
                  <span>{record.prescription}</span>
                </div>
              )}

              {record.tags && (
                <div className="flex items-center gap-1.5 pt-1">
                  {record.tags.map((t) => (
                    <span
                      key={t}
                      className="px-2.5 py-0.5 rounded-full bg-[#F7FAFC] border border-[#EDF2F7] text-[10px] text-[#718096]"
                    >
                      #{t}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}

          {medicalRecords.length === 0 && (
            <div className="py-12 text-center bg-white rounded-3xl border border-[#EDF2F7] p-6 text-[#718096] text-xs">
              Aucun document médical disponible pour le moment.
            </div>
          )}
        </div>
      </div>

      {/* Modal Add Health Metric */}
      {showMetricModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl relative border border-[#EDF2F7]">
            <button
              onClick={() => setShowMetricModal(false)}
              className="absolute top-4 right-4 p-2 rounded-full text-[#718096] hover:bg-[#F7FAFC]"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-bold text-base text-[#1A365D] mb-4">
              Enregistrer une constante vitale
            </h3>

            <form onSubmit={handleSaveMetric} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#1A365D] mb-1">
                  Type de mesure
                </label>
                <select
                  value={metricType}
                  onChange={(e) => setMetricType(e.target.value as any)}
                  className="w-full p-2.5 rounded-xl border border-[#EDF2F7] text-xs font-medium"
                >
                  <option value="bloodPressure">Tension artérielle (Systolique / Diastolique)</option>
                  <option value="bloodSugar">Glycémie à jeun (g/L)</option>
                  <option value="heartRate">Fréquence cardiaque / Pouls (bpm)</option>
                  <option value="weight">Poids corporel (kg)</option>
                </select>
              </div>

              {metricType === 'bloodPressure' ? (
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] text-[#718096] mb-1">
                      Systolique (ex: 120)
                    </label>
                    <input
                      type="number"
                      required
                      value={metricValue}
                      onChange={(e) => setMetricValue(Number(e.target.value))}
                      className="w-full p-2.5 rounded-xl border border-[#EDF2F7] text-xs font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-[#718096] mb-1">
                      Diastolique (ex: 80)
                    </label>
                    <input
                      type="number"
                      required
                      value={metricValue2}
                      onChange={(e) => setMetricValue2(Number(e.target.value))}
                      className="w-full p-2.5 rounded-xl border border-[#EDF2F7] text-xs font-bold"
                    />
                  </div>
                </div>
              ) : (
                <div>
                  <label className="block text-[11px] text-[#718096] mb-1">
                    Valeur mesurée
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={metricValue}
                    onChange={(e) => setMetricValue(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-[#EDF2F7] text-xs font-bold"
                  />
                </div>
              )}

              <div>
                <label className="block text-[11px] text-[#718096] mb-1">
                  Note ou contexte (optionnel)
                </label>
                <input
                  type="text"
                  value={metricNote}
                  onChange={(e) => setMetricNote(e.target.value)}
                  placeholder="Ex: Mesure au réveil"
                  className="w-full p-2.5 rounded-xl border border-[#EDF2F7] text-xs"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowMetricModal(false)}
                  className="flex-1 py-2.5 rounded-xl border border-[#EDF2F7] text-xs text-[#718096]"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-[#27AE60] text-white text-xs font-semibold hover:bg-[#219653]"
                >
                  Sauvegarder
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
