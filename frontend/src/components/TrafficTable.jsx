import { motion } from 'framer-motion';
import { FiAlertCircle, FiCheckCircle, FiClock } from 'react-icons/fi';

function TrafficTable({ trafficData }) {
  const getCongestionBadge = (level) => {
    const badges = {
      Low: 'traffic-badge-free',
      Medium: 'traffic-badge-moderate',
      High: 'traffic-badge-heavy',
    };
    return badges[level] || 'traffic-badge-free';
  };

  const getCongestionIcon = (level) => {
    const icons = {
      Low: <FiCheckCircle className="text-green-400" />,
      Medium: <FiClock className="text-yellow-400" />,
      High: <FiAlertCircle className="text-red-400 animate-pulse" />,
    };
    return icons[level] || <FiCheckCircle className="text-green-400" />;
  };

  const getProgressBar = (level) => {
    const percentages = {
      Low: '25%',
      Medium: '60%',
      High: '90%',
    };
    const classes = {
      Low: 'free',
      Medium: 'moderate',
      High: 'heavy',
    };
    return (
      <div className="progress-bar w-24">
        <div 
          className={`progress-bar-fill ${classes[level]}`}
          style={{ width: percentages[level] }}
        />
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card glass-card-hover p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-dark-text">Live Traffic Records</h2>
          <p className="text-sm text-dark-textSecondary">Real-time traffic monitoring data</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="live-dot" />
          <span className="text-sm text-dark-textSecondary">Live</span>
        </div>
      </div>

      <div className="table-scroll">
        <table className="w-full">
          <thead>
            <tr className="border-b border-dark-border">
              <th className="text-left py-3 px-4 text-sm font-medium text-dark-textSecondary">Location</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-dark-textSecondary">Vehicles</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-dark-textSecondary">Avg Speed</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-dark-textSecondary">Congestion</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-dark-textSecondary">Status</th>
            </tr>
          </thead>
          <tbody>
            {trafficData.map((traffic, index) => (
              <motion.tr
                key={traffic._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="border-b border-dark-border/50 hover:bg-dark-surfaceHover/50 transition-colors"
              >
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-500" />
                    <span className="text-dark-text">{traffic.location}</span>
                  </div>
                </td>
                <td className="py-3 px-4 text-dark-text">{traffic.vehicle_count}</td>
                <td className="py-3 px-4">
                  <span className="text-dark-text">{traffic.average_speed} km/h</span>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-3">
                    {getProgressBar(traffic.congestion_level)}
                    <span className={`text-xs ${getCongestionBadge(traffic.congestion_level)}`}>
                      {traffic.congestion_level}
                    </span>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    {getCongestionIcon(traffic.congestion_level)}
                    <span className={`text-sm ${getCongestionBadge(traffic.congestion_level)}`}>
                      {traffic.road_status}
                    </span>
                  </div>
                </td>
              </motion.tr>
            ))}
            {trafficData.length === 0 && (
              <tr>
                <td colSpan="5" className="py-8 text-center text-dark-textSecondary">
                  No traffic data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}

export default TrafficTable;