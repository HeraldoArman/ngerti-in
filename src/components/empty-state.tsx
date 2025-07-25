import React from "react";
import Image from "next/image";
import { Button } from "./ui/button";
import { motion } from "framer-motion";

interface Props {
  title: string;
  description: string;
  image?: string;
  ctaLabel?: string;
  onCtaClick?: () => void;
}

export const EmptyState = ({
  title,
  description,
  image = "/empty.svg",
  ctaLabel,
  onCtaClick,
}: Props) => {
  return (
    <div className="flex flex-col items-center justify-center w-full py-12 px-4 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm bg-transparent">
      <motion.div
        className="relative group"
        animate={{
          y: [0, -12, 0, 12, 0],
        }}
        transition={{
          duration: 2.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-primary/20 via-primary/40 to-secondary/20 opacity-0 group-hover:opacity-100 blur-xl transition duration-700"></div>
        <Image
          src={image}
          alt="Empty state illustration"
          width={180}
          height={180}
          className="relative drop-shadow-md transition-all duration-300 group-hover:scale-105"
        />
      </motion.div>

      <div className="flex flex-col gap-y-4 max-w-md mx-auto text-center mt-8">
        <h3 className="text-2xl font-semibold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          {title}
        </h3>
        <p className="text-base text-gray-600 dark:text-gray-300 leading-relaxed">
          {description}
        </p>

        {ctaLabel && onCtaClick && (
          <div className="mt-4">
            <Button
              onClick={onCtaClick}
              className="px-6 py-2 bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-white font-medium rounded-full transition-all shadow-md hover:shadow-lg"
            >
              {ctaLabel}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};