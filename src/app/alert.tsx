import React from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/Alert";
import { Terminal } from "lucide-react";

interface AlertProps {
  error: boolean;
  title: string;
  message: string;
}

const AlertUI = ({ error, title, message }: AlertProps) => {
  return (
    <div>
      {error ? (
        <Alert className="mb-5 bg-red-300">
          <Terminal className="h-4 w-4" />
          <AlertTitle>{title}</AlertTitle>
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      ) : (
        <Alert className="mb-5 bg-green-300">
          <Terminal className="h-4 w-4" />
          <AlertTitle>{title}</AlertTitle>
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default AlertUI;
