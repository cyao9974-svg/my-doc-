import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { User, Shield, Lock, Phone, Mail, MapPin, Briefcase, Save, CheckCircle2 } from 'lucide-react';

export const PatientProfileView: React.FC = () => {
  const { currentUser, updateUserProfile, cmuCard, updateCmuCard } = useApp();

  const [firstName, setFirstName] = useState(currentUser?.firstName || '');
  const [lastName, setLastName] = useState(currentUser?.lastName || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [commune, setCommune] = useState(currentUser?.commune || 'Cocody');
  const [profession, setProfession] = useState(currentUser?.profession || '');
  const [is2FA, setIs2FA] = useState(currentUser?.is2FAEnabled ?? true);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({
      firstName,
      lastName,
      phone,
      email,
      commune,
      profession,
      is2FAEnabled: is2FA,
    });
    updateCmuCard({
      firstName,
      lastName: lastName.toUpperCase(),
      commune,
      profession,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in max-w-2xl mx-auto">
      {/* Header */}
      <div className="bg-white p-5 rounded-3xl border border-[#EDF2F7] shadow-card">
        <h1 className="text-xl font-bold text-[#1A365D]">Mon Profil & Paramètres</h1>
        <p className="text-xs text-[#718096] mt-0.5">
          Gérez vos données personnelles, vos accès sécurisés et vos coordonnées.
        </p>
      </div>

      <form onSubmit={handleSave} className="bg-white p-6 rounded-3xl border border-[#EDF2F7] shadow-card space-y-5">
        <div className="flex items-center gap-4 border-b border-[#EDF2F7] pb-5">
          <div className="w-16 h-16 rounded-2xl overflow-hidden bg-[#E7F3FB] border border-[#EDF2F7] shrink-0">
            {currentUser?.avatarUrl ? (
              <img
                src={currentUser.avatarUrl}
                alt={currentUser.firstName}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center font-bold text-xl text-[#2D9CDB]">
                {currentUser?.firstName[0]}
              </div>
            )}
          </div>
          <div>
            <h3 className="font-bold text-base text-[#1A365D]">
              {currentUser?.lastName.toUpperCase()} {currentUser?.firstName}
            </h3>
            <span className="text-xs text-[#2D9CDB] font-medium block">
              Patient CMU N° {cmuCard.cmuNumber}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block font-semibold text-[#1A365D] mb-1">Prénom</label>
            <input
              type="text"
              required
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-[#EDF2F7] bg-[#F7FAFC] focus:bg-white focus:outline-none focus:border-[#2D9CDB]"
            />
          </div>

          <div>
            <label className="block font-semibold text-[#1A365D] mb-1">Nom de famille</label>
            <input
              type="text"
              required
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-[#EDF2F7] bg-[#F7FAFC] focus:bg-white focus:outline-none focus:border-[#2D9CDB]"
            />
          </div>

          <div>
            <label className="block font-semibold text-[#1A365D] mb-1">Téléphone (+225)</label>
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-[#EDF2F7] bg-[#F7FAFC] focus:bg-white focus:outline-none focus:border-[#2D9CDB]"
            />
          </div>

          <div>
            <label className="block font-semibold text-[#1A365D] mb-1">Adresse Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-[#EDF2F7] bg-[#F7FAFC] focus:bg-white focus:outline-none focus:border-[#2D9CDB]"
            />
          </div>

          <div>
            <label className="block font-semibold text-[#1A365D] mb-1">Commune / Ville</label>
            <select
              value={commune}
              onChange={(e) => setCommune(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-[#EDF2F7] bg-[#F7FAFC] focus:bg-white focus:outline-none focus:border-[#2D9CDB]"
            >
              <option value="Cocody">Cocody</option>
              <option value="Plateau">Plateau</option>
              <option value="Marcory">Marcory</option>
              <option value="Yopougon">Yopougon</option>
              <option value="Treichville">Treichville</option>
              <option value="Koumassi">Koumassi</option>
              <option value="Port-Bouët">Port-Bouët</option>
              <option value="Bingerville">Bingerville</option>
              <option value="Autre région CI">Autre région CI</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-[#1A365D] mb-1">Profession</label>
            <input
              type="text"
              value={profession}
              onChange={(e) => setProfession(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-[#EDF2F7] bg-[#F7FAFC] focus:bg-white focus:outline-none focus:border-[#2D9CDB]"
            />
          </div>
        </div>

        {/* Security & 2FA Toggle */}
        <div className="pt-4 border-t border-[#EDF2F7]">
          <h4 className="text-xs font-bold text-[#1A365D] uppercase tracking-wider mb-2">
            Sécurité du compte
          </h4>
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#F7FAFC] border border-[#EDF2F7]">
            <div className="flex items-center gap-2.5">
              <Shield className="w-5 h-5 text-[#27AE60]" />
              <div>
                <span className="text-xs font-bold text-[#1A365D] block">
                  Authentification à Deux Facteurs (2FA)
                </span>
                <span className="text-[11px] text-[#718096]">
                  Code SMS ou prompt OTP à chaque connexion
                </span>
              </div>
            </div>
            <input
              type="checkbox"
              checked={is2FA}
              onChange={(e) => setIs2FA(e.target.checked)}
              className="w-4 h-4 text-[#2D9CDB] rounded-md accent-[#2D9CDB]"
            />
          </div>
        </div>

        {/* Save button */}
        <div className="pt-3 flex items-center justify-between">
          {savedSuccess && (
            <span className="flex items-center gap-1.5 text-xs text-[#27AE60] font-semibold">
              <CheckCircle2 className="w-4 h-4" />
              <span>Modifications enregistrées !</span>
            </span>
          )}
          <button
            type="submit"
            className="ml-auto px-6 py-2.5 rounded-xl bg-[#2D9CDB] text-white font-semibold text-xs hover:bg-[#2587be] transition-colors shadow-xs flex items-center gap-1.5"
          >
            <Save className="w-4 h-4" />
            <span>Enregistrer</span>
          </button>
        </div>
      </form>
    </div>
  );
};
