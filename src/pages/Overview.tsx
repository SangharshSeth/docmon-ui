import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import SystemInfo from "@/components/SystemInfo";
import { Container } from "@/components/Container";
import { dockerService } from "@/services/dockerService";
import { DockerContainerInfo, DockerImage } from "@/types/docker";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import ResourceCard from "@/components/ResourceCard";
import { 
  Box, 
  Container as ContainerIcon, 
  HardDrive, 
  Database,
  ArrowRight,
  Activity,
  Layers
} from "lucide-react";
import StatusBadge from "@/components/StatusBadge";

/**
 * Overview page component that displays system information, containers, images,
 * and resource usage in a dashboard layout
 */
const Overview = () => {
  // State management for data and loading states
  const [containers, setContainers] = useState<DockerContainerInfo[]>([]);
  const [images, setImages] = useState<DockerImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Fetch containers and images data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [containersData, imagesData] = await Promise.all([
          dockerService.getContainers(),
          dockerService.getImages()
        ]);
        setContainers(containersData);
        setImages(imagesData);
      } catch (err) {
        console.error("Failed to fetch data:", err);
        setError(err instanceof Error ? err : new Error('Unknown error'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  /**
   * Renders a list of up to 5 containers with their status and link to details
   */
  const renderContainersList = () => {
    if (containers.length === 0) {
      return (
        <div className="text-center p-4 text-muted-foreground">
          No containers found
        </div>
      );
    }

    return containers.slice(0, 5).map((container) => (
      <div key={container.id} className="flex items-center justify-between py-3 px-4 border-b border-border last:border-0">
        <div className="flex items-center space-x-3">
          <ContainerIcon className="w-4 h-4 text-muted-foreground" />
          <Link to={`/containers/${container.id}`} className="hover:underline font-medium">
            {container.names}
          </Link>
          <StatusBadge status={container.status as any} />
        </div>
        <Link 
          to={`/containers/${container.id}`}
          className="text-muted-foreground hover:text-foreground"
        >
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    ));
  };

  /**
   * Renders a list of up to 5 images with their size information
   */
  const renderImagesList = () => {
    if (images.length === 0) {
      return (
        <div className="text-center p-4 text-muted-foreground">
          No images found
        </div>
      );
    }

    return images.slice(0, 5).map((image) => (
      <div key={image.basic_info.image_id} className="flex items-center justify-between py-3 px-4 border-b border-border last:border-0">
        <div className="flex items-center space-x-3">
          <Layers className="w-4 h-4 text-muted-foreground" />
          <span className="font-medium">
            {image.basic_info.repo_tags[0] || '<none>:<none>'}
          </span>
        </div>
        <span className="text-sm text-muted-foreground">
          {image.basic_info.size}
        </span>
      </div>
    ));
  };

  return (
    <div className="animate-fade-in space-y-6">
      {/* System Information Section */}
      <SystemInfo />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Containers Section */}
        <div className="border border-border rounded-md">
          <div className="flex items-center justify-between p-4 border-b border-border">
            <div className="flex items-center space-x-2">
              <Box className="w-4 h-4 text-muted-foreground" />
              <h2 className="font-bold">Containers</h2>
            </div>
            <Link 
              to="/containers" 
              className="text-sm text-muted-foreground hover:text-foreground flex items-center"
            >
              View all
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
          <div className="divide-y divide-border">
            {isLoading ? (
              <LoadingSkeleton count={3} />
            ) : error ? (
              <div className="p-4 text-red-500">Failed to load containers</div>
            ) : (
              renderContainersList()
            )}
          </div>
        </div>

        {/* Images Section */}
        <div className="border border-border rounded-md">
          <div className="flex items-center justify-between p-4 border-b border-border">
            <div className="flex items-center space-x-2">
              <HardDrive className="w-4 h-4 text-muted-foreground" />
              <h2 className="font-bold">Images</h2>
            </div>
            <Link 
              to="/images" 
              className="text-sm text-muted-foreground hover:text-foreground flex items-center"
            >
              View all
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
          <div className="divide-y divide-border">
            {isLoading ? (
              <LoadingSkeleton count={3} />
            ) : error ? (
              <div className="p-4 text-red-500">Failed to load images</div>
            ) : (
              renderImagesList()
            )}
          </div>
        </div>
      </div>

      {/* Resource Usage Section */}
      <div className="border border-border rounded-md">
        <div className="flex items-center space-x-2 p-4 border-b border-border">
          <Activity className="w-4 h-4 text-muted-foreground" />
          <h2 className="font-bold">Resource Usage</h2>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <ResourceCard 
              icon={Database} 
              title="Memory Usage" 
              isLoading={isLoading} 
            />
            <ResourceCard 
              icon={Activity} 
              title="CPU Usage" 
              isLoading={isLoading} 
            />
            <ResourceCard 
              icon={HardDrive} 
              title="Disk Usage" 
              isLoading={isLoading} 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;
