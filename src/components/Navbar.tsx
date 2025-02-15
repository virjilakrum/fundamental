import { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../lib/utils';
import { AirdropButton } from './AirdropButton';

const Logo = () => (
  <svg
    viewBox="0 0 48 48"
    fill="none"
    className="w-10 h-10"
  >
    {/* Background */}
    <rect width="48" height="48" rx="12" fill="url(#gradient)" fillOpacity="0.1"/>
    
    {/* F Letter */}
    <path
      d="M14 12h20M14 24h16M14 36h12"
      className="stroke-[4] stroke-white"
    />
    <path
      d="M14 12h20M14 24h16M14 36h12"
      className="stroke-[3] stroke-[url(#gradient)]"
    />
    
    {/* Gradient Definition */}
    <defs>
      <linearGradient id="gradient" x1="0" y1="0" x2="48" y2="48">
        <stop offset="0%" stopColor="#6B48FF" />
        <stop offset="100%" stopColor="#00F5D4" />
      </linearGradient>
    </defs>
  </svg>
);

export const Navbar = () => {
  const { connected } = useWallet();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
      isScrolled 
        ? "bg-card-bg/95 backdrop-blur-md border-b border-gray-800"
        : "bg-transparent"
    )}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-3">
            <Logo />
            <span className="text-xl font-semibold text-primary">
              Fundamental
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-4">
            {connected && <AirdropButton />}
            <WalletMultiButton className="!bg-secondary hover:!bg-secondary/90 transition-colors" />
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? (
              <X className="w-6 h-6 text-primary" />
            ) : (
              <Menu className="w-6 h-6 text-primary" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-card-bg border-b border-gray-800"
          >
            <div className="px-4 py-4 space-y-4">
              {connected && <AirdropButton className="w-full" />}
              <WalletMultiButton className="!bg-secondary hover:!bg-secondary/90 w-full" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};