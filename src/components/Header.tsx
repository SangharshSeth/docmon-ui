
import React from "react";
import { useQueryClient } from "@tanstack/react-query";
import { RefreshCw } from "lucide-react";
import { toast } from "sonner";

const Header: React.FC = () => {
  const queryClient = useQueryClient();
  const [isRefreshing, setIsRefreshing] = React.useState(false);

  const refreshData = async () => {
    setIsRefreshing(true);
    try {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["containers"] }),
        queryClient.invalidateQueries({ queryKey: ["system-info"] })
      ]);
      toast.success("Data refreshed");
    } catch (err) {
      toast.error("Failed to refresh data");
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
