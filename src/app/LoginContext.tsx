import React, {
  createContext,
  useState,
  ReactNode,
  Dispatch,
  SetStateAction,
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
  const [isLoggined, setIsLoggined] = useState(false);
  console.log("isLoggined", isLoggined);

  return (
    <LoginContext.Provider value={{ isLoggined, setIsLoggined }}>
      {children}
    </LoginContext.Provider>
  );
};
