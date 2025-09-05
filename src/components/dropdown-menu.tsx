"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MoreVertical, Edit, Trash } from "lucide-react";

interface DropdownOptionsProps {
  onEdit: () => void;
  onDelete: () => void;
}

const DropdownOptions = ({ onEdit, onDelete }: DropdownOptionsProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative inline-block text-left">
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="p-2 rounded-full transition"
      >
        <MoreVertical size={20} />
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-40 bg-zinc-900 border border-white/20 rounded-2xl shadow-lg overflow-hidden z-50"
          >
            <button
              onClick={() => {
                onEdit();
                setIsOpen(false);
              }}
              className="flex items-center w-full px-4 py-2 text-sm hover:bg-[rgb(29,29,29)] transition"
            >
              <Edit size={16} className="mr-2 text-gray-600" /> Edit
            </button>

            <button
              onClick={() => {
                onDelete();
                setIsOpen(false);
              }}
              className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-[rgb(29,29,29)] transition"
            >
              <Trash size={16} className="mr-2" /> Delete
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DropdownOptions;
