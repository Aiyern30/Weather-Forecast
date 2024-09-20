"use client";

import React, {
  createContext,
  useState,
  ReactNode,
  Dispatch,
  SetStateAction,
  useEffect,
} from "react";

interface ContextProps {
  isLoggined: boolean;
  setIsLoggined: Dispatch<SetStateAction<boolean>>;
}

export const LoginContext = createContext<ContextProps>({
  isLoggined: false,
  setIsLoggined: () => {},
});

interface Props {
  children: ReactNode;
}

export const LoginProvider = ({ children }: Props) => {
  // Initialize state with value from localStorage
  const [isLoggined, setIsLoggined] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("isLoggined");
      return saved === "true";
    }
    return false;
  });

  // Update localStorage when state changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("isLoggined", String(isLoggined));
    }
  }, [isLoggined]);

  return (
    <LoginContext.Provider value={{ isLoggined, setIsLoggined }}>
      {children}
    </LoginContext.Provider>
  );
};
