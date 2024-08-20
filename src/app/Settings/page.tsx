"use client";
import React, { useEffect, useState } from "react";
import { useMutation } from "react-query";
import { extractBody } from "../../../pages/api/utils/extractBody";
import {
  Controller,
  FieldValues,
  SubmitHandler,
  useForm,
} from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/Input";
import { ColorResult, SketchPicker } from "react-color";
import { Button } from "@/components/ui/Button";
import Twitter from "react-color/lib/components/twitter/Twitter";
import { Separator } from "@/components/ui/Separator";
import Circle from "react-color/lib/components/circle/Circle";
import Slider from "react-color/lib/components/slider/Slider";
import { Moon, Sun, Terminal } from "lucide-react";
import { ModeToggle } from "../components/toggleDark";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/Accordion";
import { Slider as UISlider } from "@/components/ui/Slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/Card";
import { Label } from "@radix-ui/react-dropdown-menu";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@radix-ui/react-select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AlertUI from "../alert";
import { cn } from "@/lib/utils";

interface Profile {
  // picture: string;
  username: string;
  email: string;
  phone: string;
  userid: string;
}

interface Password {
  userid: string;
  password: string;
  newPassword: string;
}
const Page = () => {
  const UserID = "96892257-2898-4a9b-9ba7-478e6f794dca";
  const [value, setValues] = useState({
    userid: "",
    // picture: "",
    username: "",
    email: "",
    phone: "",
    password: "",
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`/api/user?userid=${UserID}`);
        if (response.ok) {
          const userData = await response.json();
          setValues({
            userid: userData[0]?.userid || "",
            // picture: userData[0]?.picture || "",
            username: userData[0]?.username || "",
            email: userData[0]?.email || "",
            phone: userData[0]?.noph || "",
            password: userData[0]?.password || "",
          });
        } else {
          console.error("Failed to fetch user data:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  const {
    register: registerProfile,
    handleSubmit: handleSubmitProfile,
    formState: { errors },
    watch,
    control,
    reset,
  } = useForm({
    defaultValues: {
      userid: value.userid,
      // picture: value.picture,
      username: value.username,
      email: value.email,
      phone: value.phone,
      // password: "",
      // newPassword: "",
    },
  });

  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    formState: { errors: passwordErrors },
    control: passwordControl,
    reset: resetPassword,
  } = useForm({
    defaultValues: {
      userid: value.userid,
      password: "",
      newPassword: "",
    },
  });

  useEffect(() => {
    reset({
      userid: value.userid,
      // picture: value.picture,
      username: value.username,
      email: value.email,
      phone: value.phone,
    });
    resetPassword({
      userid: value.userid,
      password: "",
      newPassword: "",
    });
  }, [value]);

  const mutation = useMutation(async (data: Profile) => {
    console.log("data", data);
    const response = await fetch(`/api/user?userid=${UserID}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Failed to update user profile!!");
    }
    return response.json();
  });

  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [showError, setShowError] = useState<boolean>(false);

  const onSubmitProfile: SubmitHandler<Profile> = async (data) => {
    try {
      await mutation.mutateAsync(data);
      setShowAlert(true); // Show the alert
      setTimeout(() => setShowAlert(false), 3000);
    } catch (error) {
      console.error("Error updating user profile:", error);
    }
  };

  const mutation2 = useMutation(async (data: Password) => {
    console.log("data2", data);
    const response = await fetch(`/api/user?userid=${UserID}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });

    console.log("Response", response);

    if (response.ok) {
      return response.text(); // Assuming the response body is text
    } else {
      if (response.status === 400) {
        const errorMessage = await response.text();
        setShowError(true);
        setTimeout(() => setShowError(false), 3000);
        throw new Error(errorMessage);
      } else {
        throw new Error("Failed to update user password");
      }
    }
  });

  const onSubmitPassword: SubmitHandler<FieldValues> = async (data) => {
    console.log("password data", data);
    try {
      const response = await mutation2.mutateAsync(data as Password);
      setShowAlert(true); // Show the alert
      resetPassword({
        userid: value.userid,
        password: "",
        newPassword: "",
      });
      setTimeout(() => setShowAlert(false), 3000);
    } catch (error) {
      console.error("Error updating user password:", error);
    }
  };

  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    field: any
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          const result = reader.result;
          if (result && typeof result === "string") {
            setSelectedImage(result);
            field.onChange(result); // Set the value of the picture field in the form
          }
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const [background, setBackground] = useState("#561ecb");

  const handleChangeComplete = (color: ColorResult) => {
    setBackground(color.hex);
  };

  const [textSize, setTextSize] = useState(16);

  const handleTextSizeChange = (newValue: number[]) => {
    setTextSize(newValue[0]);
  };

  return (
    <>
      <Tabs defaultValue="Account" className="w-full">
        <TabsList>
          <TabsTrigger value="Account">Account</TabsTrigger>
          <TabsTrigger value="Appearance">Appearance</TabsTrigger>
        </TabsList>
        <TabsContent value="Account">
          <div className="px-20 border rounded-xl">
            <div className="flex flex-col items-center">
              <div className="header text-3xl text-black dark:text-white">
                Account
              </div>
              <div>
                Customize your account settings and personal information here.
              </div>
            </div>
            <Separator className="my-5" />
            {showAlert && (
              <AlertUI
                error={false}
                message="Update profile successfully"
                title="Profile Updated"
              />
            )}
            {showError && (
              <AlertUI
                error={true}
                message="Password is not same"
                title="Profile is not updated"
              />
            )}
            <div className="flex space-x-10">
              <Card className="w-1/2">
                <form onSubmit={handleSubmitProfile(onSubmitProfile)}>
                  <CardHeader>
                    <CardTitle>Profile Settings</CardTitle>
                    <CardDescription>
                      Update your photo and personal details here.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid w-full items-center gap-4">
                      <div className="flex flex-col space-y-1.5">
                        <Label>UserID</Label>
                        <Controller
                          name="userid"
                          control={control}
                          render={() => (
                            <Input
                              placeholder="Your UserID"
                              {...registerProfile("userid")}
                              disabled
                            />
                          )}
                        />
                      </div>

                      {/* <div className="flex flex-col space-y-1.5">
                        <Label>Profile Image</Label>
                        <Controller
                          name="picture"
                          control={control}
                          render={({ field }) => (
                            <div className="flex items-center space-x-5">
                              <div>
                                <Avatar className="w-36 h-36">
                                  {selectedImage ? (
                                    <AvatarImage src={selectedImage} />
                                  ) : (
                                    <AvatarImage src="https://github.com/shadcn.png" />
                                  )}
                                </Avatar>
                              </div>
                              <div>
                                <Input
                                  id="picture"
                                  type="file"
                                  onChange={(e) => handleFileChange(e, field)}
                                  accept=".jpg, .jpeg, .png"
                                />
                              </div>
                            </div>
                          )}
                        />
                      </div> */}

                      <div className="flex flex-col space-y-1.5">
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
                              {...registerProfile("username")}
                            />
                          )}
                        />
                      </div>
                      <span className="text-red-400">
                        {errors.username?.message}
                      </span>

                      <div className="flex flex-col space-y-1.5">
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
                              {...registerProfile("email")}
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
                        {errors.email?.message}
                      </span>
                      <div className="flex flex-col space-y-1.5">
                        <Label>Phone number</Label>
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
                              {...registerProfile("phone")}
                              {...field}
                            />
                          )}
                        />
                      </div>
                      <span className="text-red-400">
                        {errors.phone?.message}
                      </span>
                    </div>
                  </CardContent>
                  <CardFooter className="">
                    <Button className="ml-auto" type="submit">
                      Save Changes
                    </Button>
                  </CardFooter>
                </form>
              </Card>
              <Card className="w-1/2">
                <CardHeader>
                  <CardTitle>Update Profile</CardTitle>
                  <CardDescription>
                    Enter your current password to make update
                  </CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmitPassword(onSubmitPassword)}>
                  <CardContent>
                    <div className="grid w-full items-center gap-4">
                      <div className="hidden">
                        <Label>UserID</Label>
                        <Controller
                          name="userid"
                          control={passwordControl}
                          render={() => (
                            <Input
                              placeholder="Your UserID"
                              {...registerPassword("userid")}
                              disabled
                            />
                          )}
                        />
                      </div>
                      <div className="flex flex-col space-y-1.5">
                        <Label>Password</Label>
                        <Controller
                          name="password"
                          control={passwordControl}
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
                              {...registerPassword("password")}
                            />
                          )}
                        />
                      </div>
                      <span className="text-red-400">
                        {passwordErrors.password?.message}
                      </span>
                      <div className="flex flex-col space-y-1.5">
                        <Label>New Password</Label>
                        <Controller
                          name="newPassword"
                          control={passwordControl}
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
                              placeholder="Your Password"
                              {...registerPassword("newPassword")}
                            />
                          )}
                        />
                      </div>
                      <span className="text-red-400">
                        {passwordErrors.newPassword?.message}
                      </span>
                    </div>
                  </CardContent>
                  <CardFooter className="flex">
                    <Button className="ml-auto" type="submit">
                      Update
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="Appearance">
          <div className="px-20 border rounded-xl">
            <div className="flex flex-col items-center">
              <div className="header text-3xl text-black dark:text-white">
                Appearance
              </div>
              <div>Manage settings for your weather appearance</div>
            </div>
            <Separator className="my-5" />
            <div className="flex flex-col space-y-3">
              <div className="header text-xl text-black dark:text-white">
                Theme
              </div>
              <div>This only applies to your public pages</div>
              <ModeToggle />
            </div>
            <Separator className="my-5" />
            <div className="flex flex-col space-y-3">
              <div className="header text-xl text-black dark:text-white">
                Custom Color
              </div>
              <div>Customize your own colour in your page</div>
              <div className="flex space-x-8 items-center pt-4 ">
                <div className="flex flex-col ">
                  <div className="min-w-[1150px]">
                    <Accordion
                      type="single"
                      className="w-full"
                      defaultValue="item-1"
                    >
                      <AccordionItem value="item-1">
                        <AccordionTrigger
                          className={`bg-${background}`}
                          style={{ backgroundColor: background }}
                        >
                          Header Color:
                        </AccordionTrigger>
                        <AccordionContent className="flex space-x-5">
                          <div className="w-1/2 flex flex-col space-y-5">
                            <div className="flex justify-center items-center space-x-3">
                              <Sun
                                className="rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
                                width={25}
                                height={25}
                              />
                              <div className="text-xl">Light Theme:</div>
                            </div>
                            <div className="flex  space-x-5">
                              <SketchPicker
                                color={background}
                                onChangeComplete={handleChangeComplete}
                              />
                              <div className="flex flex-col ">
                                <Circle
                                  color={background}
                                  onChangeComplete={handleChangeComplete}
                                  className="my-2"
                                />
                                <Slider
                                  color={background}
                                  onChangeComplete={handleChangeComplete}
                                  className="w-full my-2"
                                />
                              </div>
                            </div>
                          </div>
                          <div className="w-1/2 flex flex-col space-y-5">
                            <div className="flex justify-center items-center space-x-3">
                              <Moon
                                className="rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
                                width={25}
                                height={25}
                              />
                              <div className="text-xl">Dark Theme:</div>
                            </div>
                            <div className="flex  space-x-5">
                              <SketchPicker
                                color={background}
                                onChangeComplete={handleChangeComplete}
                              />
                              <div className="flex flex-col ">
                                <Circle
                                  color={background}
                                  onChangeComplete={handleChangeComplete}
                                  className="my-2"
                                />
                                <Slider
                                  color={background}
                                  onChangeComplete={handleChangeComplete}
                                  className="w-full my-2"
                                />
                              </div>
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="item-2">
                        <AccordionTrigger>Border Color: </AccordionTrigger>
                        <AccordionContent className="flex space-x-5">
                          <div className="w-1/2 flex flex-col space-y-5">
                            <div className="flex justify-center items-center space-x-3">
                              <Sun
                                className="rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
                                width={25}
                                height={25}
                              />
                              <div className="text-xl">Light Theme:</div>
                            </div>
                            <div className="flex  space-x-5">
                              <SketchPicker
                                color={background}
                                onChangeComplete={handleChangeComplete}
                              />
                              <div className="flex flex-col ">
                                <Circle
                                  color={background}
                                  onChangeComplete={handleChangeComplete}
                                  className="my-2"
                                />
                                <Slider
                                  color={background}
                                  onChangeComplete={handleChangeComplete}
                                  className="w-full my-2"
                                />
                              </div>
                            </div>
                          </div>
                          <div className="w-1/2 flex flex-col space-y-5">
                            <div className="flex justify-center items-center space-x-3">
                              <Moon
                                className="rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
                                width={25}
                                height={25}
                              />
                              <div className="text-xl">Dark Theme:</div>
                            </div>
                            <div className="flex  space-x-5">
                              <SketchPicker
                                color={background}
                                onChangeComplete={handleChangeComplete}
                              />
                              <div className="flex flex-col ">
                                <Circle
                                  color={background}
                                  onChangeComplete={handleChangeComplete}
                                  className="my-2"
                                />
                                <Slider
                                  color={background}
                                  onChangeComplete={handleChangeComplete}
                                  className="w-full my-2"
                                />
                              </div>
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="item-3">
                        <AccordionTrigger>Background Color:</AccordionTrigger>
                        <AccordionContent className="flex space-x-5">
                          <div className="w-1/2 flex flex-col space-y-5">
                            <div className="flex justify-center items-center space-x-3">
                              <Sun
                                className="rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
                                width={25}
                                height={25}
                              />
                              <div className="text-xl">Light Theme:</div>
                            </div>
                            <div className="flex  space-x-5">
                              <SketchPicker
                                color={background}
                                onChangeComplete={handleChangeComplete}
                              />
                              <div className="flex flex-col ">
                                <Circle
                                  color={background}
                                  onChangeComplete={handleChangeComplete}
                                  className="my-2"
                                />
                                <Slider
                                  color={background}
                                  onChangeComplete={handleChangeComplete}
                                  className="w-full my-2"
                                />
                              </div>
                            </div>
                          </div>
                          <div className="w-1/2 flex flex-col space-y-5">
                            <div className="flex justify-center items-center space-x-3">
                              <Moon
                                className="rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
                                width={25}
                                height={25}
                              />
                              <div className="text-xl">Dark Theme:</div>
                            </div>
                            <div className="flex  space-x-5">
                              <SketchPicker
                                color={background}
                                onChangeComplete={handleChangeComplete}
                              />
                              <div className="flex flex-col ">
                                <Circle
                                  color={background}
                                  onChangeComplete={handleChangeComplete}
                                  className="my-2"
                                />
                                <Slider
                                  color={background}
                                  onChangeComplete={handleChangeComplete}
                                  className="w-full my-2"
                                />
                              </div>
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </div>
                  <div></div>
                </div>
              </div>
            </div>
            <Separator className="my-5" />
            <div className="flex flex-col space-y-3">
              <div className="header text-xl text-black dark:text-white">
                Custom Text
              </div>
              <div>Customize your own text in your page</div>
              <div className="flex pt-4 flex-col space-y-5">
                <div className="flex flex-col space-y-3">
                  <div>Accent color</div>
                  <div>
                    <Twitter
                      color={background}
                      onChangeComplete={handleChangeComplete}
                    />
                  </div>
                </div>
                <div className="flex flex-col space-y-3">
                  <div>Text style</div>
                  <div className="flex items-center space-x-5">
                    <Button
                      variant="outline"
                      value={"Sans"}
                      className="min-w-24"
                    >
                      Sans
                    </Button>
                    <Button
                      variant="outline"
                      value={"Pops"}
                      className="min-w-24"
                    >
                      Pops
                    </Button>
                    <Button
                      variant="outline"
                      value={"Roboto"}
                      className="min-w-24"
                    >
                      Roboto
                    </Button>
                  </div>
                </div>
                <div className="flex flex-col space-y-3">
                  <div>Text size</div>

                  <div className="flex flex-col space-y-5 ">
                    <UISlider
                      min={12}
                      max={20}
                      step={1}
                      value={[textSize]}
                      onValueChange={(newValue: number[]) =>
                        handleTextSizeChange(newValue)
                      }
                    />
                    <div style={{ fontSize: textSize }}>
                      Current text is {textSize}px
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <Button variant="outline" className="flex ml-auto my-5">
              Save Changes
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </>
  );
};

export default Page;
