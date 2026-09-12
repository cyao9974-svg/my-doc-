import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Stethoscope, ShieldCheck, DollarSign, Clock, MapPin, Save, CheckCircle2 } from 'lucide-react';

export const DoctorProfileView: React.FC = () => {
  const { currentUser, doctors, verifyDoctor } = useApp();

  const myDoctor =
    doctors.find((d) => d.userId === currentUser?.id || d.email === currentUser?.email) ||
    doctors[0];

  const [specialty, setSpecialty] = useState(myDoctor?.specialty || 'Cardiologue');
  const [orderNumber, setOrderNumber] = useState(myDoctor?.orderNumber || '14285');
  const [price, setPrice] = useState(myDoctor?.consultationPrice || 15000);
  const [bio, setBio] = useState(myDoctor?.bio || '');
  const [address, setAddress] = useState(myDoctor?.address || '');
  const [city, setCity] = useState(myDoctor?.city || 'Cocody, Abidjan');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    myDoctor.specialty = specialty;
    myDoctor.orderNumber = orderNumber;
    myDoctor.consultationPrice = Number(price);
    myDoctor.bio = bio;
    myDoctor.address = address;
    myDoctor.city = city;

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in max-w-3xl mx-auto">
      {/* Header */}
      <div className="bg-white p-5 rounded-3xl border border-[#EDF2F7] shadow-card">
        <h1 className="text-xl font-bold text-[#1A365D]">Profil & Cabinet Médical</h1>
        <p className="text-xs text-[#718096] mt-0.5">
          Gérez vos informations professionnelles, tarifs et coordonnées de consultation.
        </p>
      </div>

      <form onSubmit={handleSave} className="bg-white p-6 rounded-3xl border border-[#EDF2F7] shadow-card space-y-5">
        <div className="flex items-center gap-4 border-b border-[#EDF2F7] pb-5">
          <div className="w-16 h-16 rounded-2xl overflow-hidden bg-[#E7F3FB] border border-[#EDF2F7] shrink-0">
            {myDoctor?.avatarUrl ? (
              <img
                src={myDoctor.avatarUrl}
                alt={myDoctor.firstName}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center font-bold text-xl text-[#2D9CDB]">
                Dr
              </div>
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-base text-[#1A365D]">
                Dr. {myDoctor?.firstName} {myDoctor?.lastName}
              </h3>
              {myDoctor?.isVerified && (
                <span className="flex items-center gap-1 text-[10px] font-semibold text-[#27AE60] bg-[#E9F7EF] px-2 py-0.5 rounded-full">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Certifié Ordre CI
                </span>
              )}
            </div>
            <span className="text-xs text-[#2D9CDB] font-medium block">{myDoctor?.specialty}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block font-semibold text-[#1A365D] mb-1">Spécialité médicale</label>
            <input
              type="text"
              required
              value={specialty}
              onChange={(e) => setSpecialty(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-[#EDF2F7] bg-[#F7FAFC] focus:bg-white focus:outline-none focus:border-[#2D9CDB]"
            />
          </div>

          <div>
            <label className="block font-semibold text-[#1A365D] mb-1">
              N° d'inscription à l'Ordre des Médecins
            </label>
            <input
              type="text"
              required
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-[#EDF2F7] bg-[#F7FAFC] font-mono focus:bg-white focus:outline-none focus:border-[#2D9CDB]"
            />
          </div>

          <div>
            <label className="block font-semibold text-[#1A365D] mb-1">
              Honoraires consultation (FCFA)
            </label>
            <input
              type="number"
              step="500"
              required
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              className="w-full p-2.5 rounded-xl border border-[#EDF2F7] bg-[#F7FAFC] font-bold text-sm text-[#1A365D] focus:bg-white focus:outline-none focus:border-[#2D9CDB]"
            />
          </div>

          <div>
            <label className="block font-semibold text-[#1A365D] mb-1">Commune / Ville</label>
            <input
              type="text"
              required
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-[#EDF2F7] bg-[#F7FAFC] focus:bg-white focus:outline-none focus:border-[#2D9CDB]"
            />
          </div>

          <div className="col-span-full">
            <label className="block font-semibold text-[#1A365D] mb-1">
              Adresse complète du cabinet
            </label>
            <input
              type="text"
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-[#EDF2F7] bg-[#F7FAFC] focus:bg-white focus:outline-none focus:border-[#2D9CDB]"
            />
          </div>

          <div className="col-span-full">
            <label className="block font-semibold text-[#1A365D] mb-1">
              Biographie & Présentation professionnelle
            </label>
            <textarea
              rows={4}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-[#EDF2F7] bg-[#F7FAFC] focus:bg-white focus:outline-none focus:border-[#2D9CDB]"
            />
          </div>
        </div>

        {/* Verification Status info */}
        <div className="p-3.5 rounded-2xl bg-[#F7FAFC] border border-[#EDF2F7] flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#27AE60]" />
            <div>
              <span className="font-bold text-[#1A365D] block">Vérification des diplômes</span>
              <span className="text-[#718096]">
                Documents conformes et validés par le Conseil National de l'Ordre des Médecins CI.
              </span>
            </div>
          </div>
          <span className="text-xs font-bold text-[#27AE60] bg-[#E9F7EF] px-2.5 py-1 rounded-xl">
            Vérifié
          </span>
        </div>

        {/* Save button */}
        <div className="pt-2 flex items-center justify-between">
          {savedSuccess && (
            <span className="flex items-center gap-1.5 text-xs text-[#27AE60] font-semibold">
              <CheckCircle2 className="w-4 h-4" />
              <span>Modifications appliquées !</span>
            </span>
          )}
          <button
            type="submit"
            className="ml-auto px-6 py-2.5 rounded-xl bg-[#2D9CDB] text-white font-semibold text-xs hover:bg-[#2587be] transition-colors shadow-xs flex items-center gap-1.5"
          >
            <Save className="w-4 h-4" />
            <span>Enregistrer le profil</span>
          </button>
        </div>
      </form>
    </div>
  );
};
