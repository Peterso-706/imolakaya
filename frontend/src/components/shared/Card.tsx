import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: "none" | "sm" | "md" | "lg";
}

export const Card: React.FC<CardProps> = ({ children, className = "", padding = "md" }) => {
  const paddings = { none: "", sm: "p-3", md: "p-5", lg: "p-8" };
  return (
    <div className={`bg-white rounded-lg border border-imo-gray shadow-card ${paddings[padding]} ${className}`}>
      {children}
    </div>
  );
};