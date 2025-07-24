import Link from "next/link";
import Image from "next/image";
import { CallControls, SpeakerLayout } from "@stream-io/video-react-sdk";

interface CallActiveProps {
//   onLeave: () => void;
  meetingName: string;
}

export const CallActive = ({ meetingName }: CallActiveProps) => {
  return (
    <div className="flex flex-col justify-between p-4 h-full text-white">
      <div className="bg-[#101213] rounded-full p-4 flex items-center gap-4">
        <Link
          href={"/"}
          className="flex items-center p-1 bg-white/10 rounded-full w-fit"
        >
          <Image src={"/logo.svg"} width={22} height={22} alt="logo" />
        </Link>
        <h4 className="text-base">{meetingName}</h4>
      </div>
      <SpeakerLayout />
      <div className="bg-[#101213] rounded-full px-4">
        <CallControls  />
      </div>
    </div>
  );
};



