import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  PhoneOff,
  MessageSquare,
  FileText,
  ShieldCheck,
  Send,
  User,
  Stethoscope,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const VideoCallModal: React.FC = () => {
  const { activeVideoCall, endVideoCall, addMedicalRecord, updateAppointmentStatus } = useApp();

  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [activeSidePanel, setActiveSidePanel] = useState<'none' | 'chat' | 'notes'>('none');
  const [callNotes, setCallNotes] = useState('');
  const [callPrescription, setCallPrescription] = useState('');
  const [chatMessages, setChatMessages] = useState<{ sender: string; text: string; time: string }[]>([
    { sender: 'Système', text: 'Connexion sécurisée de bout en bout établie.', time: '00:00' },
  ]);
  const [newChatMessage, setNewChatMessage] = useState('');

  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  // Timer
  useEffect(() => {
    if (!activeVideoCall) return;
    const interval = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [activeVideoCall]);

  // Request actual camera or gracefully fallback
  useEffect(() => {
    if (!activeVideoCall) return;

    let stream: MediaStream | null = null;
    navigator.mediaDevices?.getUserMedia({ video: true, audio: true })
      .then((s) => {
        stream = s;
        mediaStreamRef.current = s;
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = s;
        }
      })
      .catch(() => {
        // Expected if permission denied or no camera device
      });

    return () => {
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, [activeVideoCall]);

  if (!activeVideoCall) return null;

  const { appointment, isDoctor } = activeVideoCall;

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60).toString().padLeft(2, '0');
    const s = (secs % 60).toString().padLeft(2, '0');
    return `${m}:${s}`;
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChatMessage.trim()) return;
    setChatMessages((prev) => [
      ...prev,
      {
        sender: isDoctor ? appointment.doctorName : appointment.patientName,
        text: newChatMessage.trim(),
        time: formatTimer(elapsedSeconds),
      },
    ]);
    setNewChatMessage('');
  };

  const handleEndCall = () => {
    if (isDoctor && (callNotes.trim() || callPrescription.trim())) {
      addMedicalRecord({
        patientId: appointment.patientId,
        patientName: appointment.patientName,
        doctorId: appointment.doctorId,
        doctorName: appointment.doctorName,
        doctorSpecialty: appointment.doctorSpecialty,
        type: 'consultation',
        title: `Téléconsultation du ${new Date().toLocaleDateString('fr-FR')}`,
        diagnosis: callNotes || 'Consultation de suivi à distance',
        prescription: callPrescription || 'Aucune ordonnance émise',
        tags: ['Téléconsultation', appointment.doctorSpecialty],
        isConfidential: false,
        consultationDate: new Date().toISOString(),
      });
      updateAppointmentStatus(appointment.id, 'completed');
    }
    endVideoCall();
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#0A1B30] text-white animate-in fade-in">
      {/* Top Teleconsultation Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#1A365D]/60 backdrop-blur-md border-b border-white/10 z-10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#2D9CDB] flex items-center justify-center text-white">
            <Stethoscope className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-white">
                {isDoctor ? appointment.patientName : appointment.doctorName}
              </h2>
              <span className="flex items-center gap-1 text-[10px] font-semibold text-[#27AE60] bg-[#27AE60]/20 px-2 py-0.5 rounded-full border border-[#27AE60]/30">
                <ShieldCheck className="w-3 h-3" />
                HD Chiffré
              </span>
            </div>
            <p className="text-[11px] text-white/70">
              {appointment.doctorSpecialty} • Chambre Vidéo Sécurisée
            </p>
          </div>
        </div>

        {/* Timer display */}
        <div className="flex items-center gap-2 bg-black/40 px-3 py-1.5 rounded-full border border-white/10 font-mono text-sm font-semibold">
          <span className="w-2 h-2 rounded-full bg-[#EB5757] animate-pulse" />
          <span>{formatTimer(elapsedSeconds)}</span>
        </div>
      </div>

      {/* Main Video View Area */}
      <div className="flex-1 relative flex overflow-hidden">
        {/* Remote participant video (Main screen) */}
        <div className="flex-1 relative bg-[#0d1e34] flex items-center justify-center p-4">
          <div className="w-full h-full max-w-4xl max-h-[80vh] rounded-3xl overflow-hidden relative bg-[#132742] border border-white/10 shadow-2xl flex flex-col items-center justify-center">
            {/* Simulated Remote Doctor / Patient Feed with realistic backdrop */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 z-0 pointer-events-none" />

            {/* Remote Avatar / Simulation video */}
            <div className="flex flex-col items-center z-10 text-center px-4">
              <div className="w-28 h-28 rounded-full ring-4 ring-[#2D9CDB]/40 overflow-hidden shadow-2xl mb-4 bg-white/10 flex items-center justify-center">
                {isDoctor ? (
                  appointment.patientAvatar ? (
                    <img
                      src={appointment.patientAvatar}
                      alt={appointment.patientName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-12 h-12 text-white/60" />
                  )
                ) : appointment.doctorAvatar ? (
                  <img
                    src={appointment.doctorAvatar}
                    alt={appointment.doctorName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Stethoscope className="w-12 h-12 text-white/60" />
                )}
              </div>
              <h3 className="text-xl font-bold text-white">
                {isDoctor ? appointment.patientName : appointment.doctorName}
              </h3>
              <p className="text-sm text-[#2D9CDB] font-medium mt-0.5">
                {isDoctor ? 'Patient connecté' : `${appointment.doctorSpecialty} • En ligne`}
              </p>
              <p className="text-xs text-white/60 mt-2 max-w-xs">
                La communication audio et vidéo haute définition est active.
              </p>
            </div>

            {/* Local participant picture-in-picture */}
            <div className="absolute top-4 right-4 w-36 h-48 rounded-2xl overflow-hidden bg-black/60 border-2 border-white/20 shadow-xl z-20">
              <video
                ref={localVideoRef}
                autoPlay
                playsInline
                muted
                className={`w-full h-full object-cover ${isVideoOff ? 'hidden' : 'block'}`}
              />
              {isVideoOff && (
                <div className="w-full h-full flex flex-col items-center justify-center bg-gray-900 text-white/60 p-2 text-center text-xs">
                  <VideoOff className="w-6 h-6 mb-1" />
                  <span>Caméra désactivée</span>
                </div>
              )}
              <div className="absolute bottom-2 left-2 bg-black/70 px-1.5 py-0.5 rounded text-[10px] font-medium">
                Vous {isMuted && '(Muet)'}
              </div>
            </div>
          </div>
        </div>

        {/* Side Panel for Chat or Medical Notes */}
        {activeSidePanel !== 'none' && (
          <div className="w-80 border-l border-white/10 bg-[#132742] flex flex-col z-20 animate-in slide-in-from-right">
            {/* Side panel header */}
            <div className="p-3.5 border-b border-white/10 flex items-center justify-between">
              <h4 className="text-sm font-bold flex items-center gap-2">
                {activeSidePanel === 'chat' ? (
                  <>
                    <MessageSquare className="w-4 h-4 text-[#2D9CDB]" />
                    <span>Messagerie en direct</span>
                  </>
                ) : (
                  <>
                    <FileText className="w-4 h-4 text-[#27AE60]" />
                    <span>Ordonnance & Notes</span>
                  </>
                )}
              </h4>
              <button
                onClick={() => setActiveSidePanel('none')}
                className="text-xs text-white/60 hover:text-white p-1"
              >
                Fermer
              </button>
            </div>

            {/* Side panel body */}
            <div className="flex-1 p-3 overflow-y-auto space-y-3">
              {activeSidePanel === 'chat' ? (
                <div className="space-y-2">
                  {chatMessages.map((msg, i) => (
                    <div key={i} className="p-2.5 rounded-xl bg-white/5 border border-white/5 text-xs">
                      <div className="flex justify-between text-[10px] text-white/50 mb-1">
                        <span className="font-semibold text-[#2D9CDB]">{msg.sender}</span>
                        <span>{msg.time}</span>
                      </div>
                      <p className="text-white/90">{msg.text}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block font-semibold text-white/80 mb-1">
                      Observations & Diagnostic
                    </label>
                    <textarea
                      rows={4}
                      value={callNotes}
                      onChange={(e) => setCallNotes(e.target.value)}
                      placeholder="Notez les symptômes, diagnostics, examens recommandés..."
                      className="w-full p-2.5 rounded-xl bg-black/30 border border-white/15 text-white placeholder-white/40 text-xs focus:outline-none focus:border-[#2D9CDB]"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-white/80 mb-1">
                      Prescription / Ordonnance
                    </label>
                    <textarea
                      rows={4}
                      value={callPrescription}
                      onChange={(e) => setCallPrescription(e.target.value)}
                      placeholder="Médicaments, posologies, durée du traitement..."
                      className="w-full p-2.5 rounded-xl bg-black/30 border border-white/15 text-white placeholder-white/40 text-xs focus:outline-none focus:border-[#27AE60]"
                    />
                  </div>
                  <p className="text-[11px] text-white/50">
                    Ces notes seront automatiquement versées au dossier médical du patient dès la fin de consultation.
                  </p>
                </div>
              )}
            </div>

            {/* Side panel input for chat */}
            {activeSidePanel === 'chat' && (
              <form onSubmit={handleSendMessage} className="p-2 border-t border-white/10 flex gap-2">
                <input
                  type="text"
                  value={newChatMessage}
                  onChange={(e) => setNewChatMessage(e.target.value)}
                  placeholder="Écrire un message..."
                  className="flex-1 px-3 py-2 rounded-xl bg-black/30 border border-white/15 text-xs text-white placeholder-white/40 focus:outline-none focus:border-[#2D9CDB]"
                />
                <button
                  type="submit"
                  className="p-2 rounded-xl bg-[#2D9CDB] text-white hover:bg-[#2587be] transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            )}
          </div>
        )}
      </div>

      {/* Video Call Action Bar */}
      <div className="p-4 bg-[#1A365D]/80 backdrop-blur-md border-t border-white/10 flex items-center justify-center gap-3">
        {/* Audio Mute */}
        <button
          onClick={() => setIsMuted(!isMuted)}
          className={`p-3.5 rounded-2xl transition-all shadow-md ${
            isMuted
              ? 'bg-[#EB5757] text-white'
              : 'bg-white/10 hover:bg-white/20 text-white'
          }`}
          title={isMuted ? 'Activer le micro' : 'Couper le micro'}
        >
          {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
        </button>

        {/* Video Toggle */}
        <button
          onClick={() => setIsVideoOff(!isVideoOff)}
          className={`p-3.5 rounded-2xl transition-all shadow-md ${
            isVideoOff
              ? 'bg-[#EB5757] text-white'
              : 'bg-white/10 hover:bg-white/20 text-white'
          }`}
          title={isVideoOff ? 'Activer la caméra' : 'Couper la caméra'}
        >
          {isVideoOff ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5" />}
        </button>

        {/* Chat Toggle */}
        <button
          onClick={() =>
            setActiveSidePanel(activeSidePanel === 'chat' ? 'none' : 'chat')
          }
          className={`p-3.5 rounded-2xl transition-all shadow-md ${
            activeSidePanel === 'chat'
              ? 'bg-[#2D9CDB] text-white'
              : 'bg-white/10 hover:bg-white/20 text-white'
          }`}
          title="Messagerie en direct"
        >
          <MessageSquare className="w-5 h-5" />
        </button>

        {/* Notes Toggle (Doctor or Patient) */}
        <button
          onClick={() =>
            setActiveSidePanel(activeSidePanel === 'notes' ? 'none' : 'notes')
          }
          className={`p-3.5 rounded-2xl transition-all shadow-md ${
            activeSidePanel === 'notes'
              ? 'bg-[#27AE60] text-white'
              : 'bg-white/10 hover:bg-white/20 text-white'
          }`}
          title="Notes & Ordonnance"
        >
          <FileText className="w-5 h-5" />
        </button>

        {/* Disconnect / End Call */}
        <button
          onClick={handleEndCall}
          className="flex items-center gap-2 px-5 py-3.5 rounded-2xl bg-[#EB5757] hover:bg-[#d94343] text-white font-semibold text-sm transition-all shadow-lg active:scale-95 ml-2"
        >
          <PhoneOff className="w-5 h-5" />
          <span>Quitter</span>
        </button>
      </div>
    </div>
  );
};
