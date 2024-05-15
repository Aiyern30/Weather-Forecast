"use client";

import React, { useEffect, useState } from "react";
import { Navigation } from "./navigation";
import { FaChartBar } from "react-icons/fa";
import { RxDashboard } from "react-icons/rx";
import { FiMapPin } from "react-icons/fi";
import { FaRegCalendarAlt } from "react-icons/fa";
import { CiSettings } from "react-icons/ci";
import { MdOutlineLogin } from "react-icons/md";

import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar";
import { Separator } from "@/components/ui/Separator";
import { ModeToggle } from "./toggleDark";

const information = [
  { link: "../", title: "Login", icon: MdOutlineLogin },
  { link: "/Dashboard", title: "Dashboard", icon: RxDashboard },
  { link: "/Statistics", title: "Statistics", icon: FaChartBar },
  { link: "/Maps", title: "Maps", icon: FiMapPin },
  { link: "/Calander", title: "Calander", icon: FaRegCalendarAlt },
  { link: "/Settings", title: "Settings", icon: CiSettings },
];

interface login {
  isLoggined: boolean;
}

export const Sidebar = ({ isLoggined }: login) => {
  console.log("login", isLoggined);
  const [activeIndex, setActiveIndex] = useState<number>(0);

  useEffect(() => {
    const currentPath = window.location.pathname;

    const index = information.findIndex((item) =>
      currentPath.includes(item.link)
    );

    setActiveIndex(index === -1 ? 0 : index);
  }, []);

  const clickNavigation = (index: number) => {
    setActiveIndex(index === activeIndex ? 0 : index);
  };

  return (
    <div className={cn("w-[200px] h-auto bg-[#ffffff] rounded-xl")}>
      <div className="h-[100px] p-20 justify-center flex flex-col items-center space-x-2 cursor-pointer">
        <Avatar className="w-20 h-20 ">
          <AvatarImage src="/logo/logo.png" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <div className="text-justify text-3xl text-black font-bold">
          Weathery
        </div>
      </div>
      <Separator />

      {information.map((item, index) => (
        <Navigation
          key={index}
          link={item.link}
          title={item.title}
          icon={item.icon}
          active={index === activeIndex}
          handleClick={() => clickNavigation(index)}
        />
      ))}
    </div>
  );
};
