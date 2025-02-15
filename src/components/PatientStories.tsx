import { motion } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, AlertCircle, Clock, Users, Heart, Wallet } from 'lucide-react';
import { cn } from '../lib/utils';
import { DonationModal } from './DonationModal';
import { generateNFTAvatar } from '../lib/avatar';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

const PatientCard = ({
  name,
  age,
  progress,
  goal,
  imageUrl,
  story,
  delay,
  isUrgent,
  urgencyReason,
  supporters,
  timeLeft,
  onSupport,
}: {
  name: string;
  age: number;
  progress: number;
  goal: number;
  imageUrl: string;
  story: string;
  delay: number;
  isUrgent?: boolean;
  urgencyReason?: string;
  supporters: number;
  timeLeft: string;
  onSupport?: () => void;
}) => {
  const { connected } = useWallet();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      className="flex-none w-[350px] snap-center"
    >
      <div className={cn(
        "bg-card-bg rounded-xl overflow-hidden border transition-all h-full",
        isUrgent 
          ? "border-urgent pulse-urgent shadow-lg shadow-urgent/20" 
          : "border-gray-800"
      )}>
        <div className="relative">
          <img
            src={imageUrl}
            alt={name}
            className="w-full h-48 object-cover"
          />
          {isUrgent && (
            <div className="absolute top-3 right-3 bg-urgent text-white px-3 py-1.5 rounded-lg flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4" />
              <span className="text-sm font-medium">Urgent Care Needed</span>
            </div>
          )}
        </div>
        <div className="p-6 space-y-4">
          <div>
            <h3 className="text-xl font-semibold text-primary">{name}</h3>
            <p className="text-muted-text">Age: {age} years</p>
          </div>
          
          <p className="text-primary/80 line-clamp-3">{story}</p>
          
          {isUrgent && (
            <div className="flex items-start gap-2 p-3 bg-urgent/10 rounded-lg">
              <AlertCircle className="w-5 h-5 text-urgent flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-urgent">{urgencyReason}</p>
                <p className="text-sm text-urgent/80 mt-1">Time remaining: {timeLeft}</p>
              </div>
            </div>
          )}
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-text">Progress</span>
              <span className="text-secondary font-medium">{progress}%</span>
            </div>
            <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.8, delay: delay + 0.3 }}
                className={cn(
                  "h-full rounded-full",
                  isUrgent ? "bg-urgent" : "bg-secondary"
                )}
              />
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-text">Goal:</span>
              <span className="font-semibold text-primary">◎ {goal.toFixed(2)}</span>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm text-muted-text">
            <div className="flex items-center gap-1.5">
              <Users className="w-4 h-4" />
              <span>{supporters} supporters</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              <span>{timeLeft} left</span>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-800">
            {connected ? (
              <button
                onClick={onSupport}
                className={cn(
                  "w-full px-4 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2",
                  isUrgent 
                    ? "bg-urgent hover:bg-urgent/90 text-white" 
                    : "bg-secondary hover:bg-secondary/90 text-white"
                )}
              >
                <Heart className="w-5 h-5" />
                Support {name}
              </button>
            ) : (
              <div className="space-y-2">
                <p className="text-sm text-center text-muted-text">Connect wallet to donate</p>
                <WalletMultiButton className="w-full !justify-center" />
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export const PatientStories = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [selectedPatient, setSelectedPatient] = useState<{
    name: string;
    isUrgent: boolean;
    progress: number;
    goal: number;
  } | null>(null);
  const [donations, setDonations] = useState<Record<string, number>>({});

  const handleDonationComplete = (amount: number) => {
    if (selectedPatient) {
      const { name } = selectedPatient;
      setDonations(prev => ({
        ...prev,
        [name]: (prev[name] || 0) + amount
      }));
    }
  };

  const patients = [
    {
      name: 'Emily Chen',
      age: 4,
      progress: 65,
      goal: 25,
      imageUrl: 'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?w=400&h=300&fit=crop',
      isUrgent: true,
      urgencyReason: 'Critical treatment needed within 48 hours',
      story: 'Emily was diagnosed with SMA Type 1 at 3 months old. Her family is seeking support for urgent gene therapy treatment.',
      supporters: 45,
      timeLeft: '36 hours',
    },
    {
      name: 'Michael Torres',
      age: 7,
      progress: 30,
      goal: 35,
      imageUrl: 'https://images.unsplash.com/photo-1513883049090-d0b7439799bf?w=400&h=300&fit=crop',
      isUrgent: true,
      urgencyReason: 'Immediate therapy required',
      story: 'Michael needs specialized equipment and therapy sessions to maintain his mobility and quality of life.',
      supporters: 28,
      timeLeft: '3 days',
    },
    {
      name: 'Sarah Johnson',
      age: 3,
      progress: 85,
      goal: 15,
      imageUrl: 'https://images.unsplash.com/photo-1519457431-44ccd64a579b?w=400&h=300&fit=crop',
      isUrgent: false,
      story: 'Sarah is making great progress with her treatment, and her family needs support for ongoing therapy sessions.',
      supporters: 92,
      timeLeft: '12 days',
    },
    {
      name: 'David Park',
      age: 6,
      progress: 45,
      goal: 40,
      imageUrl: 'https://images.unsplash.com/photo-1559454403-b8fb88521f11?w=400&h=300&fit=crop',
      isUrgent: false,
      story: 'David loves playing music and needs support for adaptive instruments and continued physical therapy.',
      supporters: 56,
      timeLeft: '18 days',
    },
    {
      name: 'Sophia Lee',
      age: 5,
      progress: 25,
      goal: 30,
      imageUrl: 'https://images.unsplash.com/photo-1519340241574-2cec6aef0c01?w=400&h=300&fit=crop',
      isUrgent: true,
      urgencyReason: 'Time-sensitive medication needed',
      story: 'Sophia requires immediate assistance for her medication and specialized breathing equipment.',
      supporters: 31,
      timeLeft: '60 hours',
    },
    {
      name: 'Lucas Martinez',
      age: 8,
      progress: 70,
      goal: 20,
      imageUrl: 'https://images.unsplash.com/photo-1519457431-44ccd64a579b?w=400&h=300&fit=crop',
      isUrgent: false,
      story: 'Lucas is showing remarkable improvement and needs support for his ongoing rehabilitation program.',
      supporters: 74,
      timeLeft: '25 days',
    },
  ];

  const getUpdatedProgress = (patient: typeof patients[0]) => {
    const baseDonation = (patient.progress / 100) * patient.goal;
    const additionalDonation = donations[patient.name] || 0;
    const totalDonation = baseDonation + additionalDonation;
    return Math.min(100, (totalDonation / patient.goal) * 100);
  };

  return (
    <>
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-primary">Patient Stories</h2>
              <p className="text-muted-text mt-2">Support those in need and make a real difference</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => scroll('left')}
                className="p-3 rounded-xl bg-card-bg hover:bg-gray-800 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-primary" />
              </button>
              <button
                onClick={() => scroll('right')}
                className="p-3 rounded-xl bg-card-bg hover:bg-gray-800 transition-colors"
              >
                <ArrowRight className="w-5 h-5 text-primary" />
              </button>
            </div>
          </div>

          <div
            ref={scrollRef}
            className="flex gap-6 overflow-x-auto pb-6 snap-x snap-mandatory hide-scrollbar"
          >
            {patients.map((patient, i) => {
              const updatedProgress = getUpdatedProgress(patient);
              return (
                <PatientCard
                  key={i}
                  {...patient}
                  progress={updatedProgress}
                  delay={i * 0.1}
                  onSupport={() => setSelectedPatient({
                    name: patient.name,
                    isUrgent: patient.isUrgent,
                    progress: updatedProgress,
                    goal: patient.goal
                  })}
                />
              );
            })}
          </div>
        </div>
      </section>

      <DonationModal
        isOpen={!!selectedPatient}
        onClose={() => setSelectedPatient(null)}
        patientName={selectedPatient?.name}
        isUrgent={selectedPatient?.isUrgent}
        onDonationComplete={handleDonationComplete}
      />
    </>
  );
};