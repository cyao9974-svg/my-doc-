import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Shield,
  Users,
  Stethoscope,
  DollarSign,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Sliders,
  Search,
  FileCheck,
  UserX,
  UserCheck,
} from 'lucide-react';

export const AdminDashboardView: React.FC = () => {
  const {
    users,
    doctors,
    appointments,
    treatingRequests,
    systemSettings,
    verifyDoctor,
    toggleUserStatus,
    updateSystemSettings,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'overview' | 'doctors' | 'users' | 'settings'>('overview');
  const [doctorSearch, setDoctorSearch] = useState('');
  const [userSearch, setUserSearch] = useState('');
  const [msgQuota, setMsgQuota] = useState(systemSettings.messageQuota);
  const [manualApproval, setManualApproval] = useState(systemSettings.manualDoctorApproval);
  const [settingsSaved, setSettingsSaved] = useState(false);

  const totalRevenue = appointments
    .filter((a) => a.isPaid)
    .reduce((acc, curr) => acc + (curr.consultationPrice || 15000), 0);

  const treatingFeesTotal = treatingRequests.length * 750;

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateSystemSettings({
      messageQuota: Number(msgQuota),
      manualDoctorApproval: manualApproval,
    });
    setSettingsSaved(true);
    setTimeout(() => setSettingsSaved(false), 2000);
  };

  const filteredDoctors = doctors.filter(
    (d) =>
      d.firstName.toLowerCase().includes(doctorSearch.toLowerCase()) ||
      d.lastName.toLowerCase().includes(doctorSearch.toLowerCase()) ||
      d.specialty.toLowerCase().includes(doctorSearch.toLowerCase()) ||
      d.orderNumber.includes(doctorSearch)
  );

  const filteredUsers = users.filter(
    (u) =>
      u.firstName.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.lastName.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.phone.includes(userSearch)
  );

  return (
    <div className="space-y-6 pb-12 animate-in fade-in max-w-5xl mx-auto">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 rounded-3xl border border-[#EDF2F7] shadow-card">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#1A365D] text-white flex items-center justify-center shrink-0">
            <Shield className="w-6 h-6 text-[#2D9CDB]" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#2D9CDB]">
              Supervision Régulée • Côte d'Ivoire
            </span>
            <h1 className="text-xl font-bold text-[#1A365D]">Console d'Administration</h1>
            <p className="text-xs text-[#718096]">
              Contrôle de conformité de l'Ordre des Médecins, gestion des comptes et flux financiers.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-[#E9F7EF] text-[#27AE60] border border-[#27AE60]/20 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#27AE60] animate-ping" />
            Système Opérationnel
          </span>
        </div>
      </div>

      {/* Admin Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-[#EDF2F7] pb-2">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'overview'
              ? 'bg-[#1A365D] text-white shadow-xs'
              : 'text-[#718096] hover:bg-[#F7FAFC]'
          }`}
        >
          Vue Générale
        </button>

        <button
          onClick={() => setActiveTab('doctors')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
            activeTab === 'doctors'
              ? 'bg-[#1A365D] text-white shadow-xs'
              : 'text-[#718096] hover:bg-[#F7FAFC]'
          }`}
        >
          <span>Validation Médecins</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-[#2D9CDB] text-white">
            {doctors.filter((d) => !d.isVerified).length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'users'
              ? 'bg-[#1A365D] text-white shadow-xs'
              : 'text-[#718096] hover:bg-[#F7FAFC]'
          }`}
        >
          Utilisateurs ({users.length})
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'settings'
              ? 'bg-[#1A365D] text-white shadow-xs'
              : 'text-[#718096] hover:bg-[#F7FAFC]'
          }`}
        >
          Configuration Système
        </button>
      </div>

      {/* OVERVIEW TAB */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
            <div className="p-5 rounded-3xl bg-white border border-[#EDF2F7] shadow-card">
              <span className="text-xs font-bold text-[#718096] block mb-1">Total Utilisateurs</span>
              <div className="text-2xl font-black text-[#1A365D] font-mono">{users.length}</div>
              <span className="text-[11px] text-[#2D9CDB] mt-1 block">
                {users.filter((u) => u.role === 'patient').length} patients • {doctors.length} praticiens
              </span>
            </div>

            <div className="p-5 rounded-3xl bg-white border border-[#EDF2F7] shadow-card">
              <span className="text-xs font-bold text-[#718096] block mb-1">Téléconsultations</span>
              <div className="text-2xl font-black text-[#27AE60] font-mono">
                {appointments.length}
              </div>
              <span className="text-[11px] text-[#718096] mt-1 block">
                {appointments.filter((a) => a.status === 'completed').length} réalisées
              </span>
            </div>

            <div className="p-5 rounded-3xl bg-white border border-[#EDF2F7] shadow-card">
              <span className="text-xs font-bold text-[#718096] block mb-1">Volume Consultations</span>
              <div className="text-xl font-black text-[#1A365D] font-mono">
                {totalRevenue.toLocaleString('fr-FR')} FCFA
              </div>
              <span className="text-[11px] text-[#27AE60] mt-1 block">Règlements Mobile Money</span>
            </div>

            <div className="p-5 rounded-3xl bg-white border border-[#EDF2F7] shadow-card">
              <span className="text-xs font-bold text-[#718096] block mb-1">Dossiers Traitants</span>
              <div className="text-xl font-black text-[#9333EA] font-mono">
                {treatingFeesTotal.toLocaleString('fr-FR')} FCFA
              </div>
              <span className="text-[11px] text-[#718096] mt-1 block">
                {treatingRequests.length} adhésions (750 FCFA)
              </span>
            </div>
          </div>

          {/* Compliance notice */}
          <div className="p-5 rounded-3xl bg-[#F7FAFC] border border-[#EDF2F7] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h3 className="font-bold text-sm text-[#1A365D]">
                Conformité Réglementaire Ministère de la Santé & Hygiène Publique
              </h3>
              <p className="text-xs text-[#718096] max-w-xl">
                Tous les flux de téléconsultations et d'ordonnances sont horodatés et chiffrés conformément aux directives de protection des données de santé personnelles en Côte d'Ivoire.
              </p>
            </div>
            <span className="px-3 py-1 bg-white border border-[#EDF2F7] rounded-xl text-xs font-mono font-bold text-[#1A365D] shrink-0">
              ISO 27001 / HDS Compliant
            </span>
          </div>
        </div>
      )}

      {/* DOCTORS VALIDATION TAB */}
      {activeTab === 'doctors' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-base font-bold text-[#1A365D]">Contrôle des Praticiens</h2>
              <p className="text-xs text-[#718096]">
                Vérification du diplôme et de l'inscription au tableau de l'Ordre National des Médecins.
              </p>
            </div>

            <div className="relative">
              <Search className="w-3.5 h-3.5 text-[#718096] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={doctorSearch}
                onChange={(e) => setDoctorSearch(e.target.value)}
                placeholder="Rechercher praticien..."
                className="pl-9 pr-3 py-1.5 rounded-xl border border-[#EDF2F7] text-xs"
              />
            </div>
          </div>

          <div className="space-y-3">
            {filteredDoctors.map((doc) => (
              <div
                key={doc.id}
                className="p-4 rounded-3xl bg-white border border-[#EDF2F7] shadow-card flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl overflow-hidden bg-[#E7F3FB] border border-[#EDF2F7] shrink-0">
                    {doc.avatarUrl ? (
                      <img src={doc.avatarUrl} alt={doc.firstName} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center font-bold text-sm text-[#2D9CDB]">
                        Dr
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-sm text-[#1A365D]">
                        Dr. {doc.firstName} {doc.lastName}
                      </h4>
                      <span className="font-mono text-xs bg-[#F7FAFC] px-2 py-0.5 rounded border border-[#EDF2F7]">
                        Ordre N° {doc.orderNumber}
                      </span>
                    </div>
                    <p className="text-xs text-[#2D9CDB] font-medium">{doc.specialty}</p>
                    <p className="text-[11px] text-[#718096] mt-0.5">
                      {doc.address}, {doc.city} • Tarif: {doc.consultationPrice.toLocaleString('fr-FR')} FCFA
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {doc.isVerified ? (
                    <div className="flex items-center gap-2">
                      <span className="flex items-center gap-1 text-xs text-[#27AE60] font-semibold bg-[#E9F7EF] px-3 py-1 rounded-xl">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Validé</span>
                      </span>
                      <button
                        onClick={() => verifyDoctor(doc.id, false)}
                        className="p-1.5 rounded-xl text-[#718096] hover:text-[#EB5757] hover:bg-[#FFF0F0]"
                        title="Révoquer la validation"
                      >
                        <XCircle className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-[#C05621] bg-[#FFF4E8] px-2.5 py-1 rounded-xl font-medium">
                        En attente
                      </span>
                      <button
                        onClick={() => verifyDoctor(doc.id, true)}
                        className="px-3.5 py-1.5 rounded-xl bg-[#27AE60] text-white text-xs font-semibold hover:bg-[#219653]"
                      >
                        Approuver
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* USERS TAB */}
      {activeTab === 'users' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-base font-bold text-[#1A365D]">Gestion des Comptes</h2>
              <p className="text-xs text-[#718096]">
                Suspension préventive, contrôle 2FA et informations de contact.
              </p>
            </div>

            <div className="relative">
              <Search className="w-3.5 h-3.5 text-[#718096] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                placeholder="Nom, email ou tél..."
                className="pl-9 pr-3 py-1.5 rounded-xl border border-[#EDF2F7] text-xs"
              />
            </div>
          </div>

          <div className="space-y-2.5">
            {filteredUsers.map((u) => (
              <div
                key={u.id}
                className="p-3.5 rounded-2xl bg-white border border-[#EDF2F7] flex items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#F7FAFC] border border-[#EDF2F7] flex items-center justify-center font-bold text-xs text-[#1A365D]">
                    {u.firstName[0]}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-[#1A365D]">
                        {u.lastName.toUpperCase()} {u.firstName}
                      </span>
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.2 rounded-full capitalize ${
                          u.role === 'admin'
                            ? 'bg-[#1A365D] text-white'
                            : u.role === 'doctor'
                            ? 'bg-[#E7F3FB] text-[#2D9CDB]'
                            : 'bg-[#E9F7EF] text-[#27AE60]'
                        }`}
                      >
                        {u.role}
                      </span>
                    </div>
                    <span className="text-[#718096] text-[11px]">
                      {u.email} • {u.phone} {u.cmuNumber && `• CMU: ${u.cmuNumber}`}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${
                      u.status === 'active'
                        ? 'bg-[#E9F7EF] text-[#27AE60]'
                        : 'bg-[#FFF0F0] text-[#EB5757]'
                    }`}
                  >
                    {u.status === 'active' ? 'Actif' : 'Suspendu'}
                  </span>

                  {u.role !== 'admin' && (
                    <button
                      onClick={() => toggleUserStatus(u.id)}
                      className={`px-3 py-1 rounded-xl text-xs font-semibold transition-colors ${
                        u.status === 'active'
                          ? 'border border-[#EB5757] text-[#EB5757] hover:bg-[#FFF0F0]'
                          : 'bg-[#27AE60] text-white hover:bg-[#219653]'
                      }`}
                    >
                      {u.status === 'active' ? 'Suspendre' : 'Réactiver'}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SETTINGS TAB */}
      {activeTab === 'settings' && (
        <form onSubmit={handleSaveSettings} className="bg-white p-6 rounded-3xl border border-[#EDF2F7] shadow-card space-y-5">
          <div>
            <h2 className="text-base font-bold text-[#1A365D]">Paramètres Généraux de l'Application</h2>
            <p className="text-xs text-[#718096]">
              Règles de messagerie et validation des nouveaux praticiens.
            </p>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-[#1A365D] mb-1">
                Quota de messages gratuits par patient par mois
              </label>
              <input
                type="number"
                min="1"
                max="100"
                value={msgQuota}
                onChange={(e) => setMsgQuota(Number(e.target.value))}
                className="w-full sm:w-48 p-2.5 rounded-xl border border-[#EDF2F7] font-bold"
              />
              <p className="text-[11px] text-[#718096] mt-1">
                Limite le nombre d'échanges de conseils médicaux non facturés.
              </p>
            </div>

            <div className="pt-3 border-t border-[#EDF2F7] flex items-center justify-between">
              <div>
                <span className="font-bold text-[#1A365D] block">
                  Validation manuelle obligatoire des médecins
                </span>
                <span className="text-[11px] text-[#718096]">
                  Exige l'approbation d'un administrateur avant que le médecin ne soit visible et réservable.
                </span>
              </div>
              <input
                type="checkbox"
                checked={manualApproval}
                onChange={(e) => setManualApproval(e.target.checked)}
                className="w-4 h-4 accent-[#2D9CDB]"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-[#EDF2F7] flex items-center justify-between">
            {settingsSaved && (
              <span className="flex items-center gap-1.5 text-xs text-[#27AE60] font-semibold">
                <CheckCircle2 className="w-4 h-4" />
                <span>Paramètres enregistrés !</span>
              </span>
            )}
            <button
              type="submit"
              className="ml-auto px-5 py-2.5 rounded-xl bg-[#2D9CDB] text-white font-semibold text-xs hover:bg-[#2587be]"
            >
              Mettre à jour la configuration
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
