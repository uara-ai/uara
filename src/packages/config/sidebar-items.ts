import { Home, Users } from "lucide-react";
import { routes } from "./routes";

// This is sample data
export const sidebarItems = {
  navMain: [
    {
      title: "Dashboard",
      url: routes.dashboard.home,
      icon: Home,
      isActive: false,
    },
    {
      title: "Pazienti",
      url: routes.dashboard.healthOS,
      icon: Users,
      isActive: false,
    },
  ],
};
