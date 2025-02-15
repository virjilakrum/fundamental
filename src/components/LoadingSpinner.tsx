import { motion } from 'framer-motion';

export const LoadingSpinner = ({ className = "w-6 h-6" }: { className?: string }) => (
  <motion.div
    className={`${className} border-4 border-secondary/30 border-t-secondary rounded-full`}
    animate={{ rotate: 360 }}
    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
  />
);