"use client";

import React, { useEffect, useState, useContext } from "react";
import { Navigation } from "./navigation";
import { FaChartBar } from "react-icons/fa";
import { RxDashboard } from "react-icons/rx";
import { CiSettings } from "react-icons/ci";
import { MdOutlineLogin } from "react-icons/md";

import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar";
import { Separator } from "@/components/ui/Separator";
import { usePathname } from "next/navigation"; // Use next/navigation
import { LoginContext } from "../LoginContext"; // Import the context

const information = [
  { link: "/Dashboard", title: "Dashboard", icon: RxDashboard },
  { link: "/Statistics", title: "Statistics", icon: FaChartBar },
  // { link: "/Maps", title: "Maps", icon: FiMapPin },
  // { link: "/Calander", title: "Calander", icon: FaRegCalendarAlt },
  // { link: "/Settings", title: "Settings", icon: CiSettings },
];

const loginNavigation = { link: "../", title: "Login", icon: MdOutlineLogin };

export const Sidebar = () => {
  const { isLoggined } = useContext(LoginContext); // Access login state here
  const pathname = usePathname(); // Use usePathname from next/navigation
  console.log("pathname", pathname);

  const [activeIndex, setActiveIndex] = useState<number>(0);

  useEffect(() => {
    const index = information.findIndex((item) =>
      pathname?.includes(item.link)
    );
    setActiveIndex(index === -1 ? 0 : index);
  }, [pathname]); // Update when pathname changes

  const clickNavigation = (index: number) => {
    setActiveIndex(index);
  };

  return (
    <div
      className={cn(
        "w-[200px] h-auto bg-[#ffffff] dark:bg-[#1E1E1E] rounded-xl"
      )}
    >
      <div className="h-[100px] p-20 justify-center flex flex-col items-center space-x-2 cursor-pointer">
        <Avatar className="w-20 h-20 ">
          <AvatarImage src="/logo/Logo.png" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <div className="text-justify text-3xl text-black font-bold dark:text-white">
          Weathery
        </div>
      </div>
      <Separator />
      {""}

      {!isLoggined && (
        <Navigation
          link={loginNavigation.link}
          title={loginNavigation.title}
          icon={loginNavigation.icon}
          active={activeIndex === -1} // Special case for login page
          handleClick={() => clickNavigation(-1)}
        />
      )}

      {isLoggined &&
        information.map((item, index) => (
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
