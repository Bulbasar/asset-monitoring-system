"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { X, AlertTriangle, Info, CheckCircle } from "lucide-react";

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "warning" | "info" | "success";
  isLoading?: boolean;
  staticBackdrop?: boolean;
}

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "danger",
  isLoading = false,
  staticBackdrop = false,
}: ConfirmDialogProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsAnimating(true);
        });
      });
    } else {
      setIsAnimating(false);
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

    const handleClickOutside = (e: MouseEvent) => {
      if (
        dialogRef.current &&
        !dialogRef.current.contains(e.target as Node) &&
        isOpen &&
        !staticBackdrop
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.addEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose, staticBackdrop]);

  if (!shouldRender) return null;

  const variantConfig = {
    danger: {
      icon: AlertTriangle,
      iconColor: "text-destructive",
      bgColor: "bg-destructive/10",
      borderColor: "border-destructive/20",
      buttonColor:
        "bg-destructive hover:bg-destructive/80 text-destructive-foreground border border-destructive",
    },
    warning: {
      icon: AlertTriangle,
      iconColor: "text-warning",
      bgColor: "bg-warning/10",
      borderColor: "border-warning/20",
      buttonColor:
        "bg-warning hover:bg-warning/80 text-white border border-warning",
    },
    info: {
      icon: Info,
      iconColor: "text-primary",
      bgColor: "bg-secondary",
      borderColor: "border-border",
      buttonColor:
        "bg-primary hover:bg-primary/80 text-primary-foreground border border-primary",
    },
    success: {
      icon: CheckCircle,
      iconColor: "text-success",
      bgColor: "bg-success/10",
      borderColor: "border-success/20",
      buttonColor:
        "bg-success hover:bg-success/80 text-white border border-success",
    },
  };

  const config = variantConfig[variant];
  const Icon = config.icon;

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
        onClick={() => {
          if (!staticBackdrop) onClose();
        }}
      />

      {/* Dialog with animation */}
      <div
        ref={dialogRef}
        className={cn(
          "relative max-w-md w-full bg-card rounded-xl shadow-2xl border transition-all duration-300 ease-out",
          config.borderColor,
          isAnimating
            ? "opacity-100 scale-100 translate-y-0"
            : "opacity-0 scale-95 translate-y-4",
        )}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors duration-300"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6">
          <div className="flex items-center justify-center mb-4">
            <div
              className={cn(
                "p-3 rounded-full transition-all duration-300",
                config.bgColor,
              )}
            >
              <Icon className={cn("w-6 h-6", config.iconColor)} />
            </div>
          </div>

          <h3 className="text-lg font-semibold text-center text-foreground transition-colors duration-300 mb-2">
            {title}
          </h3>

          <p className="text-sm text-center text-muted-foreground transition-colors duration-300 mb-6">
            {description}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button
              variant="ghost"
              onClick={onClose}
              disabled={isLoading}
              className="w-full sm:w-auto min-w-[100px] order-2 sm:order-1"
            >
              {cancelText}
            </Button>
            <Button
              onClick={onConfirm}
              disabled={isLoading}
              className={cn(
                "w-full sm:w-auto min-w-[100px] order-1 sm:order-2",
                config.buttonColor,
              )}
            >
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin h-4 w-4 mr-2"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Loading...
                </>
              ) : (
                confirmText
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
