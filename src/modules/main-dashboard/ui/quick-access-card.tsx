import { ReactElement } from "react";

interface Props {
  text: string;
  icon: ReactElement;
}

export default function QuickAccessCard({ text, icon }: Props) {
  return (
    <div className="px-6 w-full text-md md:text-xl border h-24 rounded-2xl flex items-center justify-center bg-white/80 hover:bg-accent duration-200 cursor-pointer">
      <div className="w-full flex items-center justify-between gap-4">
        <div className="bg-accent size-12 flex items-center justify-center rounded-sm">
          {icon}
        </div>
        {text}
      </div>
    </div>
  );
}
