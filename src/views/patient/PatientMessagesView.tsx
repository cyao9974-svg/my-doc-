import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Send, MessageSquare, ShieldCheck, Stethoscope, User } from 'lucide-react';

export const PatientMessagesView: React.FC = () => {
  const { currentUser, doctors, messages, sendMessage, systemSettings } = useApp();

  const [selectedDoctorId, setSelectedDoctorId] = useState<string>(doctors[0]?.id || '');
  const [inputText, setInputText] = useState('');

  const selectedDoctor = doctors.find((d) => d.id === selectedDoctorId) || doctors[0];
  const conversationId = `conv_${selectedDoctor?.id}_${currentUser?.id}`;
  const conversationMessages = messages[conversationId] || [];

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    sendMessage(conversationId, inputText);
    setInputText('');
  };

  return (
    <div className="bg-white rounded-3xl border border-[#EDF2F7] shadow-card overflow-hidden h-[calc(100vh-175px)] min-h-[500px] flex flex-col md:flex-row animate-in fade-in">
      {/* Sidebar: Doctor conversation list */}
      <div className="w-full md:w-80 border-b md:border-b-0 md:border-r border-[#EDF2F7] flex flex-col bg-[#FDFCF8]">
        <div className="p-4 border-b border-[#EDF2F7]">
          <h2 className="font-bold text-sm text-[#1A365D] flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-[#2D9CDB]" />
            <span>Messages & Conseils Médicaux</span>
          </h2>
          <p className="text-[11px] text-[#718096] mt-0.5">
            Échangez directement avec vos médecins
          </p>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-[#EDF2F7]">
          {doctors.map((doc) => {
            const convId = `conv_${doc.id}_${currentUser?.id}`;
            const lastMsg = messages[convId]?.slice(-1)[0];
            const isSelected = selectedDoctorId === doc.id;

            return (
              <button
                key={doc.id}
                onClick={() => setSelectedDoctorId(doc.id)}
                className={`w-full p-3.5 text-left flex items-center gap-3 transition-colors ${
                  isSelected ? 'bg-white border-l-4 border-l-[#2D9CDB]' : 'hover:bg-white/60'
                }`}
              >
                <div className="relative shrink-0">
                  <div className="w-11 h-11 rounded-2xl overflow-hidden bg-[#F7FAFC] border border-[#EDF2F7]">
                    {doc.avatarUrl ? (
                      <img
                        src={doc.avatarUrl}
                        alt={doc.firstName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center font-bold text-sm text-[#2D9CDB] bg-[#E7F3FB]">
                        {doc.firstName[0]}
                      </div>
                    )}
                  </div>
                  {doc.isOnline && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-[#27AE60] border-2 border-white rounded-full" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-xs text-[#1A365D] truncate">
                      Dr. {doc.firstName} {doc.lastName}
                    </h4>
                    {lastMsg && (
                      <span className="text-[10px] text-[#718096]">
                        {new Date(lastMsg.timestamp).toLocaleTimeString('fr-FR', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-[#2D9CDB] truncate">{doc.specialty}</p>
                  <p className="text-[11px] text-[#718096] truncate mt-0.5">
                    {lastMsg ? lastMsg.content : 'Nouvelle conversation'}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Quota reminder footer */}
        <div className="p-3 bg-[#E7F3FB]/50 border-t border-[#EDF2F7] text-[11px] text-[#2D9CDB] flex items-center justify-between">
          <span>Quota messagerie mensuel</span>
          <span className="font-bold font-mono">
            {conversationMessages.length}/{systemSettings.messageQuota}
          </span>
        </div>
      </div>

      {/* Main Chat Thread */}
      {selectedDoctor ? (
        <div className="flex-1 flex flex-col h-full bg-white">
          {/* Chat Header */}
          <div className="p-3.5 border-b border-[#EDF2F7] flex items-center justify-between bg-white">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl overflow-hidden bg-[#F7FAFC] border border-[#EDF2F7]">
                {selectedDoctor.avatarUrl ? (
                  <img
                    src={selectedDoctor.avatarUrl}
                    alt={selectedDoctor.firstName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center font-bold text-sm text-[#2D9CDB]">
                    {selectedDoctor.firstName[0]}
                  </div>
                )}
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-bold text-sm text-[#1A365D]">
                    Dr. {selectedDoctor.firstName} {selectedDoctor.lastName}
                  </h3>
                  <ShieldCheck className="w-3.5 h-3.5 text-[#27AE60]" />
                </div>
                <p className="text-[11px] text-[#718096]">
                  {selectedDoctor.specialty} • Ordre N° {selectedDoctor.orderNumber}
                </p>
              </div>
            </div>

            <span className="text-[10px] font-semibold text-[#27AE60] bg-[#E9F7EF] px-2 py-0.5 rounded-full">
              {selectedDoctor.isOnline ? 'En ligne' : 'Réponse sous 24h'}
            </span>
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#FBFBFA]">
            {conversationMessages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-[#718096]">
                <Stethoscope className="w-10 h-10 text-[#2D9CDB]/40 mb-2" />
                <h4 className="font-bold text-sm text-[#1A365D]">Démarrez la discussion</h4>
                <p className="text-xs max-w-xs mt-1">
                  Posez vos questions non urgentes, demandez des précisions sur votre ordonnance ou transmettez vos mesures de santé.
                </p>
              </div>
            ) : (
              conversationMessages.map((msg) => {
                const isMe = msg.senderId === currentUser?.id;
                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-md p-3.5 rounded-2xl text-xs leading-relaxed ${
                        isMe
                          ? 'bg-[#2D9CDB] text-white rounded-br-xs shadow-xs'
                          : 'bg-white text-[#1A365D] border border-[#EDF2F7] rounded-bl-xs shadow-xs'
                      }`}
                    >
                      <p>{msg.content}</p>
                    </div>
                    <span className="text-[10px] text-[#718096] mt-1 px-1">
                      {new Date(msg.timestamp).toLocaleTimeString('fr-FR', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                );
              })
            )}
          </div>

          {/* Input Bar */}
          <form onSubmit={handleSend} className="p-3 border-t border-[#EDF2F7] flex items-center gap-2 bg-white">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Écrivez un message sécurisé au Dr. ..."
              className="flex-1 px-4 py-2.5 rounded-xl bg-[#F7FAFC] border border-[#EDF2F7] text-xs text-[#1A365D] placeholder-[#718096] focus:bg-white focus:outline-none focus:border-[#2D9CDB]"
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="p-2.5 rounded-xl bg-[#2D9CDB] text-white hover:bg-[#2587be] disabled:opacity-40 transition-colors shadow-xs"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center p-8 text-center text-[#718096]">
          Sélectionnez un praticien pour commencer la discussion.
        </div>
      )}
    </div>
  );
};
