import React, { useState, useRef, useEffect } from "react";

interface HoverCardProps {
  children: React.ReactNode;
  openDelay?: number;
  closeDelay?: number;
}

interface HoverCardTriggerProps {
  children: React.ReactNode;
  asChild?: boolean;
}

interface HoverCardContentProps {
  children: React.ReactNode;
  className?: string;
}

export function HoverCard({ children, openDelay = 0, closeDelay = 0 }: HoverCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const openTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Clean up timeouts when component unmounts
  useEffect(() => {
    return () => {
      if (openTimeoutRef.current) clearTimeout(openTimeoutRef.current);
      if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
    };
  }, []);

  const handleMouseEnter = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }

    openTimeoutRef.current = setTimeout(() => {
      setIsOpen(true);
    }, openDelay);
  };

  const handleMouseLeave = () => {
    if (openTimeoutRef.current) {
      clearTimeout(openTimeoutRef.current);
      openTimeoutRef.current = null;
    }

    closeTimeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, closeDelay);
  };

  return (
    <div 
      className="relative inline-block" 
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {React.Children.map(children, child => {
        if (React.isValidElement(child)) {
          if (child.type === HoverCardTrigger) {
            return React.cloneElement(child as React.ReactElement<any>, { isOpen });
          }
          if (child.type === HoverCardContent) {
            return isOpen ? child : null;
          }
        }
        return child;
      })}
    </div>
  );
}

export function HoverCardTrigger({ children, asChild = false }: HoverCardTriggerProps) {
  if (asChild) {
    return children;
  }
  
  return (
    <div className="inline-block cursor-pointer">
      {children}
    </div>
  );
}

export function HoverCardContent({ children, className = "" }: HoverCardContentProps) {
  return (
    <div className={`absolute z-50 bg-white border rounded-md shadow-lg top-full left-0 min-w-[200px] ${className}`}>
      {children}
    </div>
  );
} 