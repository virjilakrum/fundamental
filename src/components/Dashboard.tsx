import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Activity, Users, Clock, TrendingUp, Heart, Search, Download, Filter, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { cn } from '../lib/utils';
import { Toast } from './Toast';
import { generateNFTAvatar } from '../lib/avatar';

// Types
interface DonationData {
  id: string;
  donor: string;
  amount: number;
  timestamp: string;
  patientName: string;
  status: 'completed' | 'pending' | 'failed';
}

interface Donor {
  id: string;
  name: string;
  totalDonated: number;
  lastDonation: string;
  donationsCount: number;
}

// Mock Data Generator
const generateMockData = () => {
  const donations: DonationData[] = [];
  const donors: Donor[] = [];
  const names = ['John Doe', 'Jane Smith', 'Alice Johnson', 'Bob Wilson', 'Carol Brown'];
  const patients = ['Emily Chen', 'Michael Torres', 'Sarah Johnson', 'David Park', 'Sophia Lee'];
  
  for (let i = 0; i < 50; i++) {
    const amount = Math.random() * 100;
    const donor = names[Math.floor(Math.random() * names.length)];
    
    donations.push({
      id: `don-${i}`,
      donor,
      amount,
      timestamp: new Date(Date.now() - Math.random() * 86400000 * 7).toISOString(),
      patientName: patients[Math.floor(Math.random() * patients.length)],
      status: Math.random() > 0.1 ? 'completed' : Math.random() > 0.5 ? 'pending' : 'failed'
    });
  }

  names.forEach((name, i) => {
    const donationsCount = Math.floor(Math.random() * 20) + 1;
    donors.push({
      id: `donor-${i}`,
      name,
      totalDonated: Math.random() * 1000,
      lastDonation: new Date(Date.now() - Math.random() * 86400000 * 3).toISOString(),
      donationsCount
    });
  });

  return { donations, donors };
};

export const Dashboard = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('all');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error' | 'warning'>('success');

  const { donations, donors } = generateMockData();

  // Filter donations based on search and filters
  const filteredDonations = donations
    .filter(donation => 
      donation.donor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      donation.patientName.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(donation => statusFilter === 'all' ? true : donation.status === statusFilter)
    .filter(donation => {
      if (dateFilter === 'all') return true;
      const date = new Date(donation.timestamp);
      const now = new Date();
      const daysDiff = (now.getTime() - date.getTime()) / (1000 * 3600 * 24);
      
      switch(dateFilter) {
        case 'today': return daysDiff < 1;
        case 'week': return daysDiff < 7;
        case 'month': return daysDiff < 30;
        default: return true;
      }
    });

  // Calculate metrics
  const totalDonations = donations.reduce((sum, d) => sum + d.amount, 0);
  const completedDonations = donations.filter(d => d.status === 'completed').length;
  const averageResponse = '2.4 hrs';
  const successRate = (completedDonations / donations.length * 100).toFixed(1);

  const handleExport = () => {
    try {
      const csvContent = [
        ['Donor', 'Amount', 'Patient', 'Status', 'Timestamp'],
        ...filteredDonations.map(d => [
          d.donor,
          d.amount.toFixed(2),
          d.patientName,
          d.status,
          new Date(d.timestamp).toLocaleString()
        ])
      ].map(row => row.join(',')).join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'donations-export.csv';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      setToastMessage('Data exported successfully');
      setToastType('success');
      setShowToast(true);
    } catch (error) {
      setToastMessage('Failed to export data');
      setToastType('error');
      setShowToast(true);
    }
  };

  return (
    <section className="py-16 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-primary mb-2">Impact Dashboard</h2>
          <p className="text-muted-text">Track and analyze donation impact in real-time</p>
        </div>
        
        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricCard
            icon={<Activity className="w-5 h-5" />}
            title="Total Donations"
            value={`◎ ${totalDonations.toFixed(2)}`}
            change="+12.5%"
            trend="up"
            delay={0}
          />
          <MetricCard
            icon={<Users className="w-5 h-5" />}
            title="Active Donors"
            value={donors.length.toString()}
            change="+3"
            trend="up"
            delay={0.1}
          />
          <MetricCard
            icon={<Clock className="w-5 h-5" />}
            title="Average Response"
            value={averageResponse}
            change="-0.3hrs"
            trend="down"
            delay={0.2}
          />
          <MetricCard
            icon={<TrendingUp className="w-5 h-5" />}
            title="Success Rate"
            value={`${successRate}%`}
            change="+0.5%"
            trend="up"
            delay={0.3}
          />
        </div>

        {/* Controls Row */}
        <div className="flex flex-wrap gap-4 mb-6">
          {/* Search */}
          <div className="relative flex-grow max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search donors or patients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-card-bg border border-gray-800 rounded-lg text-primary focus:ring-2 focus:ring-secondary/20 transition-all"
            />
          </div>

          {/* Filters */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 bg-card-bg border border-gray-800 rounded-lg text-primary focus:ring-2 focus:ring-secondary/20 transition-all"
          >
            <option value="all">All Status</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
          </select>

          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="px-4 py-2 bg-card-bg border border-gray-800 rounded-lg text-primary focus:ring-2 focus:ring-secondary/20 transition-all"
          >
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
          </select>

          {/* Export Button */}
          <button
            onClick={handleExport}
            className="px-4 py-2 bg-secondary text-white rounded-lg flex items-center gap-2 hover:bg-secondary/90 transition-colors"
          >
            <Download className="w-5 h-5" />
            Export
          </button>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Activity Feed */}
          <div className="lg:col-span-2 bg-card-bg rounded-xl border border-gray-800 overflow-hidden">
            <div className="p-4 border-b border-gray-800">
              <h3 className="text-lg font-semibold text-primary">Recent Activity</h3>
            </div>
            <div className="divide-y divide-gray-800">
              {filteredDonations.slice(0, 10).map((donation, i) => (
                <ActivityItem
                  key={donation.id}
                  donation={donation}
                  delay={i * 0.05}
                />
              ))}
            </div>
          </div>

          {/* Leaderboard */}
          <div className="bg-card-bg rounded-xl border border-gray-800 overflow-hidden">
            <div className="p-4 border-b border-gray-800">
              <h3 className="text-lg font-semibold text-primary">Top Donors</h3>
            </div>
            <div className="divide-y divide-gray-800">
              {donors
                .sort((a, b) => b.totalDonated - a.totalDonated)
                .slice(0, 5)
                .map((donor, i) => (
                  <LeaderboardItem
                    key={donor.id}
                    rank={i + 1}
                    donor={donor}
                    delay={i * 0.05}
                  />
                ))}
            </div>
          </div>
        </div>
      </div>

      <Toast
        message={toastMessage}
        type={toastType}
        isVisible={showToast}
        onClose={() => setShowToast(false)}
      />
    </section>
  );
};

