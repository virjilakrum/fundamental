import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useState } from 'react';
import { DonationModal } from './DonationModal';

export const Hero = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  const [isDonationModalOpen, setIsDonationModalOpen] = useState(false);

  return (
    <>
      <div className="relative">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-background to-card-bg">
          <div className="absolute inset-0 opacity-30">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(107,72,255,0.1),transparent_50%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,_rgba(0,245,212,0.1),transparent_50%)]" />
          </div>
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-secondary/20 rounded-full"
              initial={{
                x: Math.random() * 100 + "%",
                y: Math.random() * 100 + "%",
              }}
              animate={{
                x: Math.random() * 100 + "%",
                y: Math.random() * 100 + "%",
              }}
              transition={{
                duration: Math.random() * 10 + 10,
                repeat: Infinity,
                ease: "linear",
              }}
            />
          ))}
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Side - Content */}
            <motion.div
              ref={ref}
              initial={{ opacity: 0, x: -20 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="space-y-8"
            >
              <div className="space-y-4">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="inline-flex items-center px-3 py-1 rounded-full bg-secondary/10 text-secondary text-sm font-medium"
                >
                  🌟 Together We Make a Difference
                </motion.div>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
                  <span className="bg-clip-text text-transparent bg-gradient-primary animate-gradient">
                    Empowering SMA
                  </span>
                  <br />
                  <span className="text-primary">
                    Patients Through
                  </span>
                  <br />
                  <span className="bg-clip-text text-transparent bg-gradient-secondary animate-gradient">
                    Blockchain
                  </span>
                </h1>
                <p className="text-lg sm:text-xl text-muted-text">
                  Join our community in making a real impact through transparent,
                  blockchain-based donations that directly support SMA patients and their families.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsDonationModalOpen(true)}
                  className="px-8 py-4 rounded-xl bg-secondary text-white font-semibold hover:bg-secondary/90 transition-colors flex items-center justify-center gap-2"
                >
                  Make Impact
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 rounded-xl border-2 border-gray-800 text-primary font-semibold hover:bg-gray-800/50 transition-colors"
                >
                  Learn More
                </motion.button>
              </div>
            </motion.div>

            {/* Right Side - Impact Stats */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              {/* Decorative Elements */}
              <div className="absolute inset-0 bg-gradient-to-r from-secondary/10 to-accent/10 rounded-3xl blur-3xl" />
              
              <div className="relative bg-card-bg/50 backdrop-blur-sm border border-gray-800/50 rounded-3xl p-8">
                <div className="grid grid-cols-2 gap-6">
                  <ImpactCard
                    title="Total Donations"
                    value="◎ 1,234.56"
                    change="+12.5%"
                    delay={0}
                  />
                  <ImpactCard
                    title="Patients Helped"
                    value="127"
                    change="+8"
                    delay={0.1}
                  />
                  <ImpactCard
                    title="Success Rate"
                    value="100%"
                    change="+0%"
                    delay={0.2}
                  />
                  <ImpactCard
                    title="Active Cases"
                    value="45"
                    change="+3"
                    delay={0.3}
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <DonationModal
        isOpen={isDonationModalOpen}
        onClose={() => setIsDonationModalOpen(false)}
      />
    </>
  );
};

const ImpactCard = ({
  title,
  value,
  change,
  delay,
}: {
  title: string;
  value: string;
  change: string;
  delay: number;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay }}
    whileHover={{ scale: 1.02, y: -5 }}
    className="p-4 rounded-2xl bg-card-bg/50 backdrop-blur-sm border border-gray-800/50 hover:border-gray-700/50 transition-all"
  >
    <h3 className="text-sm font-medium text-muted-text truncate">{title}</h3>
    <p className="text-2xl font-bold text-primary mt-1 truncate">{value}</p>
    <p className="text-sm text-green-500 mt-1 truncate">
      {change}
    </p>
  </motion.div>
);