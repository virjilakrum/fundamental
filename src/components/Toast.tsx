import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, AlertTriangle } from 'lucide-react';
import { cn } from '../lib/utils';

type ToastType = 'success' | 'error' | 'warning';

export const Toast = ({
  message,
  type,
  isVisible,
  onClose,
}: {
  message: string;
  type: ToastType;
  isVisible: boolean;
  onClose: () => void;
}) => {
  const icons = {
    success: <Check className="w-5 h-5 text-green-500" />,
    error: <X className="w-5 h-5 text-red-500" />,
    warning: <AlertTriangle className="w-5 h-5 text-yellow-500" />,
  };

  const colors = {
    success: 'bg-green-50 border-green-200',
    error: 'bg-red-50 border-red-200',
    warning: 'bg-yellow-50 border-yellow-200',
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed bottom-4 right-4 z-50"
        >
          <div
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-lg border",
              colors[type]
            )}
          >
            <div className="flex-shrink-0">
              {icons[type]}
            </div>
            <p className="text-primary font-medium">{message}</p>
            <button
              onClick={onClose}
              className="ml-2 p-1 rounded-full hover:bg-black/5 transition-colors"
            >
              <X className="w-4 h-4 text-primary/60" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};