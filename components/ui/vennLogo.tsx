import { FC } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

interface LogoProps {
  className?: string;
}

export const Logo: FC<LogoProps> = ({ className }) => (
  <Link href="/" className={className}>
    <motion.div
      className="bg-black px-3 py-1.5 rounded-lg shadow flex items-center gap-2 text-white text-sm"
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
    >
      <Image src="/logos/logo-1.png" alt="venn logo" width={20} height={20} />
    </motion.div>
  </Link>
);
