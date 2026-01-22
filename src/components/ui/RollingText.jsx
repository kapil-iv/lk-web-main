import React from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export default function CircularScrollingText() {
  const { scrollYProgress } = useScroll();
  
  // Rotates twice (720deg) over the full page scroll
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 720]);

  return (
    <div className="flex bg-red- items-center justify-center overflow-visible">
      <motion.div 
        style={{ rotate }} 
        className="relative w-40 h-40 md:w-52 md:h-52"
      >
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full overflow-visible"
        >
          <defs>
            <path
              id="circlePath"
              d="M 50, 50 m -35, 0 a 35,35 0 1,1 70,0 a 35,35 0 1,1 -70,0"
            />
          </defs>
          
          <text className="fill-current text-[10px] font-bold uppercase tracking-[0.2em]">
            <textPath href="#circlePath" startOffset="0%">
              YOUR ONE STOP PLATFORM • YOUR ONE STOP PLATFORM •
            </textPath>
          </text>
        </svg>

        
      </motion.div>
    </div>
  );
}