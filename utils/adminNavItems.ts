import {
  MdDashboard,
  MdDns,
  MdFormatListBulleted,
  MdLibraryAdd,
} from "react-icons/md";

export const adminNavItems = [
  {
    label: "Summary",
    icon: MdDashboard,
    path: "/",
  },
  {
    label: "Add Products",
    icon: MdLibraryAdd,
    path: "/add-products",
  },
  {
    label: "Manage Products",
    icon: MdDns,
    path: "/manage-products",
  },
  {
    label: "Manage Orders",
    icon: MdFormatListBulleted,
    path: "/manage-orders",
  },
];
