import React from "react";
import { RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { useLocation } from "react-router-dom";
import { dockerService } from "@/services/dockerService";

const Header: React.FC = () => {
  const [isRefreshing, setIsRefreshing] = React.useState(false);
  const location = useLocation();

  const getHeaderContent = () => {
    switch (location.pathname) {
      case '/containers':
        return {
          title: "Containers",
          subtitle: "Manage your Docker containers"
        };
      case '/images':
        return {
          title: "Images",
          subtitle: "View and manage Docker images"
        };
      case '/logs':
        return {
          title: "Logs",
          subtitle: "View container logs"
        };
      case '/settings':
        return {
          title: "Settings",
          subtitle: "Configure Docker Monitor"
        };
      default:
        return {
          title: "Docker Monitor",
          subtitle: "Minimal container monitoring"
        };
    }
  };

  const refreshData = async () => {
    setIsRefreshing(true);
    try {
      await Promise.all([
        dockerService.refreshSystemInfo()
      ]);
      toast.success("Data refreshed");
    } catch (err) {
      toast.error("Failed to refresh data");
      console.error("Error refreshing data:", err);
    } finally {
      setIsRefreshing(false);
    }
  };

  const { title, subtitle } = getHeaderContent();

  return (
    <div className="flex justify-between items-center mb-6">
      <div>
        <h1 className="text-2xl font-bold">{title}</h1>
        <p className="text-sm text-muted-foreground">
          {subtitle}
        </p>
      </div>
      <button
        onClick={refreshData}
        disabled={isRefreshing}
        className="flex items-center px-3 py-2 text-sm border border-border rounded-md hover:bg-accent transition-colors"
      >
        <RefreshCw 
          className={`w-4 h-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} 
        />
        Refresh
      </button>
    </div>
  );
};

export default Header;
