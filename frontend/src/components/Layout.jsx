import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  FiHome, 
  FiActivity, 
  FiCpu, 
  FiBell, 
  FiMap, 
  FiBarChart2, 
  FiUser, 
  FiSettings, 
  FiLogOut,
  FiMenu,
  FiX,
  FiChevronLeft,
  FiChevronRight
} from 'react-icons/fi';
import { FaTrafficLight } from 'react-icons/fa';
import { MdOutlineAnalytics } from 'react-icons/md';
import toast from 'react-hot-toast';

const navItems = [
  { path: '/dashboard', icon: FiHome, label: 'Dashboard' },
  { path: '/dashboard/live-traffic', icon: FaTrafficLight, label: 'Live Traffic' },
  { path: '/dashboard/ai-predictions', icon: FiCpu, label: 'AI Predictions' },
  { path: '/dashboard/alerts', icon: FiBell, label: 'Alerts' },
  { path: '/dashboard/route-planner', icon: FiMap, label: 'Route Planner' },
  { path: '/dashboard/analytics', icon: FiBarChart2, label: 'Analytics' },
  { path: '/dashboard/profile', icon: FiUser, label: 'Profile' },
  { path: '/dashboard/settings', icon: FiSettings, label: 'Settings' },
];

function Layout({ children }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsCollapsed(true);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    toast.success('Logged out successfully');
    navigate('/');
  };

  const isActive = (path) => {
    if (path === '/dashboard') {
      return location.pathname === '/dashboard';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="flex h-screen bg-dark-bg overflow-hidden">
      {/* Mobile menu toggle */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="fixed top-4 left-4 z-50 md:hidden bg-dark-surface text-dark-text p-2 rounded-xl border border-dark-border"
      >
        {isMobileOpen ? <FiX size={24} /> : <FiMenu size={24} />}
      </button>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{
          width: isCollapsed ? '80px' : '280px',
        }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className={`bg-dark-surface/95 backdrop-blur-sm border-r border-dark-border h-screen fixed md:relative z-40 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between p-4 border-b border-dark-border">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="text-3xl">🚦</div>
            <motion.div
              animate={{ opacity: isCollapsed ? 0 : 1 }}
              transition={{ duration: 0.2 }}
              className="whitespace-nowrap"
            >
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                TrafficVision
              </h1>
              <p className="text-xs text-dark-textSecondary">AI Control Center</p>
            </motion.div>
          </div>
          
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden md:flex p-1 rounded-lg hover:bg-dark-surfaceHover transition-colors"
          >
            {isCollapsed ? <FiChevronRight size={20} /> : <FiChevronLeft size={20} />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2 overflow-y-auto h-[calc(100vh-120px)]">
          {navItems.map((item) => (
            <motion.button
              key={item.path}
              onClick={() => {
                navigate(item.path);
                setIsMobileOpen(false);
              }}
              whileHover={{ x: 5 }}
              whileTap={{ scale: 0.95 }}
              className={`w-full sidebar-link ${
                isActive(item.path) ? 'sidebar-link-active' : ''
              } ${isCollapsed ? 'justify-center' : ''}`}
            >
              <item.icon className="text-xl flex-shrink-0" />
              <motion.span
                animate={{ opacity: isCollapsed ? 0 : 1 }}
                transition={{ duration: 0.2 }}
                className={`${isCollapsed ? 'hidden' : 'block'} text-sm font-medium`}
              >
                {item.label}
              </motion.span>
            </motion.button>
          ))}

          {/* Logout */}
          <div className="border-t border-dark-border pt-4 mt-4">
            <motion.button
              onClick={handleLogout}
              whileHover={{ x: 5 }}
              whileTap={{ scale: 0.95 }}
              className={`w-full sidebar-link text-red-400 hover:text-red-300 hover:bg-red-500/10 ${
                isCollapsed ? 'justify-center' : ''
              }`}
            >
              <FiLogOut className="text-xl flex-shrink-0" />
              <motion.span
                animate={{ opacity: isCollapsed ? 0 : 1 }}
                transition={{ duration: 0.2 }}
                className={`${isCollapsed ? 'hidden' : 'block'} text-sm font-medium`}
              >
                Logout
              </motion.span>
            </motion.button>
          </div>
        </nav>
      </motion.aside>

      {/* Main Content */}
      <motion.main
  className={`flex-1 overflow-y-auto ${
    isMobileOpen ? 'blur-sm md:blur-none' : ''
  }`}
>
        <div className="p-6 md:p-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="page-transition"
          >
            {children}
          </motion.div>
        </div>
      </motion.main>
    </div>
  );
}

export default Layout;