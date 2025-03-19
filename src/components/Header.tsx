
import React from "react";
import { RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { dockerService } from "@/services/dockerService";

const Header: React.FC = () => {
  const [isRefreshing, setIsRefreshing] = React.useState(false);

  const refreshData = async () => {
    setIsRefreshing(true);
    try {
      // Directly trigger a data refresh instead of using React Query
      await Promise.all([
        dockerService.refreshContainers(),
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

  return (
    <div className="flex justify-between items-center mb-6">
      <div>
        <h1 className="text-2xl font-bold">Docker Monitor</h1>
        <p className="text-sm text-muted-foreground">
          Minimal container monitoring
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
