"use client";

import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { X } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
  staticBackdrop?: boolean;
}

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  className,
  staticBackdrop = false,
}: ModalProps) {
  const [isAnimating, setIsAnimating] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      // Trigger animation after a tiny delay
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsAnimating(true);
        });
      });
    } else {
      setIsAnimating(false);
      // Wait for animation to finish before unmounting
      const timer = setTimeout(() => {
        setShouldRender(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen && !staticBackdrop) {
        onClose();
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose, staticBackdrop]);

  if (!shouldRender) return null;

  const handleBackdropClick = () => {
    if (!staticBackdrop) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop with animation */}
      <div
        className={cn(
          "fixed inset-0 transition-all duration-300 ease-out",
          isAnimating ? "opacity-100" : "opacity-0",
        )}
        style={{
          background: "rgba(0, 0, 0, 0.5)",
          backdropFilter: "blur(4px)",
        }}
        onClick={handleBackdropClick}
      />

      {/* Modal with animation */}
      <div
        className={cn(
          "relative bg-card rounded-xl shadow-2xl max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto border border-border transition-all duration-300 ease-out",
          isAnimating
            ? "opacity-100 scale-100 translate-y-0"
            : "opacity-0 scale-95 translate-y-4",
          className,
        )}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors duration-300 z-10"
        >
          <X className="w-5 h-5" />
        </button>
        {title && (
          <div className="border-b border-border px-6 py-4 transition-colors duration-300">
            <h2 className="text-xl font-semibold text-foreground transition-colors duration-300">
              {title}
            </h2>
          </div>
        )}
        <div className="px-6 py-4">{children}</div>
      </div>
    </div>
  );
}
