import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import {
  Phone,
  Mail,
  Lock,
  ArrowRight,
  ShieldCheck,
  User,
  Stethoscope,
  Shield,
  KeyRound,
} from 'lucide-react';

interface LoginViewProps {
  onSwitchToRegister: () => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onSwitchToRegister }) => {
  const { login, quickSwitchUser } = useApp();

  const [selectedRole, setSelectedRole] = useState<UserRole>('patient');
  const [identifier, setIdentifier] = useState('jean.kouassi@example.ci');
  const [password, setPassword] = useState('password123');
  const [step, setStep] = useState<'credentials' | 'otp'>('credentials');
  const [otp, setOtp] = useState('123456');
  const [errorMsg, setErrorMsg] = useState('');

  const handleCredentialsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    // Move to 2FA verification
    setStep('otp');
  };

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp !== '123456') {
      setErrorMsg('Code de sécurité incorrect. Entrez le code 123456.');
      return;
    }
    const success = login(identifier, selectedRole);
    if (!success) {
      setErrorMsg('Identifiants ou rôle incorrect.');
      setStep('credentials');
    }
  };

  const handleQuickDemo = (role: UserRole) => {
    quickSwitchUser(role);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl border border-[#EDF2F7] max-w-md w-full p-6 sm:p-8 shadow-card space-y-6">
        {/* Brand header */}
        <div className="text-center">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#2D9CDB] to-[#27AE60] flex items-center justify-center text-white font-bold text-2xl mx-auto shadow-xs mb-3">
            +
          </div>
          <h1 className="text-2xl font-bold text-[#1A365D]">Connexion MédiLink</h1>
          <p className="text-xs text-[#718096] mt-1">
            Votre plateforme de santé numérique et téléconsultation en Côte d'Ivoire.
          </p>
        </div>

        {/* 1-Click Demo Profiles */}
        <div className="p-3.5 bg-[#F7FAFC] rounded-2xl border border-[#EDF2F7] space-y-2">
          <p className="text-[10px] font-bold uppercase tracking-wider text-[#718096] text-center">
            Accès Rapide Démo (1 Clic)
          </p>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleQuickDemo('patient')}
              className="p-2.5 rounded-xl bg-white border border-[#EDF2F7] hover:border-[#2D9CDB] transition-all text-center flex flex-col items-center gap-1 shadow-xs"
            >
              <User className="w-4 h-4 text-[#2D9CDB]" />
              <span className="text-[11px] font-bold text-[#1A365D]">Patient</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickDemo('doctor')}
              className="p-2.5 rounded-xl bg-white border border-[#EDF2F7] hover:border-[#2D9CDB] transition-all text-center flex flex-col items-center gap-1 shadow-xs"
            >
              <Stethoscope className="w-4 h-4 text-[#27AE60]" />
              <span className="text-[11px] font-bold text-[#1A365D]">Médecin</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickDemo('admin')}
              className="p-2.5 rounded-xl bg-white border border-[#EDF2F7] hover:border-[#2D9CDB] transition-all text-center flex flex-col items-center gap-1 shadow-xs"
            >
              <Shield className="w-4 h-4 text-[#1A365D]" />
              <span className="text-[11px] font-bold text-[#1A365D]">Admin</span>
            </button>
          </div>
        </div>

        {/* Role Selector for manual form */}
        <div className="flex items-center gap-1 bg-[#F7FAFC] p-1 rounded-2xl border border-[#EDF2F7]">
          {(['patient', 'doctor', 'admin'] as const).map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => {
                setSelectedRole(r);
                if (r === 'patient') setIdentifier('jean.kouassi@example.ci');
                else if (r === 'doctor') setIdentifier('dr.koffi@medilink.ci');
                else setIdentifier('admin@mydoctor.ci');
              }}
              className={`flex-1 py-2 text-xs font-bold rounded-xl capitalize transition-all ${
                selectedRole === r
                  ? 'bg-white text-[#1A365D] shadow-xs'
                  : 'text-[#718096] hover:text-[#1A365D]'
              }`}
            >
              {r === 'patient' ? 'Patient' : r === 'doctor' ? 'Médecin' : 'Admin'}
            </button>
          ))}
        </div>

        {errorMsg && (
          <div className="p-3 rounded-xl bg-[#FFF0F0] border border-[#EB5757]/20 text-[#EB5757] text-xs font-medium">
            {errorMsg}
          </div>
        )}

        {step === 'credentials' ? (
          <form onSubmit={handleCredentialsSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-[#1A365D] mb-1.5">
                Numéro de téléphone ou Email
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="ex: 07 08 09 10 11 ou email"
                  className="w-full pl-3.5 pr-3.5 py-2.5 rounded-xl border border-[#EDF2F7] bg-[#F7FAFC] text-[#1A365D] focus:bg-white focus:outline-none focus:border-[#2D9CDB]"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="font-semibold text-[#1A365D]">Mot de passe</label>
                <span className="text-[11px] text-[#2D9CDB] cursor-pointer hover:underline">
                  Oublié ?
                </span>
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-3.5 pr-3.5 py-2.5 rounded-xl border border-[#EDF2F7] bg-[#F7FAFC] text-[#1A365D] focus:bg-white focus:outline-none focus:border-[#2D9CDB]"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-[#2D9CDB] text-white font-bold text-xs hover:bg-[#2587be] transition-colors shadow-xs flex items-center justify-center gap-2"
            >
              <span>Continuer vers la vérification 2FA</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        ) : (
          <form onSubmit={handleOtpSubmit} className="space-y-4 text-xs animate-in fade-in">
            <div className="text-center p-3 rounded-2xl bg-[#E7F3FB] text-[#2D9CDB]">
              <KeyRound className="w-8 h-8 mx-auto mb-1" />
              <p className="font-bold text-xs">Double Authentification (2FA)</p>
              <p className="text-[11px] text-[#718096] mt-0.5">
                Un code SMS a été envoyé à votre numéro. Entrez <strong>123456</strong> pour valider.
              </p>
            </div>

            <div>
              <label className="block font-semibold text-[#1A365D] mb-1.5 text-center">
                Code secret à 6 chiffres
              </label>
              <input
                type="text"
                maxLength={6}
                required
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full text-center tracking-[0.5em] font-mono text-xl py-2.5 rounded-xl border border-[#EDF2F7] bg-[#F7FAFC] font-bold text-[#1A365D]"
              />
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setStep('credentials')}
                className="flex-1 py-2.5 rounded-xl border border-[#EDF2F7] text-xs font-semibold text-[#718096]"
              >
                Retour
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 rounded-xl bg-[#27AE60] text-white font-bold text-xs hover:bg-[#219653]"
              >
                Valider la connexion
              </button>
            </div>
          </form>
        )}

        {/* Footer switch */}
        <div className="pt-4 border-t border-[#EDF2F7] text-center text-xs text-[#718096]">
          <span>Vous n'avez pas encore de compte ? </span>
          <button
            onClick={onSwitchToRegister}
            className="font-bold text-[#2D9CDB] hover:underline"
          >
            Créer un compte
          </button>
        </div>
      </div>
    </div>
  );
};
