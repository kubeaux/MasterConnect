import { cn } from "@/src/lib/utils";
import { Loader2 } from "lucide-react";
import { ButtonHTMLAttributes, forwardRef } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", isLoading, children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          "inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed",
          {
            "bg-primary-700 text-white hover:bg-primary-800 focus:ring-primary-500 shadow-sm hover:shadow":
              variant === "primary",
            "bg-white text-primary-700 border border-primary-200 hover:bg-primary-50 focus:ring-primary-300":
              variant === "secondary",
            "bg-accent-500 text-white hover:bg-accent-600 focus:ring-accent-400":
              variant === "danger",
            "text-gray-600 hover:text-gray-800 hover:bg-surface-100":
              variant === "ghost",
          },
          {
            "text-sm px-3 py-1.5": size === "sm",
            "text-sm px-5 py-2.5": size === "md",
            "text-base px-7 py-3": size === "lg",
          },
          className
        )}
        {...props}
      >
        {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
export default Button;