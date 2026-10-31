"use client";
import React, { useEffect } from "react";

interface ToastProps {
  message: string;
  type?: "success" | "error" | "info";
  isVisible: boolean;
  onClose: () => void;
  duration?: number;
}

export const Toast: React.FC<ToastProps> = ({ message, type = "info", isVisible, onClose, duration = 3000 }) => {
  useEffect(() => {
    if (isVisible && duration > 0) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  if (!isVisible) return null;

  const colors = {
    success: "bg-imo-green text-white",
    error: "bg-red-600 text-white",
    info: "bg-imo-dark text-white",
  };

  return (
    <div className={`fixed bottom-4 right-4 z-50 px-6 py-3 rounded-lg shadow-pop ${colors[type]} max-w-sm w-full md:w-auto`}>
      <div className="flex items-center justify-between gap-4">
        <span className="text-sm font-medium">{message}</span>
        <button onClick={onClose} className="font-bold text-lg leading-none" aria-label="Fermer">&times;</button>
      </div>
    </div>
  );
};