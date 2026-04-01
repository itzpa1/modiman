import React from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "icon";
  children: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "relative flex items-center justify-center font-['Press_Start_2P'] uppercase transition-all duration-150 active:scale-95 disabled:opacity-50 disabled:pointer-events-none outline-none",
          variant === "primary" &&
            "px-6 py-4 bg-black text-[#FFFF00] border-4 border-[#0000FF] shadow-[0_0_10px_#0000FF,inset_0_0_10px_#0000FF] hover:shadow-[0_0_20px_#0000FF,inset_0_0_20px_#0000FF] active:shadow-[0_0_30px_#FFFF00,inset_0_0_30px_#FFFF00] active:border-[#FFFF00] active:bg-[#FFFF00] active:text-black",
          variant === "secondary" &&
            "px-4 py-3 bg-black text-white border-2 border-[#0000FF] shadow-[0_0_5px_#0000FF,inset_0_0_5px_#0000FF] hover:text-[#FFFF00] hover:border-[#FFFF00] hover:shadow-[0_0_15px_#FFFF00,inset_0_0_15px_#FFFF00] active:bg-[#FFFF00]/20",
          variant === "icon" &&
            "p-3 bg-black text-[#0000FF] border-2 border-[#0000FF] shadow-[0_0_5px_#0000FF] hover:text-[#FFFF00] hover:border-[#FFFF00] hover:shadow-[0_0_15px_#FFFF00] active:scale-90 rounded-md",
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";
