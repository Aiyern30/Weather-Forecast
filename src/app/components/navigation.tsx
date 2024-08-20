import { cn } from "@/lib/utils";
import Link from "next/link";
import React, { ReactNode } from "react";

interface NavigationProps {
  link: string;
  title: string;
  icon: React.ElementType<any>;
  handleClick: () => void;
  active: boolean;
}

export const Navigation = ({
  link,
  title,
  icon: Icon,
  handleClick,
  active,
}: NavigationProps) => {
  return (
    <Link
      href={link}
      className={cn(
        " hover:bg-[#EAEAFA] ",
        "w-full h-14 pl-4",
        "flex items-center cursor-pointer",
        "group",
        "transition-all ease-in-out duration-300"
      )}
      onClick={handleClick}
    >
      <div className="pr-5">
        <Icon
          className={cn(
            active ? "text-[rgba(43,135,209)]" : "text-[#A3A3A3]",
            "w-8 h-8  group-hover:scale-105 group-hover:text-[rgba(43,135,209)] dark:text-white"
          )}
        ></Icon>
      </div>
      <div
        className={cn(
          active ? "text-[rgba(43,135,209)]" : "text-[#A3A3A3] dark:text-white",
          "text-xl group-hover:scale-110 group-hover:text-[rgba(43,135,209)] "
        )}
      >
        {title}
      </div>
    </Link>
  );
};
