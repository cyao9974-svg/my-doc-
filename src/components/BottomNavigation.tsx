import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Home,
  Calendar,
  MessageSquare,
  FileText,
  User,
  Users,
  Shield,
  Stethoscope,
} from 'lucide-react';

interface BottomNavigationProps {
  currentTab: number;
  onSelectTab: (index: number) => void;
}

export const BottomNavigation: React.FC<BottomNavigationProps> = ({
  currentTab,
  onSelectTab,
}) => {
  const { currentUser, appointments, messages } = useApp();

  if (!currentUser) return null;

  // Unread messages / upcoming counts for badges
  const pendingAptsCount = appointments.filter(
    (a) =>
      (a.patientId === currentUser.id || a.doctorId === currentUser.id) &&
      (a.status === 'confirmed' || a.status === 'pending')
  ).length;

  const patientTabs = [
    { label: 'Accueil', icon: Home },
    { label: 'Rendez-vous', icon: Calendar, badge: pendingAptsCount },
    { label: 'Messages', icon: MessageSquare },
    { label: 'Dossier', icon: FileText },
    { label: 'Profil', icon: User },
  ];

  const doctorTabs = [
    { label: 'Accueil', icon: Stethoscope },
    { label: 'Agenda', icon: Calendar, badge: pendingAptsCount },
    { label: 'Messages', icon: MessageSquare },
    { label: 'Patients', icon: Users },
    { label: 'Cabinet', icon: User },
  ];

  const adminTabs = [
    { label: 'Supervision', icon: Shield },
    { label: 'Utilisateurs', icon: Users },
    { label: 'Profil', icon: User },
  ];

  const activeTabs =
    currentUser.role === 'doctor'
      ? doctorTabs
      : currentUser.role === 'admin'
      ? adminTabs
      : patientTabs;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-[#EDF2F7] shadow-lg py-2 px-3">
      <div className="max-w-md mx-auto flex items-center justify-around">
        {activeTabs.map((tab, idx) => {
          const Icon = tab.icon;
          const isActive = currentTab === idx;

          return (
            <button
              key={tab.label}
              onClick={() => onSelectTab(idx)}
              className={`relative flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all ${
                isActive
                  ? 'text-[#2D9CDB] font-bold scale-105'
                  : 'text-[#718096] hover:text-[#1A365D]'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5px]' : 'stroke-2'}`} />
                {Boolean(tab.badge && tab.badge > 0) && (
                  <span className="absolute -top-1.5 -right-2.5 min-w-[16px] h-4 px-1 rounded-full bg-[#EB5757] text-white text-[9px] font-extrabold flex items-center justify-center ring-2 ring-white">
                    {tab.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] mt-1 whitespace-nowrap">{tab.label}</span>
              {isActive && (
                <span className="absolute -bottom-1 w-5 h-1 bg-[#2D9CDB] rounded-full" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
