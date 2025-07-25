import { ReactElement } from "react";

interface Props {
  text: string;
  icon: ReactElement;
  desc: string;
  onClick?: () => void;
}

export default function QuickAccessCard({ text, icon, desc,onClick }: Props) {
  return (
    <button
      onClick={onClick}
      className="group relative px-6 w-full text-sm md:text-base border-0 h-28 rounded-2xl flex items-center justify-start bg-white shadow-sm hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 cursor-pointer overflow-hidden"
    >
      {/* Background gradient on hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-50/50 to-indigo-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      {/* Content */}
      <div className="relative flex items-center gap-5">
        <div className="bg-blue-50 text-blue-600 size-14 flex items-center justify-center rounded-xl shrink-0 group-hover:bg-blue-100 group-hover:scale-105 transition-all duration-300">
          {icon}
        </div>
        <div className="flex flex-col items-start">
          <span className="font-semibold text-foreground text-left leading-tight group-hover:text-blue-900 transition-colors duration-300">
            {text}
          </span>
          <span className="text-xs text-muted-foreground mt-1">
            {desc}
          </span>
        </div>
      </div>

      {/* Right arrow indicator */}
      <div className="absolute right-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 translate-x-2 transition-all duration-300">
        <svg 
          className="w-4 h-4 text-blue-600" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M9 5l7 7-7 7" 
          />
        </svg>
      </div>

      {/* Subtle border on hover */}
      <div className="absolute inset-0 rounded-2xl border border-blue-200/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </button>
  );
}