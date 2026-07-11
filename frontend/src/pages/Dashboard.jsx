import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FiActivity, 
  FiMapPin, 
  FiBarChart2, 
  FiAlertTriangle,
  FiSearch,
  FiFilter,
  FiRefreshCw,
  FiClock
} from 'react-icons/fi';
import { FaCar, FaRoad, FaTrafficLight } from 'react-icons/fa';
import { getTrafficData } from '../services/trafficService';
import TrafficTable from '../components/TrafficTable';
import StatCard from '../components/StatCard';
import toast from 'react-hot-toast';

function Dashboard() {
  const [trafficData, setTrafficData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCongestion, setFilterCongestion] = useState('All');
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  useEffect(() => {
    fetchTrafficData();
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchTrafficData, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchTrafficData = async () => {
    try {
      setLoading(true);
      const response = await getTrafficData();
      setTrafficData(response.data);
      setLastUpdated(new Date());
      setLoading(false);
    } catch (error) {
      console.error(error);
      toast.error('Failed to load traffic data');
      setLoading(false);
    }
  };

  // Statistics
  const totalRecords = trafficData.length;
  const totalVehicles = trafficData.reduce((sum, t) => sum + t.vehicle_count, 0);
  const averageSpeed = trafficData.length > 0
    ? (trafficData.reduce((sum, t) => sum + t.average_speed, 0) / trafficData.length).toFixed(1)
    : 0;
  const highCongestion = trafficData.filter(t => t.congestion_level === 'High').length;
  const moderateCongestion = trafficData.filter(t => t.congestion_level === 'Medium').length;

  // Filtered data
  const filteredTraffic = trafficData.filter(traffic => {
    const matchesSearch = traffic.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCongestion = filterCongestion === 'All' || traffic.congestion_level === filterCongestion;
    return matchesSearch && matchesCongestion;
  });

  const statCards = [
    {
      title: 'Total Locations',
      value: totalRecords,
      icon: FiMapPin,
      color: 'blue',
      trend: 5
    },
    {
      title: 'Total Vehicles',
      value: totalVehicles,
      icon: FaCar,
      color: 'green',
      trend: 12
    },
    {
      title: 'Average Speed',
      value: `${averageSpeed} km/h`,
      icon: FaRoad,
      color: 'yellow',
      trend: -2
    },
    {
      title: 'High Congestion',
      value: highCongestion,
      icon: FiAlertTriangle,
      color: 'red',
      trend: 8
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"
          >
            Traffic Control Dashboard
          </motion.h1>
          <div className="flex items-center gap-2 text-sm text-dark-textSecondary">
            <FiClock className="text-blue-400" />
            <span>Last updated: {lastUpdated.toLocaleTimeString()}</span>
            <button 
              onClick={fetchTrafficData}
              className="ml-2 p-1 rounded hover:bg-dark-surfaceHover transition-colors"
            >
              <FiRefreshCw className={`${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-2 glass-card">
            <span className="live-dot" />
            <span className="text-sm font-medium text-green-400">System Online</span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <StatCard {...stat} />
          </motion.div>
        ))}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card p-4 flex items-center justify-between"
        >
          <div>
            <p className="text-sm text-dark-textSecondary">Moderate Congestion</p>
            <p className="text-2xl font-bold text-yellow-400">{moderateCongestion}</p>
          </div>
          <div className="text-3xl">🟡</div>
        </motion.div>
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-4 flex items-center justify-between"
        >
          <div>
            <p className="text-sm text-dark-textSecondary">Free Flow</p>
            <p className="text-2xl font-bold text-green-400">{totalRecords - highCongestion - moderateCongestion}</p>
          </div>
          <div className="text-3xl">🟢</div>
        </motion.div>
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-4 flex items-center justify-between"
        >
          <div>
            <p className="text-sm text-dark-textSecondary">AI Confidence Score</p>
            <p className="text-2xl font-bold text-purple-400">94%</p>
          </div>
          <div className="text-3xl">🤖</div>
        </motion.div>
      </div>

      {/* Search & Filter */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-4"
      >
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-textSecondary" />
            <input
              type="text"
              placeholder="Search by location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-dark-surface/50 border border-dark-border rounded-xl py-2 pl-10 pr-4 text-dark-text placeholder-dark-textSecondary focus:outline-none focus:border-blue-500/50 transition-colors"
            />
          </div>
          <div className="flex items-center gap-2">
            <FiFilter className="text-dark-textSecondary" />
            <select
              value={filterCongestion}
              onChange={(e) => setFilterCongestion(e.target.value)}
              className="bg-dark-surface/50 border border-dark-border rounded-xl py-2 px-4 text-dark-text focus:outline-none focus:border-blue-500/50 transition-colors min-w-[160px]"
            >
              <option value="All">All Congestion Levels</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* Traffic Table */}
      {loading ? (
        <div className="glass-card p-6 space-y-4">
          <div className="skeleton h-8 w-48" />
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="skeleton h-12 w-full" />
            ))}
          </div>
        </div>
      ) : (
        <TrafficTable trafficData={filteredTraffic} />
      )}
    </div>
  );
}

export default Dashboard;