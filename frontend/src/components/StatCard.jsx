import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

function StatCard({ title, value, icon: Icon, color = 'blue', trend, trendValue }) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = typeof value === 'number' ? value : parseInt(value);
    const duration = 1000;
    const increment = end / (duration / 16);

    if (isNaN(end)) {
      setDisplayValue(value);
      return;
    }

    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setDisplayValue(end);
        clearInterval(timer);
      } else {
        setDisplayValue(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [value]);

  const colorMap = {
    blue: 'from-blue-500/20 to-blue-600/10 border-blue-500/30 text-blue-400',
    green: 'from-green-500/20 to-green-600/10 border-green-500/30 text-green-400',
    yellow: 'from-yellow-500/20 to-yellow-600/10 border-yellow-500/30 text-yellow-400',
    red: 'from-red-500/20 to-red-600/10 border-red-500/30 text-red-400',
    purple: 'from-purple-500/20 to-purple-600/10 border-purple-500/30 text-purple-400',
  };

  const iconColorMap = {
    blue: 'text-blue-400',
    green: 'text-green-400',
    yellow: 'text-yellow-400',
    red: 'text-red-400',
    purple: 'text-purple-400',
  };

  return (
    <motion.div
      whileHover={{ 
        y: -5,
        transition: { duration: 0.2 }
      }}
      className={`stat-card bg-gradient-to-br ${colorMap[color]}`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-dark-textSecondary text-sm font-medium">{title}</p>
          <motion.p
            key={displayValue}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-3xl font-bold text-dark-text mt-2"
          >
            {typeof value === 'number' ? displayValue.toLocaleString() : displayValue}
          </motion.p>
          {trend && (
            <div className="flex items-center gap-1 mt-2">
              <span className={`text-xs ${trend > 0 ? 'text-green-400' : 'text-red-400'}`}>
                {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
              </span>
              <span className="text-xs text-dark-textSecondary">vs last hour</span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-xl bg-dark-surface/50 ${iconColorMap[color]}`}>
          {Icon && <Icon size={24} />}
        </div>
      </div>
    </motion.div>
  );
}

export default StatCard;