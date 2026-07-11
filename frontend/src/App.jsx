import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./routes/ProtectedRoute";
import Layout from "./components/Layout";

function App() {
  return (
    <BrowserRouter>
      <Toaster 
        position="top-right"
        toastOptions={{
          style: {
            background: '#1E293B',
            color: '#F8FAFC',
            border: '1px solid #334155',
          },
          success: {
            iconTheme: {
              primary: '#22C55E',
              secondary: '#0F172A',
            },
          },
          error: {
            iconTheme: {
              primary: '#EF4444',
              secondary: '#0F172A',
            },
          },
        }}
      />
      <AnimatePresence mode="wait">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          <Route
            path="/dashboard/*"
            element={
              <ProtectedRoute>
                <Layout>
                  <Dashboard />
                </Layout>
              </ProtectedRoute>
            }
          />
        </Routes>
      </AnimatePresence>
    </BrowserRouter>
  );
}

export default App;