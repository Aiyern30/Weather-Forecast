import { Button } from "@/components/ui/Button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Separator } from "@/components/ui/Separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import { Mail } from "lucide-react";
import React from "react";

const page = () => {
  return (
    <div className="flex justify-center items-center min-h-[800px]">
      <div className="w-[1000px] min-h-[500px] flex relative">
        <Card className="w-1/2 bg-black"></Card>

        <Card className="w-1/2 flex items-center justify-center">
          <div>
            <CardHeader>
              <CardTitle className="text-center">Create an account</CardTitle>
              <CardDescription className="text-center">
                Enter your email below to create your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Input
                type="email"
                placeholder="name@gmail.com"
                className="mb-3"
              />
              <Button className="w-full">
                <Mail className="mr-2 h-4 w-4" /> Login with Email
              </Button>
            </CardContent>
            <Separator />
            <CardFooter className="">
              <Button variant="link">Havent Register Acccount?</Button>
            </CardFooter>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default page;
