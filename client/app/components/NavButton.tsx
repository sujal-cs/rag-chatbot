import { motion } from "framer-motion";
import Link from "next/link";

interface NavButtonProps {
  href: string;
  label: string;
  icon: React.ElementType; // Component type for the icon
}

const   NavButton = ({ href, label, icon: Icon }: NavButtonProps) => {
  return (
    <div>
      <section>
        <motion.div
          className="flex gap-1.5 items-center p-3 rounded-xl bg-gray-900 text-slate-300"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          transition={{ ease: "easeInOut" }}
        >
          <Link
            href={href}
            target="_blank"
            className="flex items-center gap-1.5"
          >
            <Icon /> {/* Dynamic Icon */}
            <span>{label}</span>
          </Link>
        </motion.div>
      </section>
    </div>
  );
};

export default NavButton;
