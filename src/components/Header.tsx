import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  PhoneCall,
  User,
  Shield,
  Stethoscope,
  LogOut,
  ChevronDown,
  RotateCcw,
  Bell,
  CheckCircle2,
} from 'lucide-react';
import { UserRole } from '../types';

interface HeaderProps {
  onOpenEmergency?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenEmergency }) => {
  const { currentUser, quickSwitchUser, logout, resetDemoData, appointments } = useApp();
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showNotificationToast, setShowNotificationToast] = useState(false);

  const upcomingAptsCount = appointments.filter(
    (a) => a.status === 'confirmed' || a.status === 'pending'
  ).length;

  return (
    <header className="sticky top-0 z-40 bg-[#FFFFFF] border-b border-[#EDF2F7] shadow-xs px-4 py-3">
      <div className="max-w-5xl mx-auto flex items-center justify-between gap-2">
        {/* Brand & Logo */}
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#2D9CDB] to-[#27AE60] flex items-center justify-center text-white font-bold text-xl shadow-xs">
            +
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-lg tracking-tight text-[#1A365D]">my doctor</span>
              <span className="text-[10px] font-semibold tracking-wider uppercase px-1.5 py-0.5 rounded-full bg-[#E7F3FB] text-[#2D9CDB]">
                Care CI
              </span>
            </div>
            <p className="text-[11px] text-[#718096] -mt-0.5 hidden sm:block">
              Téléconsultation & Gestion Santé
            </p>
          </div>
        </div>

        {/* Right side controls */}
        <div className="flex items-center gap-2">
          {/* Emergency button */}
          <button
            id="emergency-header-btn"
            onClick={onOpenEmergency}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FFF0F0] text-[#EB5757] hover:bg-[#FFE5E5] transition-colors text-xs font-semibold"
            title="Numéros d'urgence Côte d'Ivoire (SAMU 185, Pompiers 180)"
          >
            <PhoneCall className="w-3.5 h-3.5 animate-pulse" />
            <span className="hidden sm:inline">Urgences</span>
            <span className="font-mono font-bold">185</span>
          </button>

          {/* Quick notification indicator */}
          <button
            onClick={() => setShowNotificationToast(!showNotificationToast)}
            className="relative p-2 rounded-xl text-[#4A5568] hover:bg-[#F7FAFC] transition-colors"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            {upcomingAptsCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-[#27AE60] rounded-full ring-2 ring-white" />
            )}
          </button>

          {/* User profile & Role switcher */}
          {currentUser && (
            <div className="relative">
              <button
                id="user-profile-menu-btn"
                onClick={() => setShowRoleMenu(!showRoleMenu)}
                className="flex items-center gap-2 pl-2 pr-2.5 py-1.5 rounded-xl border border-[#EDF2F7] hover:bg-[#F7FAFC] transition-colors text-xs font-medium"
              >
                <div className="w-6 h-6 rounded-full bg-[#E7F3FB] text-[#2D9CDB] flex items-center justify-center font-bold text-xs overflow-hidden">
                  {currentUser.avatarUrl ? (
                    <img
                      src={currentUser.avatarUrl}
                      alt={currentUser.firstName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    currentUser.firstName[0]
                  )}
                </div>
                <div className="text-left hidden md:block">
                  <div className="font-semibold text-[#1A365D] leading-tight">
                    {currentUser.firstName}
                  </div>
                  <div className="text-[10px] text-[#718096] capitalize">
                    {currentUser.role === 'doctor'
                      ? 'Médecin'
                      : currentUser.role === 'admin'
                      ? 'Administrateur'
                      : 'Patient'}
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-[#718096]" />
              </button>

              {/* Dropdown Menu */}
              {showRoleMenu && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-card border border-[#EDF2F7] p-2 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="px-3 py-2 border-b border-[#EDF2F7] mb-1">
                    <p className="text-[11px] font-semibold text-[#718096] uppercase tracking-wider">
                      Compte actif
                    </p>
                    <p className="font-bold text-sm text-[#1A365D]">
                      {currentUser.lastName.toUpperCase()} {currentUser.firstName}
                    </p>
                    <p className="text-xs text-[#718096]">{currentUser.email}</p>
                  </div>

                  <div className="py-1">
                    <p className="px-3 py-1 text-[10px] font-semibold text-[#718096] uppercase">
                      Changer de profil (Démo)
                    </p>
                    <button
                      onClick={() => {
                        quickSwitchUser('patient');
                        setShowRoleMenu(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-colors ${
                        currentUser.role === 'patient'
                          ? 'bg-[#E7F3FB] text-[#2D9CDB] font-semibold'
                          : 'text-[#4A5568] hover:bg-[#F7FAFC]'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <User className="w-3.5 h-3.5" />
                        <span>Espace Patient</span>
                      </div>
                      {currentUser.role === 'patient' && <CheckCircle2 className="w-3.5 h-3.5" />}
                    </button>

                    <button
                      onClick={() => {
                        quickSwitchUser('doctor');
                        setShowRoleMenu(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-colors ${
                        currentUser.role === 'doctor'
                          ? 'bg-[#E7F3FB] text-[#2D9CDB] font-semibold'
                          : 'text-[#4A5568] hover:bg-[#F7FAFC]'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Stethoscope className="w-3.5 h-3.5" />
                        <span>Espace Médecin (Dr. Koffi)</span>
                      </div>
                      {currentUser.role === 'doctor' && <CheckCircle2 className="w-3.5 h-3.5" />}
                    </button>

                    <button
                      onClick={() => {
                        quickSwitchUser('admin');
                        setShowRoleMenu(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-colors ${
                        currentUser.role === 'admin'
                          ? 'bg-[#E7F3FB] text-[#2D9CDB] font-semibold'
                          : 'text-[#4A5568] hover:bg-[#F7FAFC]'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Shield className="w-3.5 h-3.5" />
                        <span>Console Administrateur</span>
                      </div>
                      {currentUser.role === 'admin' && <CheckCircle2 className="w-3.5 h-3.5" />}
                    </button>
                  </div>

                  <div className="border-t border-[#EDF2F7] pt-1 mt-1 space-y-0.5">
                    <button
                      onClick={() => {
                        if (confirm('Voulez-vous réinitialiser les données de démonstration ?')) {
                          resetDemoData();
                          setShowRoleMenu(false);
                        }
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs text-[#718096] hover:bg-[#F7FAFC] rounded-xl transition-colors"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Réinitialiser les données</span>
                    </button>

                    <button
                      onClick={() => {
                        logout();
                        setShowRoleMenu(false);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs text-[#EB5757] hover:bg-[#FFF0F0] rounded-xl transition-colors font-medium"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Se déconnecter</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
