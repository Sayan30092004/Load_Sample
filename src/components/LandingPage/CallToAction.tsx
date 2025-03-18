import React from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

interface CallToActionProps {
  title?: string;
  description?: string;
  buttonText?: string;
  onButtonClick?: () => void;
}

const CallToAction: React.FC<CallToActionProps> = ({
  title = "Experience the Future of Load Forecasting",
  description = "Get real-time insights into electricity demand, supply, and blackout probability for locations worldwide.",
  buttonText = "Try Now",
  onButtonClick,
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onButtonClick) {
      onButtonClick();
    } else {
      // Default navigation to dashboard
      navigate("/dashboard");
    }
  };

  return (
    <motion.div
      className="flex flex-col items-center justify-center p-8 rounded-lg bg-black/50 backdrop-blur-sm text-center w-full max-w-md mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.h2
        className="text-3xl font-bold text-white mb-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        {title}
      </motion.h2>

      <motion.p
        className="text-gray-200 mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        {description}
      </motion.p>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Button
          size="lg"
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full shadow-lg"
          onClick={handleClick}
        >
          {buttonText}
        </Button>
      </motion.div>
    </motion.div>
  );
};

export default CallToAction;
