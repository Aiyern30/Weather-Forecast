"use client";
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
import { Mail, Trophy } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useMutation } from "react-query";
import AlertUI from "./alert";
import { useRouter } from "next/router";
import { Sidebar } from "./components/sidebar";

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

const page = () => {
  const [page, setPage] = useState<number>(0);
  const [isLoginned, setIsLoginned] = useState<boolean>(false);
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [showError, setShowError] = useState<boolean>(false);
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      username: "",
      password: "",
      email: "",
      phone: "",
    },
  });

  const mutation = useMutation(async (data: Profile) => {
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
  });
  const onSubmit: SubmitHandler<Profile> = async (data) => {
    try {
      await mutation.mutateAsync(data);
      setShowAlert(true); // Show the alert
      setTimeout(() => {
        setShowAlert(false);
        setPage(0);
      }, 3000);
    } catch (error) {
      console.error("Error create account:", error);
    }
  };

  const {
    register: registerLogin,
    handleSubmit: handleLogin,
    control: controlLogin,
    formState: { errors: errorsLogin },
  } = useForm({
    defaultValues: {
      username: "",
      password: "",
      email: "",
    },
  });

  const mutation2 = useMutation(async (data: Login) => {
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
    } else {
      setIsLoginned(true); // Update the login state
    }
  });

  const onSubmitLogin: SubmitHandler<Login> = async (data) => {
    console.log("data", data);
    try {
      await mutation2.mutateAsync(data);
      setShowAlert(true);
      setIsLoginned(true);
      setTimeout(() => {
        setShowAlert(false);
        setPage(0);
        // No need to explicitly render the Sidebar here, state update will trigger re-render
        // router.push("/Dashboard");
      }, 3000);
    } catch (error) {
      console.error("Error login account:", error);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[800px]">
      <div className="w-[1000px] min-h-[500px] flex relative">
        {page == 0 && (
          <>
            <Card className="w-1/2 bg-green-300"></Card>

            <Card className="w-1/2 flex items-center justify-center">
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
                      message="Successfully login"
                      title="Profile login successfully"
                    />
                  )}
                  {showError && (
                    <AlertUI
                      error={true}
                      message="Either email, phone number of password entering wrong!"
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
                        render={() => (
                          <Input
                            id="Username"
                            placeholder="Your Username"
                            {...registerLogin("username")}
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
                        render={({ field }) => (
                          <Input
                            id="email"
                            type="email"
                            placeholder="Your email"
                            {...field}
                            {...registerLogin("email")}
                          />
                        )}
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
                        render={() => (
                          <Input
                            id="password"
                            placeholder="Your Password"
                            {...registerLogin("password")}
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
                      Havent Register Acccount?
                    </Button>
                  </CardFooter>
                </div>
              </form>
            </Card>
          </>
        )}
        {page == 1 && (
          <>
            <Card className="w-1/2 flex items-center justify-center">
              <form onSubmit={handleSubmit(onSubmit)}>
                <CardHeader>
                  <CardTitle className="text-center">
                    Create an account
                  </CardTitle>
                  <CardDescription className="text-center">
                    Enter your email below to create your account
                  </CardDescription>
                </CardHeader>
                {showAlert && (
                  <AlertUI
                    error={false}
                    message="Successfully register an account"
                    title="Profile Created successfully"
                  />
                )}
                {showError && (
                  <AlertUI
                    error={true}
                    message="Account is exist!"
                    title="Profile Created unsuccessfully"
                  />
                )}
                <CardContent className="space-y-2">
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
                      render={() => (
                        <Input
                          id="Username"
                          placeholder="Your Username"
                          {...register("username")}
                        />
                      )}
                    />
                  </div>
                  <span className="text-red-400">
                    {errors.username?.message}
                  </span>

                  <div className="grid w-full max-w-sm items-center gap-1.5">
                    <Label>Email</Label>
                    <Controller
                      name="email"
                      control={control}
                      render={({ field }) => (
                        <Input
                          id="email"
                          type="email"
                          placeholder="Your email"
                          {...field}
                          {...register("email")}
                        />
                      )}
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
                    />
                  </div>
                  <span className="text-red-400">{errors.email?.message}</span>
                  <div className="grid w-full max-w-sm items-center gap-1.5">
                    <Label>Phone Number</Label>
                    <Controller
                      name="phone"
                      control={control}
                      rules={{
                        required: "Phone number is required",
                        maxLength: {
                          value: 10,
                          message: "Phone number format is wrong",
                        },
                        minLength: {
                          value: 10,
                          message: "Phone number format is wrong",
                        },
                      }}
                      render={({ field }) => (
                        <Input
                          placeholder="Your Phone Number"
                          type="number"
                          {...register("phone")}
                          {...field}
                        />
                      )}
                    />
                  </div>
                  <span className="text-red-400">{errors.phone?.message}</span>
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
                      render={() => (
                        <Input
                          id="password"
                          placeholder="Your Password"
                          {...register("password")}
                        />
                      )}
                    />
                  </div>
                  <span className="text-red-400">
                    {errors.password?.message}
                  </span>
                  <Button className="w-full">Sign Up</Button>
                  <div className="mb-3 my-0.5 text-center">Or</div>
                  <Button className="w-full">
                    <Mail className="mr-2 h-4 w-4" /> Sign Up with Email
                  </Button>
                </CardContent>
                <Separator />
                <CardFooter className="">
                  <Button variant="link" onClick={() => setPage(0)}>
                    Registered account?
                  </Button>
                </CardFooter>
              </form>
            </Card>
            <Card className="w-1/2 bg-green-300"></Card>
          </>
        )}
      </div>
    </div>
  );
};

export default page;
