
import React, { useState, useEffect } from "react";
import SystemInfo from "@/components/SystemInfo";
import Container from "@/components/Container";
import { dockerService } from "@/services/dockerService";

const Overview = () => {
  const [containers, setContainers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchContainers = async () => {
      try {
        setIsLoading(true);
        const data = await dockerService.getContainers();
        setContainers(data);
      } catch (err) {
        console.error("Failed to fetch containers:", err);
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchContainers();
  }, []);

  return (
    <div className="animate-fade-in">
      <SystemInfo />
      
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold">Containers</h2>
          {containers && (
            <div className="text-sm text-muted-foreground">
              Showing {containers.length} containers
            </div>
          )}
        </div>
      </div>
      
      {isLoading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, index) => (
            <div 
              key={index} 
              className="border border-border rounded-md h-24 animate-pulse"
            />
          ))}
        </div>
      ) : error ? (
        <div className="border border-red-300 bg-red-50 text-red-700 rounded-md p-4 dark:bg-red-950 dark:text-red-400 dark:border-red-900">
          <p>Failed to load containers</p>
        </div>
      ) : containers && containers.length > 0 ? (
        <div className="space-y-4">
          {containers.map((container) => (
            <Container key={container.id} container={container} />
          ))}
        </div>
      ) : (
        <div className="border border-border rounded-md p-8 text-center">
          <p className="text-muted-foreground">No containers found</p>
        </div>
      )}
    </div>
  );
};

export default Overview;
