import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Hero3D from "./LandingPage/Hero3D";
import CallToAction from "./LandingPage/CallToAction";
import DashboardLayout from "./Dashboard/DashboardLayout";

const Home: React.FC = () => {
  const [showDashboard, setShowDashboard] = useState(false);
  const navigate = useNavigate();

  const handleTryNowClick = () => {
    setShowDashboard(true);
    // Update URL without full navigation
    window.history.pushState({}, "", "/dashboard");
  };

  const handleBackToLanding = () => {
    setShowDashboard(false);
    // Update URL without full navigation
    window.history.pushState({}, "", "/");
  };

  // Animation variants for page transitions
  const pageVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white overflow-hidden">
      {!showDashboard ? (
        <motion.div
          className="relative w-full h-screen"
          initial="initial"
          animate="animate"
          exit="exit"
          variants={pageVariants}
          transition={{ duration: 0.5 }}
        >
          {/* Hero 3D Background */}
          <div className="absolute inset-0 z-0">
            <Hero3D />
          </div>

          {/* Overlay gradient for better text visibility */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/70 z-10"></div>

          {/* Header */}
          <header className="relative z-20 container mx-auto px-4 py-6">
            <div className="flex justify-between items-center">
              <div className="text-2xl font-bold">Load Forecasting</div>
              <nav>
                <ul className="flex space-x-6">
                  <li>
                    <a
                      href="#"
                      className="hover:text-blue-400 transition-colors"
                    >
                      About
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="hover:text-blue-400 transition-colors"
                    >
                      Features
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="hover:text-blue-400 transition-colors"
                    >
                      Contact
                    </a>
                  </li>
                </ul>
              </nav>
            </div>
          </header>

          {/* Main Content with Call to Action */}
          <main className="relative z-20 container mx-auto px-4 flex items-center justify-center h-[calc(100vh-80px)]">
            <div className="max-w-4xl mx-auto text-center">
              <motion.h1
                className="text-5xl md:text-6xl font-bold mb-6"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
              >
                Interactive Load Forecasting Dashboard
              </motion.h1>

              <motion.p
                className="text-xl md:text-2xl mb-12 text-gray-300 max-w-3xl mx-auto"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.6 }}
              >
                Visualize real-time electricity demand, supply, and blackout
                probability data for locations worldwide.
              </motion.p>

              <CallToAction onButtonClick={handleTryNowClick} />
            </div>
          </main>
        </motion.div>
      ) : (
        <motion.div
          initial="initial"
          animate="animate"
          exit="exit"
          variants={pageVariants}
          transition={{ duration: 0.5 }}
        >
          <DashboardLayout onBackToLanding={handleBackToLanding} />
        </motion.div>
      )}
    </div>
  );
};

export default Home;
