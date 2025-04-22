import React from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  Container, 
  Boxes, 
  Terminal, 
  Settings,
  Server
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { 
    name: "Overview", 
    icon: LayoutDashboard, 
    path: "/" 
  },
  { 
    name: "Containers", 
    icon: Container, 
    path: "/containers" 
  },
  { 
    name: "Images", 
    icon: Boxes, 
    path: "/images" 
  },
  { 
    name: "Logs", 
    icon: Terminal, 
    path: "/logs" 
  },
  { 
    name: "Settings", 
    icon: Settings, 
    path: "/settings" 
  }
];

const Sidebar: React.FC = () => {
  const location = useLocation();
  const [collapsed, setCollapsed] = React.useState(false);

  return (
    <div className={cn(
      "h-screen border-r border-border bg-background transition-all duration-300",
      collapsed ? "w-16" : "w-64"
    )}>
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className={cn("flex items-center", collapsed && "justify-center w-full")}>
          <Server className="w-6 h-6 mr-2" />
          {!collapsed && <span className="text-3xl font-bold">D0CM0N</span>}
        </div>
        <button 
          onClick={() => setCollapsed(!collapsed)}
          className="p-1 text-muted-foreground hover:text-foreground"
        >
          {collapsed ? "→" : "←"}
        </button>
      </div>
      <nav className="p-2">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.name}>
              <Link
                to={item.path}
                className={cn(
                  "flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent",
                  location.pathname === item.path
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground hover:text-foreground",
                  collapsed && "justify-center p-2"
                )}
              >
                <item.icon className={cn("w-5 h-5", !collapsed && "mr-3")} />
                {!collapsed && <span>{item.name}</span>}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
