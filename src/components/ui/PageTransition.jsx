import { motion } from "framer-motion";

const PageTransition = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ 
        duration: 0.4, 
        ease: [0.22, 1, 0.36, 1] // Custom cubic-bezier for a "premium" feel
      }}
      className="w-full flex flex-col items-center"
    >
      {children}
    </motion.div>
  );
};

export default PageTransition;