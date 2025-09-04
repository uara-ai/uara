import { Home, Users, Settings } from "lucide-react";
import { routes } from "./routes";

// This is sample data
export const sidebarItems = {
  navMain: [
    {
      title: "Overview",
      url: routes.overview.home,
      icon: Home,
      isActive: false,
    },
    {
      title: "Pazienti",
      url: routes.overview.healthOS,
      icon: Users,
      isActive: false,
    },
    {
      title: "Settings",
      url: routes.overview.settings,
      icon: Settings,
      isActive: false,
    },
  ],
};
