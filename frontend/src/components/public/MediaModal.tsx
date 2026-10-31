"use client";

import { useEffect } from "react";
import { X, Play, Volume2, VolumeX } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface MediaModalProps {
  src: string;
  type: "image" | "video";
  open: boolean;
  onClose: () => void;
}

export const MediaModal = ({ src, type, open, onClose }: MediaModalProps) => {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="relative max-w-5xl w-full max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={onClose}
              className="absolute -top-10 right-0 text-white hover:text-imo-green transition"
            >
              <X size={28} />
            </button>
            {type === "video" ? (
              <video
                src={src}
                controls
                autoPlay
                className="w-full max-h-[85vh] rounded-lg shadow-2xl"
              />
            ) : (
              <img
                src={src}
                alt=""
                className="w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
              />
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};