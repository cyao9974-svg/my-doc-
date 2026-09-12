import React, { useState } from 'react';
import { X, CheckCircle2, Loader2, ShieldCheck } from 'lucide-react';

interface MobileMoneyModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  amount: number;
  description: string;
  onSuccess: (provider: string, phone: string, ref: string) => void;
}

export const MobileMoneyModal: React.FC<MobileMoneyModalProps> = ({
  isOpen,
  onClose,
  title,
  amount,
  description,
  onSuccess,
}) => {
  const [selectedProvider, setSelectedProvider] = useState<'orange' | 'mtn' | 'moov' | 'wave'>('wave');
  const [phone, setPhone] = useState('0708091011');
  const [isProcessing, setIsProcessing] = useState(false);
  const [step, setStep] = useState<'form' | 'processing' | 'success'>('form');
  const [transactionRef, setTransactionRef] = useState('');

  if (!isOpen) return null;

  const providers = [
    { id: 'wave', name: 'Wave CI', color: 'bg-[#1DC4FA] text-white', fee: 'Gratuit' },
    { id: 'orange', name: 'Orange Money', color: 'bg-[#FF6600] text-white', fee: '1%' },
    { id: 'mtn', name: 'MTN MoMo', color: 'bg-[#FFCC00] text-black', fee: '1%' },
    { id: 'moov', name: 'Moov Money', color: 'bg-[#005BAC] text-white', fee: '1%' },
  ];

  const handlePay = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone) return;

    setIsProcessing(true);
    setStep('processing');

    const generatedRef = `${selectedProvider.toUpperCase()}_CI_${Math.floor(10000000 + Math.random() * 90000000)}`;
    setTransactionRef(generatedRef);

    // Simulate mobile payment prompt/approval
    setTimeout(() => {
      setIsProcessing(false);
      setStep('success');
      onSuccess(selectedProvider, phone, generatedRef);
    }, 1500);
  };

  const handleFinish = () => {
    setStep('form');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl relative border border-[#EDF2F7]">
        <button
          onClick={handleFinish}
          className="absolute top-4 right-4 p-2 rounded-full text-[#718096] hover:bg-[#F7FAFC] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {step === 'form' && (
          <div>
            <div className="text-center mb-5">
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-[#E7F3FB] text-[#2D9CDB]">
                Paiement Sécurisé Mobile Money
              </span>
              <h3 className="font-bold text-lg text-[#1A365D] mt-1.5">{title}</h3>
              <p className="text-xs text-[#718096] mt-0.5">{description}</p>
              <div className="mt-3 py-2 px-4 bg-[#F7FAFC] rounded-2xl border border-[#EDF2F7] inline-block">
                <span className="text-xs text-[#718096]">Montant à régler : </span>
                <span className="text-lg font-bold text-[#1A365D]">
                  {amount.toLocaleString('fr-FR')} FCFA
                </span>
              </div>
            </div>

            <form onSubmit={handlePay} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#1A365D] mb-1.5">
                  Choisissez votre opérateur
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {providers.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setSelectedProvider(p.id as any)}
                      className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                        selectedProvider === p.id
                          ? 'border-[#2D9CDB] bg-[#E7F3FB]/50 ring-2 ring-[#2D9CDB]/20'
                          : 'border-[#EDF2F7] hover:border-gray-300 bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[#1A365D]">{p.name}</span>
                        <div
                          className={`w-3 h-3 rounded-full border ${
                            selectedProvider === p.id
                              ? 'border-[#2D9CDB] bg-[#2D9CDB]'
                              : 'border-gray-300'
                          }`}
                        />
                      </div>
                      <span className="text-[10px] text-[#718096] mt-1">Frais: {p.fee}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1A365D] mb-1.5">
                  Numéro de téléphone mobile (+225)
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-[#718096]">
                    +225
                  </span>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="07 00 00 00 00"
                    className="w-full pl-16 pr-4 py-3 rounded-xl border border-[#EDF2F7] bg-[#F7FAFC] text-sm text-[#1A365D] focus:bg-white focus:outline-none focus:border-[#2D9CDB] focus:ring-2 focus:ring-[#2D9CDB]/20 transition-all font-mono font-medium"
                  />
                </div>
                <p className="text-[11px] text-[#718096] mt-1">
                  Une validation USSD ou notification push sera envoyée sur ce numéro.
                </p>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-[#2D9CDB] text-white font-semibold text-sm hover:bg-[#2587be] transition-colors shadow-xs active:scale-[0.99] flex items-center justify-center gap-2"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Confirmer le paiement ({amount.toLocaleString('fr-FR')} FCFA)</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {step === 'processing' && (
          <div className="py-10 text-center">
            <div className="w-16 h-16 rounded-full bg-[#E7F3FB] text-[#2D9CDB] flex items-center justify-center mx-auto mb-4 animate-spin">
              <Loader2 className="w-8 h-8" />
            </div>
            <h3 className="font-bold text-base text-[#1A365D]">Paiement en cours...</h3>
            <p className="text-xs text-[#718096] max-w-xs mx-auto mt-2">
              Veuillez confirmer l'opération sur votre téléphone en tapant votre code secret Mobile Money.
            </p>
          </div>
        )}

        {step === 'success' && (
          <div className="py-6 text-center">
            <div className="w-16 h-16 rounded-full bg-[#E9F7EF] text-[#27AE60] flex items-center justify-center mx-auto mb-3">
              <CheckCircle2 className="w-9 h-9" />
            </div>
            <h3 className="font-bold text-lg text-[#1A365D]">Paiement validé avec succès !</h3>
            <p className="text-xs text-[#718096] mt-1">
              Votre transaction a été approuvée par l'opérateur.
            </p>

            <div className="my-4 p-3 rounded-xl bg-[#F7FAFC] border border-[#EDF2F7] text-left text-xs space-y-1">
              <div className="flex justify-between">
                <span className="text-[#718096]">Référence :</span>
                <span className="font-mono font-bold text-[#1A365D]">{transactionRef}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#718096]">Montant débité :</span>
                <span className="font-bold text-[#27AE60]">{amount.toLocaleString('fr-FR')} FCFA</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#718096]">Opérateur :</span>
                <span className="capitalize font-medium text-[#1A365D]">{selectedProvider}</span>
              </div>
            </div>

            <button
              onClick={handleFinish}
              className="w-full py-2.5 rounded-xl bg-[#27AE60] text-white font-semibold text-sm hover:bg-[#219653] transition-colors shadow-xs"
            >
              Terminé
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
