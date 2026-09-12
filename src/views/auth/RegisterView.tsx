import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import { ArrowLeft, User, Stethoscope, CheckCircle2 } from 'lucide-react';

interface RegisterViewProps {
  onSwitchToLogin: () => void;
}

export const RegisterView: React.FC<RegisterViewProps> = ({ onSwitchToLogin }) => {
  const { registerPatient, registerDoctor } = useApp();

  const [role, setRole] = useState<'patient' | 'doctor'>('patient');

  // Common fields
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [commune, setCommune] = useState('Cocody');

  // Patient fields
  const [cmuNumber, setCmuNumber] = useState('');
  const [profession, setProfession] = useState('');

  // Doctor fields
  const [specialty, setSpecialty] = useState('Médecine Générale');
  const [orderNumber, setOrderNumber] = useState('');
  const [consultationPrice, setConsultationPrice] = useState(15000);
  const [bio, setBio] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (role === 'patient') {
      registerPatient({
        firstName,
        lastName,
        phone,
        email,
        cmuNumber: cmuNumber || '1029384756',
        commune,
        city: 'Abidjan',
        profession: profession || 'Salarié',
      });
    } else {
      registerDoctor({
        firstName,
        lastName,
        phone,
        email,
        specialty,
        orderNumber: orderNumber || '28491',
        consultationPrice: Number(consultationPrice),
        city: `${commune}, Abidjan`,
        bio: bio || 'Praticien dévoué pour la santé en Côte d’Ivoire.',
      });
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl border border-[#EDF2F7] max-w-lg w-full p-6 sm:p-8 shadow-card space-y-6">
        <button
          onClick={onSwitchToLogin}
          className="flex items-center gap-1.5 text-xs font-semibold text-[#718096] hover:text-[#1A365D]"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Retour à la connexion</span>
        </button>

        <div>
          <h1 className="text-2xl font-bold text-[#1A365D]">Créer un compte</h1>
          <p className="text-xs text-[#718096] mt-0.5">
            Rejoignez le réseau national de santé numérique de Côte d'Ivoire.
          </p>
        </div>

        {/* Role Toggle */}
        <div className="grid grid-cols-2 gap-2 bg-[#F7FAFC] p-1.5 rounded-2xl border border-[#EDF2F7]">
          <button
            type="button"
            onClick={() => setRole('patient')}
            className={`py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
              role === 'patient'
                ? 'bg-white text-[#1A365D] shadow-xs'
                : 'text-[#718096] hover:text-[#1A365D]'
            }`}
          >
            <User className="w-4 h-4 text-[#2D9CDB]" />
            <span>Compte Patient</span>
          </button>

          <button
            type="button"
            onClick={() => setRole('doctor')}
            className={`py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
              role === 'doctor'
                ? 'bg-white text-[#1A365D] shadow-xs'
                : 'text-[#718096] hover:text-[#1A365D]'
            }`}
          >
            <Stethoscope className="w-4 h-4 text-[#27AE60]" />
            <span>Compte Médecin</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-[#1A365D] mb-1">Prénom</label>
              <input
                type="text"
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Ex: Jean"
                className="w-full p-2.5 rounded-xl border border-[#EDF2F7] bg-[#F7FAFC] focus:bg-white focus:outline-none focus:border-[#2D9CDB]"
              />
            </div>
            <div>
              <label className="block font-semibold text-[#1A365D] mb-1">Nom</label>
              <input
                type="text"
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Ex: Konan"
                className="w-full p-2.5 rounded-xl border border-[#EDF2F7] bg-[#F7FAFC] focus:bg-white focus:outline-none focus:border-[#2D9CDB]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-[#1A365D] mb-1">Téléphone (+225)</label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="07 00 00 00 00"
                className="w-full p-2.5 rounded-xl border border-[#EDF2F7] bg-[#F7FAFC] focus:bg-white focus:outline-none focus:border-[#2D9CDB]"
              />
            </div>
            <div>
              <label className="block font-semibold text-[#1A365D] mb-1">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nom@domaine.ci"
                className="w-full p-2.5 rounded-xl border border-[#EDF2F7] bg-[#F7FAFC] focus:bg-white focus:outline-none focus:border-[#2D9CDB]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-[#1A365D] mb-1">Commune</label>
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
                <option value="Autre région CI">Autre région CI</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-[#1A365D] mb-1">Mot de passe</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full p-2.5 rounded-xl border border-[#EDF2F7] bg-[#F7FAFC] focus:bg-white focus:outline-none focus:border-[#2D9CDB]"
              />
            </div>
          </div>

          {/* Conditional Fields based on Role */}
          {role === 'patient' ? (
            <div className="space-y-3 pt-1 border-t border-[#EDF2F7]">
              <div>
                <label className="block font-semibold text-[#1A365D] mb-1">
                  N° d'Immatriculation CMU (Couverture Maladie Universelle)
                </label>
                <input
                  type="text"
                  value={cmuNumber}
                  onChange={(e) => setCmuNumber(e.target.value)}
                  placeholder="Ex: 1029384756 (ou laissez vide pour génération auto)"
                  className="w-full p-2.5 rounded-xl border border-[#EDF2F7] bg-[#F7FAFC] font-mono focus:bg-white focus:outline-none focus:border-[#2D9CDB]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#1A365D] mb-1">Profession</label>
                <input
                  type="text"
                  value={profession}
                  onChange={(e) => setProfession(e.target.value)}
                  placeholder="Ex: Enseignant, Commerçant, Étudiant..."
                  className="w-full p-2.5 rounded-xl border border-[#EDF2F7] bg-[#F7FAFC]"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-3 pt-1 border-t border-[#EDF2F7]">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#1A365D] mb-1">Spécialité</label>
                  <select
                    value={specialty}
                    onChange={(e) => setSpecialty(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-[#EDF2F7] bg-[#F7FAFC]"
                  >
                    <option value="Médecine Générale">Médecine Générale</option>
                    <option value="Cardiologue">Cardiologue</option>
                    <option value="Pédiatre">Pédiatre</option>
                    <option value="Gynécologue Obstétricienne">Gynécologue Obstétricienne</option>
                    <option value="Dermatologue">Dermatologue</option>
                    <option value="Ophtalmologue">Ophtalmologue</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-[#1A365D] mb-1">N° Ordre des Médecins</label>
                  <input
                    type="text"
                    required
                    value={orderNumber}
                    onChange={(e) => setOrderNumber(e.target.value)}
                    placeholder="Ex: 19842"
                    className="w-full p-2.5 rounded-xl border border-[#EDF2F7] bg-[#F7FAFC] font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#1A365D] mb-1">
                  Tarif de consultation (FCFA)
                </label>
                <input
                  type="number"
                  step="500"
                  required
                  value={consultationPrice}
                  onChange={(e) => setConsultationPrice(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl border border-[#EDF2F7] bg-[#F7FAFC] font-bold"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#1A365D] mb-1">
                  Présentation / Biographie
                </label>
                <textarea
                  rows={2}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Expérience hospitalière, diplômes, domaines d'expertise..."
                  className="w-full p-2.5 rounded-xl border border-[#EDF2F7] bg-[#F7FAFC]"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-[#2D9CDB] text-white font-bold text-xs hover:bg-[#2587be] transition-colors shadow-xs"
          >
            Finaliser l'inscription
          </button>
        </form>

        <div className="pt-2 text-center text-xs text-[#718096]">
          <span>Déjà inscrit ? </span>
          <button onClick={onSwitchToLogin} className="font-bold text-[#2D9CDB] hover:underline">
            Se connecter
          </button>
        </div>
      </div>
    </div>
  );
};
