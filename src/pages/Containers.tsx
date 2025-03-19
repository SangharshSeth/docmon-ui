
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { dockerService } from "@/services/dockerService";
import StatusBadge from "@/components/StatusBadge";
import { Server, Clock } from "lucide-react";
import { formatDistance } from "date-fns";

const Containers = () => {
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
      <div className="mb-6">
        <h2 className="text-lg font-bold">Containers</h2>
        <p className="text-sm text-muted-foreground">View and manage all Docker containers</p>
      </div>
      
      {isLoading ? (
        <div className="space-y-4">
          {[...Array(5)].map((_, index) => (
            <div key={index} className="border border-border rounded-md h-16 animate-pulse" />
          ))}
        </div>
      ) : error ? (
        <div className="border border-red-300 bg-red-50 text-red-700 rounded-md p-4 dark:bg-red-950 dark:text-red-400 dark:border-red-900">
          <p>Failed to load containers</p>
        </div>
      ) : containers && containers.length > 0 ? (
        <div className="border border-border rounded-md overflow-hidden">
          <div className="grid grid-cols-[1fr,1fr,auto,auto,auto] gap-4 p-4 bg-card text-xs uppercase font-medium text-muted-foreground border-b border-border">
            <div>Container</div>
            <div>Image</div>
            <div>Status</div>
            <div>Created</div>
            <div></div>
          </div>
          {containers.map((container) => {
            const name = container.names[0].replace(/^\//, "");
            const createdTime = formatDistance(
              new Date(container.created),
              new Date(),
              { addSuffix: true }
            );
            
            return (
              <div
                key={container.id}
                className="grid grid-cols-[1fr,1fr,auto,auto,auto] gap-4 p-4 items-center hover:bg-accent/5 border-b border-border last:border-0"
              >
                <div className="flex items-center">
                  <Server className="w-4 h-4 mr-2 text-muted-foreground" />
                  <span className="font-medium">{name}</span>
                </div>
                <div className="text-sm font-mono truncate">
                  {container.image}
                </div>
                <StatusBadge status={container.state} />
                <div className="text-sm flex items-center">
                  <Clock className="w-3 h-3 mr-1 text-muted-foreground" />
                  {createdTime}
                </div>
                <div>
                  <Link
                    to={`/containers/${container.id}`}
                    className="text-sm underline text-muted-foreground hover:text-foreground"
                  >
                    Details
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="border border-border rounded-md p-8 text-center">
          <p className="text-muted-foreground">No containers found</p>
        </div>
      )}
    </div>
  );
};

export default Containers;
