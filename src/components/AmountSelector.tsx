import { useState } from 'react';
import { cn } from '../lib/utils';

interface AmountSelectorProps {
  presetAmounts: number[];
  value: number | '';
  onChange: (amount: number) => void;
  className?: string;
  error?: string;
}

export const AmountSelector = ({
  presetAmounts,
  value,
  onChange,
  className,
  error,
}: AmountSelectorProps) => {
  const [customAmount, setCustomAmount] = useState<string>('');

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const amount = e.target.value;
    setCustomAmount(amount);
    if (amount) {
      onChange(Number(amount));
    }
  };

  return (
    <div className={cn("space-y-4", className)}>
      <div className="grid grid-cols-2 gap-3">
        {presetAmounts.map(amount => (
          <button
            key={amount}
            onClick={() => {
              onChange(amount);
              setCustomAmount('');
            }}
            className={cn(
              "p-4 rounded-xl border-2 font-semibold transition-all",
              value === amount
                ? "border-secondary text-secondary bg-secondary/10"
                : "border-gray-800 text-primary hover:border-gray-700"
            )}
          >
            ◎ {amount}
          </button>
        ))}
      </div>

      <div>
        <label className="block text-sm font-medium text-primary mb-2">
          Custom Amount
        </label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
            ◎
          </span>
          <input
            type="number"
            value={customAmount}
            onChange={handleCustomAmountChange}
            className={cn(
              "w-full pl-8 pr-4 py-3 rounded-lg bg-card-bg border-2",
              error
                ? "border-urgent focus:ring-urgent/20"
                : "border-gray-800 focus:ring-secondary/20",
              "text-primary focus:ring-2 transition-all"
            )}
            placeholder="Enter amount"
            min={0}
            step={0.1}
          />
        </div>
        {error && (
          <p className="mt-1 text-sm text-urgent">{error}</p>
        )}
      </div>
    </div>
  );
};