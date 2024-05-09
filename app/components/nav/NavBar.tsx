"use client";

import Link from "next/link";
import UserMenu from "./UserMenu";
import { usePathname } from "next/navigation";
import Logo from "./Logo";
import { SafeUser } from "@/types";
import AdminNavItem from "./AdminNavItem";
import { adminNavItems } from "@/utils/adminNavItems";

interface NavBarProps {
  currentUser: SafeUser | null;
}

const NavBar: React.FC<NavBarProps> = ({ currentUser }) => {
  const pathname = usePathname();

  return (
    <div className="sticky top-0 w-full bg-white z-30 shadow-lg shadow-slate-200">
      <div className="w-full flex shadow-sm border-b-[1px] pt-4">
        <Logo
          custom={`left-4 md:left-2 xl:left-20 h-fit
            ${currentUser ? "bottom-1" : "bottom-2"}
          `}
        />
        {/* <div className="max-w-[1920px] mx-auto xl:px-20 md:px-2 px-4"> */}
        <div className="w-full flex flex-row items-center justify-between md:justify-center gap-8 md:gap-12 overflow-x-auto flex-nowrap">
          {currentUser &&
            adminNavItems.map((item, index) => {
              return (
                <Link href={item.path} key={`navItem${index}`}>
                  <AdminNavItem
                    label={item.label}
                    icon={item.icon}
                    selected={pathname === item.path}
                  />
                </Link>
              );
            })}
        </div>
        {/* </div> */}
        <UserMenu
          currentUser={currentUser}
          custom={`right-4 md:right-2 xl:right-20
            ${currentUser ? "bottom-1" : "bottom-2"}
          `}
        />
      </div>
    </div>
  );
};

export default NavBar;
