import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWallet } from '@solana/wallet-adapter-react';
import { X, Check, Loader2, AlertCircle, Wallet } from 'lucide-react';
import { cn } from '../lib/utils';
import { Toast } from './Toast';
import { sendDonation, getBalance } from '../lib/solana';
import { AmountSelector } from './AmountSelector';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

const PRESET_AMOUNTS = [5, 10, 25, 50];

export const DonationModal = ({
  isOpen,
  onClose,
  patientName,
  isUrgent,
  onDonationComplete,
}: {
  isOpen: boolean;
  onClose: () => void;
  patientName?: string;
  isUrgent?: boolean;
  onDonationComplete?: (amount: number) => void;
}) => {
  const wallet = useWallet();
  const { connected, publicKey } = wallet;
  const [step, setStep] = useState(1);
  const [amount, setAmount] = useState<number | ''>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');
  const [balance, setBalance] = useState<number | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setStep(1);
      setAmount('');
      setIsSuccess(false);
    }
  }, [isOpen]);

  useEffect(() => {
    const fetchBalance = async () => {
      if (connected && publicKey) {
        try {
          const bal = await getBalance(publicKey);
          setBalance(bal);
        } catch (error) {
          console.error('Error fetching balance:', error);
        }
      }
    };

    if (connected && publicKey) {
      fetchBalance();
    }
  }, [connected, publicKey]);

  const handleDonate = async () => {
    if (!amount || !connected) return;
    
    setIsProcessing(true);
    
    try {
      await sendDonation(
        wallet,
        Number(amount),
        () => {
          setIsProcessing(false);
          setIsSuccess(true);
          onDonationComplete?.(Number(amount));
          
          setTimeout(() => {
            setIsSuccess(false);
            onClose();
            setStep(1);
            setAmount('');
          }, 3000);
        },
        (error) => {
          setIsProcessing(false);
          setToastMessage(error.message);
          setToastType('error');
          setShowToast(true);
        }
      );
    } catch (error: any) {
      setIsProcessing(false);
      setToastMessage(error.message || 'Transaction failed');
      setToastType('error');
      setShowToast(true);
    }
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center"
            onClick={onClose}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-card-bg rounded-2xl p-6 w-full max-w-md mx-4 relative border border-gray-800"
              onClick={e => e.stopPropagation()}
            >
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-800 transition-colors"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>

              <div className="flex gap-2 mb-6">
                {[1, 2].map(i => (
                  <div
                    key={i}
                    className={cn(
                      "h-1 rounded-full flex-1 transition-colors",
                      step >= i ? (isUrgent ? "bg-urgent" : "bg-secondary") : "bg-gray-800"
                    )}
                  />
                ))}
              </div>

              <AnimatePresence mode="wait">
                {step === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div>
                      <h2 className="text-2xl font-bold text-primary">Make a Donation</h2>
                      {patientName && (
                        <p className="text-muted-text mt-1">Supporting {patientName}</p>
                      )}
                    </div>

                    {!connected ? (
                      <div className="space-y-4">
                        <div className="p-4 bg-gray-800/50 rounded-xl text-center space-y-3">
                          <Wallet className="w-6 h-6 text-secondary mx-auto" />
                          <p className="text-primary font-medium">Connect your wallet to donate</p>
                          <p className="text-sm text-muted-text">
                            You'll need a Solana wallet to make a donation
                          </p>
                        </div>
                        <WalletMultiButton className="w-full !justify-center" />
                      </div>
                    ) : (
                      <>
                        <AmountSelector
                          presetAmounts={PRESET_AMOUNTS}
                          value={amount}
                          onChange={setAmount}
                          error={amount === 0 ? "Amount must be greater than 0" : undefined}
                        />

                        {balance !== null && (
                          <div className="text-sm text-center text-muted-text">
                            Your balance: ◎ {balance.toFixed(4)}
                          </div>
                        )}

                        <button
                          onClick={() => setStep(2)}
                          disabled={!amount}
                          className={cn(
                            "w-full py-4 rounded-xl font-semibold transition-all",
                            amount
                              ? isUrgent
                                ? "bg-urgent text-white hover:bg-urgent/90"
                                : "bg-secondary text-white hover:bg-secondary/90"
                              : "bg-gray-800 text-gray-400 cursor-not-allowed"
                          )}
                        >
                          Continue
                        </button>
                      </>
                    )}
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div>
                      <h2 className="text-2xl font-bold text-primary">Confirm Donation</h2>
                      <p className="text-muted-text mt-1">Review your donation details</p>
                    </div>

                    <div className="bg-gray-900 rounded-xl p-4 space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Amount</span>
                        <span className="font-semibold text-primary">◎ {amount}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Network Fee</span>
                        <span className="font-semibold text-primary">◎ 0.000005</span>
                      </div>
                      <div className="pt-3 border-t border-gray-800">
                        <div className="flex justify-between">
                          <span className="font-semibold text-primary">Total</span>
                          <span className="font-semibold text-primary">
                            ◎ {Number(amount) + 0.000005}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <button
                        onClick={handleDonate}
                        disabled={isProcessing}
                        className={cn(
                          "w-full py-4 rounded-xl font-semibold transition-all",
                          isProcessing
                            ? "bg-gray-800 text-gray-400 cursor-not-allowed"
                            : isUrgent
                              ? "bg-urgent text-white hover:bg-urgent/90"
                              : "bg-secondary text-white hover:bg-secondary/90"
                        )}
                      >
                        {isProcessing ? (
                          <span className="flex items-center justify-center gap-2">
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Processing Transaction...
                          </span>
                        ) : (
                          "Confirm Donation"
                        )}
                      </button>
                      <button
                        onClick={() => setStep(1)}
                        disabled={isProcessing}
                        className="w-full py-4 rounded-xl font-semibold text-primary hover:bg-gray-800 transition-colors"
                      >
                        Back
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <AnimatePresence>
                {isSuccess && (
                  <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.5, opacity: 0 }}
                    className="absolute inset-0 bg-card-bg rounded-2xl flex flex-col items-center justify-center border border-gray-800"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", bounce: 0.5 }}
                      className="w-16 h-16 bg-green-900/50 rounded-full flex items-center justify-center mb-4"
                    >
                      <Check className="w-8 h-8 text-green-500" />
                    </motion.div>
                    <h3 className="text-xl font-semibold text-primary mb-2">
                      Thank You!
                    </h3>
                    <p className="text-muted-text text-center">
                      Your donation of ◎ {amount} has been processed successfully
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Toast
        message={toastMessage}
        type={toastType}
        isVisible={showToast}
        onClose={() => setShowToast(false)}
      />
    </>
  );
};