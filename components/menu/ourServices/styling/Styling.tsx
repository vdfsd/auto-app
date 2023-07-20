import { FC } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { IoMdArrowDropdown } from "react-icons/io";

interface IStylingProps {
  openStyling: boolean;
  handleStyling: (Styling: boolean) => void;
  isDesktop: boolean;
}

export const Styling: FC<IStylingProps> = ({
  openStyling,
  handleStyling,
  isDesktop,
}) => {
  return (
    <li
      className="w-auto pl-4 py-1 lg:flex lg:justify-center"
      onMouseLeave={() => {
        if (!isDesktop) {
          return;
        }
        handleStyling(false);
      }}
      onMouseEnter={() => {
        if (!isDesktop) {
          return;
        }
        handleStyling(true);
      }}
    >
      <div className="flex items-center justify-between  w-full">
        <Link
          className="inline h-full text-sm text-slate-100 hover:text-yellow-600 cursor-pointer line"
          href={`/`}
        >
          Auto Styling
        </Link>
        <motion.div
          animate={{ rotate: openStyling ? 180 : 0 }}
          transition={{ type: "spring", duration: 0.5 }}
          className="cursor-pointer"
          onClick={() => handleStyling(!openStyling)}
        >
          <IoMdArrowDropdown color={"#f1f5f9"} size={25} />
        </motion.div>
      </div>

      <AnimatePresence>
        {openStyling && (
          <motion.ul
            initial={
              !isDesktop
                ? {
                    height: 0,
                  }
                : { opacity: 0 }
            }
            animate={
              !isDesktop
                ? {
                    height: "auto",
                  }
                : { opacity: 1 }
            }
            exit={!isDesktop ? { height: 0 } : { opacity: 0 }}
            transition={{ duration: 0.2 }}
            className={`overflow-hidden pl-4 lg:px-4 static top-14  lg:shadow-xl lg:absolute lg:left-[192px] lg:bg-zinc-800 lg:w-full min-w-auto lg:min-w-[220px] lg:overflow-visible`}
          >
            <li className="mt-0 pt-2 w-auto px-4 py-1 lg:mt-4">
              <Link
                className="text-sm inline h-full text-slate-100 hover:text-yellow-600 cursor-pointer line"
                href={`/`}
              >
                Wheels & Tires
              </Link>
            </li>
            <li className="inline px-4 py-1 transition">
              <Link
                className="text-sm w-auto h-full text-slate-100 hover:text-yellow-600 cursor-pointer line"
                href={`/`}
              >
                Suspension
              </Link>
            </li>
            <li className="w-auto px-4 py-1 transition">
              <Link
                className="text-sm inline h-full text-slate-100 hover:text-yellow-600 cursor-pointer line"
                href={`/`}
              >
                Exhaust
              </Link>
            </li>
            <li className="w-auto px-4 py-1 transition">
              <Link
                className="text-sm inline h-full text-slate-100 hover:text-yellow-600 cursor-pointer line"
                href={`/`}
              >
                Accessories
              </Link>
            </li>
            <li className="w-auto px-4 py-1 transition">
              <Link
                className="text-sm inline h-full text-slate-100 hover:text-yellow-600 cursor-pointer line"
                href={`/`}
              >
                Vinyl Wraps
              </Link>
            </li>
            <li className="w-auto px-4 py-1 mb-0 lg:mb-4">
              <Link
                className="text-sm inline h-full text-slate-100 hover:text-yellow-600 cursor-pointer line"
                href={`/`}
              >
                Window Tint
              </Link>
            </li>
          </motion.ul>
        )}
      </AnimatePresence>
    </li>
  );
};