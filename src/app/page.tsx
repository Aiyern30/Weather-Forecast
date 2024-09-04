"use client";
import React, { useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import AlertUI from "./alert";
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
import { Mail } from "lucide-react";
import { LoginContext } from "@/app/LoginContext"; // Import the context
import {
  loadThemeFromLocalStorage,
  applyTheme,
} from "../../pages/api/utils/theme"; // Import utility functions

interface Profile {
  username: string;
  phone: string;
  email: string;
  password: string;
}

interface Login {
  username: string;
  email: string;
  password: string;
}

const Page = () => {
  const [page, setPage] = useState<number>(0);
  const { setIsLoggined } = useContext(LoginContext); // Access setIsLoggined from context
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [showError, setShowError] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<Profile>({
    defaultValues: {
      username: "",
      password: "",
      email: "",
      phone: "",
    },
  });

  const onSubmit: SubmitHandler<Profile> = async (data) => {
    try {
      const response = await fetch(`/api/user`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        setShowError(true);
        setTimeout(() => setShowError(false), 3000);
        throw new Error("Failed to register account !!");
      }

      setShowAlert(true); // Show the alert
      setTimeout(() => {
        setShowAlert(false);
        setPage(0);
      }, 3000);
    } catch (error) {
      console.error("Error creating account:", error);
    }
  };

  const {
    register: registerLogin,
    handleSubmit: handleLogin,
    control: controlLogin,
    formState: { errors: errorsLogin },
  } = useForm<Login>({
    defaultValues: {
      username: "",
      password: "",
      email: "",
    },
  });

  const router = useRouter();

  const onSubmitLogin: SubmitHandler<Login> = async (data) => {
    try {
      const response = await fetch(`/api/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        setShowError(true);
        setTimeout(() => setShowError(false), 3000);
        throw new Error("Failed to login account !!");
      }

      setIsLoggined(true); // Update the login state
      router.push("/Dashboard");
    } catch (error) {
      console.error("Error logging in:", error);
    }
  };

  useEffect(() => {
    const theme = loadThemeFromLocalStorage();
    applyTheme(theme);
  }, []);

  return (
    <div className="flex justify-center items-center min-h-[800px]">
      <div className="min-h-[500px] flex relative">
        {page === 0 && (
          <Card className="w-full flex items-center justify-center">
            <form onSubmit={handleLogin(onSubmitLogin)}>
              <div>
                <CardHeader>
                  <CardTitle className="text-center">
                    Login an account
                  </CardTitle>
                  <CardDescription className="text-center">
                    Enter your email below to login your account
                  </CardDescription>
                </CardHeader>
                {showAlert && (
                  <AlertUI
                    error={false}
                    message="Successfully logged in"
                    title="Profile login successfully"
                  />
                )}
                {showError && (
                  <AlertUI
                    error={true}
                    message="Either email, phone number or password is incorrect!"
                    title="Profile login unsuccessfully"
                  />
                )}
                <CardContent>
                  <div className="grid w-full max-w-sm items-center gap-1.5">
                    <Label>Username</Label>
                    <Controller
                      name="username"
                      control={controlLogin}
                      rules={{
                        required: "Username is required",
                        minLength: {
                          value: 4,
                          message: "Minimum 4 characters required",
                        },
                        maxLength: {
                          value: 20,
                          message: "Maximum 20 characters only",
                        },
                      }}
                      render={({ field }) => (
                        <Input
                          id="username"
                          placeholder="Your Username"
                          {...field}
                        />
                      )}
                    />
                  </div>
                  <span className="text-red-400">
                    {errorsLogin.username?.message}
                  </span>
                  <div className="grid w-full max-w-sm items-center gap-1.5">
                    <Label>Email</Label>
                    <Controller
                      name="email"
                      control={controlLogin}
                      rules={{
                        required: "Email is Required",
                        maxLength: {
                          value: 50,
                          message: "Maximum is 50 characters",
                        },
                        validate: (value) =>
                          value.endsWith("@gmail.com") ||
                          "Email must be a valid Gmail address",
                      }}
                      render={({ field }) => (
                        <Input
                          id="email"
                          type="email"
                          placeholder="Your email"
                          {...field}
                        />
                      )}
                    />
                  </div>
                  <span className="text-red-400">
                    {errorsLogin.email?.message}
                  </span>
                  <div className="grid w-full max-w-sm items-center gap-1.5">
                    <Label>Password</Label>
                    <Controller
                      name="password"
                      control={controlLogin}
                      rules={{
                        required: "Password is required",
                        minLength: {
                          value: 8,
                          message: "Password 8 characters required",
                        },
                        maxLength: {
                          value: 64,
                          message: "Maximum 64 characters only",
                        },
                      }}
                      render={({ field }) => (
                        <Input
                          id="password"
                          placeholder="Your Password"
                          {...field}
                        />
                      )}
                    />
                  </div>
                  <span className="text-red-400">
                    {errorsLogin.password?.message}
                  </span>
                  <Button className="w-full">Login</Button>
                  <div className="mb-3 my-0.5 text-center">Or</div>
                  <Button className="w-full">
                    <Mail className="mr-2 h-4 w-4" /> Login with Email
                  </Button>
                </CardContent>
                <Separator />
                <CardFooter className="">
                  <Button variant="link" onClick={() => setPage(1)}>
                    Haven't Registered an Account?
                  </Button>
                </CardFooter>
              </div>
            </form>
          </Card>
        )}
        {page === 1 && (
          <Card className="w-full flex items-center justify-center">
            <form onSubmit={handleSubmit(onSubmit)}>
              <CardHeader>
                <CardTitle className="text-center">
                  Register an account
                </CardTitle>
                <CardDescription className="text-center">
                  Enter your details below to create an account
                </CardDescription>
              </CardHeader>
              {showAlert && (
                <AlertUI
                  error={false}
                  message="Successfully registered"
                  title="Profile registration successfully"
                />
              )}
              {showError && (
                <AlertUI
                  error={true}
                  message="There was a problem registering the account"
                  title="Profile registration unsuccessfully"
                />
              )}
              <CardContent>
                <div className="grid w-full max-w-sm items-center gap-1.5">
                  <Label>Username</Label>
                  <Controller
                    name="username"
                    control={control}
                    rules={{
                      required: "Username is required",
                      minLength: {
                        value: 4,
                        message: "Minimum 4 characters required",
                      },
                      maxLength: {
                        value: 20,
                        message: "Maximum 20 characters only",
                      },
                    }}
                    render={({ field }) => (
                      <Input
                        id="username"
                        placeholder="Your Username"
                        {...field}
                      />
                    )}
                  />
                </div>
                <span className="text-red-400">{errors.username?.message}</span>
                <div className="grid w-full max-w-sm items-center gap-1.5">
                  <Label>Email</Label>
                  <Controller
                    name="email"
                    control={control}
                    rules={{
                      required: "Email is Required",
                      maxLength: {
                        value: 50,
                        message: "Maximum is 50 characters",
                      },
                      validate: (value) =>
                        value.endsWith("@gmail.com") ||
                        "Email must be a valid Gmail address",
                    }}
                    render={({ field }) => (
                      <Input
                        id="email"
                        type="email"
                        placeholder="Your email"
                        {...field}
                      />
                    )}
                  />
                </div>
                <span className="text-red-400">{errors.email?.message}</span>
                <div className="grid w-full max-w-sm items-center gap-1.5">
                  <Label>Password</Label>
                  <Controller
                    name="password"
                    control={control}
                    rules={{
                      required: "Password is required",
                      minLength: {
                        value: 8,
                        message: "Password 8 characters required",
                      },
                      maxLength: {
                        value: 64,
                        message: "Maximum 64 characters only",
                      },
                    }}
                    render={({ field }) => (
                      <Input
                        id="password"
                        placeholder="Your Password"
                        {...field}
                      />
                    )}
                  />
                </div>
                <span className="text-red-400">{errors.password?.message}</span>
                <Button className="w-full">Register</Button>
              </CardContent>
              <Separator />
              <CardFooter className="">
                <Button variant="link" onClick={() => setPage(0)}>
                  Already have an account?
                </Button>
              </CardFooter>
            </form>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Page;
