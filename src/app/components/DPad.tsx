import React from "react";
import { LuArrowUp, LuArrowDown, LuArrowLeft, LuArrowRight } from "react-icons/lu";
import { clsx } from "clsx";

interface DPadProps {
  className?: string;
  onDirection?: (dir: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT') => void;
}

export const DPad: React.FC<DPadProps> = ({ className, onDirection }) => {
  return (
    <div className={clsx("grid grid-cols-3 grid-rows-3 gap-2", className)}>
      <div className="col-start-2">
        <button 
          onClick={() => onDirection?.('UP')}
          className="flex h-16 w-16 items-center justify-center rounded-xl border-4 border-[#0000FF] bg-black text-[#0000FF] shadow-[0_0_10px_#0000FF] transition-all active:scale-95 active:border-[#FFFF00] active:text-[#FFFF00] active:shadow-[0_0_20px_#FFFF00]">
          <LuArrowUp size={32} />
        </button>
      </div>
      
      <div className="col-start-1 row-start-2">
        <button 
          onClick={() => onDirection?.('LEFT')}
          className="flex h-16 w-16 items-center justify-center rounded-xl border-4 border-[#0000FF] bg-black text-[#0000FF] shadow-[0_0_10px_#0000FF] transition-all active:scale-95 active:border-[#FFFF00] active:text-[#FFFF00] active:shadow-[0_0_20px_#FFFF00]">
          <LuArrowLeft size={32} />
        </button>
      </div>
      
      <div className="col-start-2 row-start-2 flex items-center justify-center">
        {/* Empty center or a decorative circle */}
        <div className="h-6 w-6 rounded-full bg-[#0000FF]/20 shadow-[0_0_5px_#0000FF]"></div>
      </div>

      <div className="col-start-3 row-start-2">
        <button 
          onClick={() => onDirection?.('RIGHT')}
          className="flex h-16 w-16 items-center justify-center rounded-xl border-4 border-[#0000FF] bg-black text-[#0000FF] shadow-[0_0_10px_#0000FF] transition-all active:scale-95 active:border-[#FFFF00] active:text-[#FFFF00] active:shadow-[0_0_20px_#FFFF00]">
          <LuArrowRight size={32} />
        </button>
      </div>

      <div className="col-start-2 row-start-3">
        <button 
          onClick={() => onDirection?.('DOWN')}
          className="flex h-16 w-16 items-center justify-center rounded-xl border-4 border-[#0000FF] bg-black text-[#0000FF] shadow-[0_0_10px_#0000FF] transition-all active:scale-95 active:border-[#FFFF00] active:text-[#FFFF00] active:shadow-[0_0_20px_#FFFF00]">
          <LuArrowDown size={32} />
        </button>
      </div>
    </div>
  );
};
