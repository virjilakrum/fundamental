import { motion } from 'framer-motion';
import { cn } from '../lib/utils';

interface ProgressIndicatorProps {
  steps: number;
  currentStep: number;
  className?: string;
}

export const ProgressIndicator = ({
  steps,
  currentStep,
  className,
}: ProgressIndicatorProps) => (
  <div className={cn("flex gap-2", className)}>
    {[...Array(steps)].map((_, i) => (
      <div
        key={i}
        className="flex-1 h-1 rounded-full overflow-hidden bg-gray-800"
      >
        {i <= currentStep && (
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: '100%' }}
            transition={{ duration: 0.4 }}
            className="h-full bg-secondary"
          />
        )}
      </div>
    ))}
  </div>
);