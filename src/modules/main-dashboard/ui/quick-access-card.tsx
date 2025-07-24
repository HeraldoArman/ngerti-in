import { ReactElement } from "react";

interface Props {
  text: string;
  icon: ReactElement;
}

export default function QuickAccessCard({ text, icon }: Props) {
  return (
    <div className="border h-24 rounded-2xl flex items-center justify-center bg-white/80 hover:bg-accent duration-200 cursor-pointer">
      <div className="flex gap-4">
        {icon}
        {text}
      </div>
    </div>
  );
}
