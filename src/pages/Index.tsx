
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { dockerService } from "@/services/dockerService";
import Container from "@/components/Container";
import SystemInfo from "@/components/SystemInfo";
import Header from "@/components/Header";

const Index = () => {
  const { data: containers, isLoading, error } = useQuery({
    queryKey: ["containers"],
    queryFn: () => dockerService.getContainersSnapshot(),
  });

  return (
    <div className="min-h-screen bg-background py-8 px-4 sm:px-6 lg:px-8 font-mono animate-fade-in">
      <div className="max-w-7xl mx-auto">
        <Header />
        
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
              <Container key={container.ID} container={container} />
            ))}
          </div>
        ) : (
          <div className="border border-border rounded-md p-8 text-center">
            <p className="text-muted-foreground">No containers found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