const MetricCard = ({
  icon,
  title,
  value,
  change,
  trend,
  delay,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
  delay: number;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay }}
    className="bg-card-bg rounded-xl p-6 border border-gray-800"
  >
    <div className="flex items-start justify-between">
      <div className="p-2 bg-secondary/10 rounded-lg">
        <div className="text-secondary">{icon}</div>
      </div>
    </div>
    <h3 className="text-lg font-semibold text-primary mt-4">{title}</h3>
    <p className="text-2xl font-bold text-secondary mt-2">{value}</p>
    <div className="flex items-center gap-1 mt-2">
      {trend === 'up' ? (
        <ArrowUpRight className="w-4 h-4 text-green-500" />
      ) : (
        <ArrowDownRight className="w-4 h-4 text-red-500" />
      )}
      <span className={cn(
        "text-sm font-medium",
        trend === 'up' ? "text-green-500" : "text-red-500"
      )}>
        {change}
      </span>
    </div>
  </motion.div>
);

const ActivityItem = ({
  donation,
  delay,
}: {
  donation: DonationData;
  delay: number;
}) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.6, delay }}
    className="p-4 flex items-center justify-between hover:bg-gray-800/50 transition-colors"
  >
    <div className="flex items-center gap-3 flex-1 min-w-0">
      <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 bg-secondary/10">
        <img
          src={generateNFTAvatar(donation.donor)}
          alt={donation.donor}
          className="w-full h-full"
        />
      </div>
      <div className="min-w-0">
        <p className="font-medium text-primary truncate">
          {donation.donor} → {donation.patientName}
        </p>
        <p className="text-sm text-gray-400 truncate">
          {new Date(donation.timestamp).toLocaleString()}
        </p>
      </div>
    </div>
    <div className="flex items-center gap-3 flex-shrink-0">
      <span className="font-semibold text-primary whitespace-nowrap">
        ◎ {donation.amount.toFixed(2)}
      </span>
      <span className={cn(
        "px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap",
        donation.status === 'completed' ? "bg-green-500/20 text-green-500" :
        donation.status === 'pending' ? "bg-yellow-500/20 text-yellow-500" :
        "bg-red-500/20 text-red-500"
      )}>
        {donation.status.charAt(0).toUpperCase() + donation.status.slice(1)}
      </span>
    </div>
  </motion.div>
);

const LeaderboardItem = ({
  rank,
  donor,
  delay,
}: {
  rank: number;
  donor: Donor;
  delay: number;
}) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.6, delay }}
    className="p-4 flex items-center justify-between hover:bg-gray-800/50 transition-colors"
  >
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 rounded-lg overflow-hidden bg-secondary/10">
        <img
          src={generateNFTAvatar(donor.name)}
          alt={donor.name}
          className="w-full h-full"
        />
      </div>
      <div>
        <p className="font-medium text-primary">{donor.name}</p>
        <p className="text-sm text-gray-400">{donor.donationsCount} donations</p>
      </div>
    </div>
    <span className="font-semibold text-primary">◎ {donor.totalDonated.toFixed(2)}</span>
  </motion.div>
);