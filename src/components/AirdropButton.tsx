import { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { Loader2 } from 'lucide-react';
import { cn } from '../lib/utils';
import { requestAirdrop } from '../lib/solana';
import { Toast } from './Toast';

export const AirdropButton = ({ className }: { className?: string }) => {
  const { publicKey } = useWallet();
  const [isLoading, setIsLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');

  const handleAirdrop = async () => {
    if (!publicKey) return;

    setIsLoading(true);
    try {
      await requestAirdrop(publicKey);
      setToastMessage('Successfully received 2 SOL');
      setToastType('success');
    } catch (error) {
      setToastMessage('Failed to request SOL. Please try again.');
      setToastType('error');
    } finally {
      setIsLoading(false);
      setShowToast(true);
    }
  };

  if (!publicKey) return null;

  return (
    <>
      <button
        onClick={handleAirdrop}
        disabled={isLoading}
        className={cn(
          "px-4 py-2 bg-secondary/10 text-secondary rounded-lg text-sm font-medium",
          "hover:bg-secondary/20 transition-colors",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          className
        )}
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            Requesting SOL...
          </span>
        ) : (
          'Get Test SOL'
        )}
      </button>

      <Toast
        message={toastMessage}
        type={toastType}
        isVisible={showToast}
        onClose={() => setShowToast(false)}
      />
    </>
  );
};