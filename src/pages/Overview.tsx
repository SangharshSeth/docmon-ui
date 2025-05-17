import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import SystemInfo from "@/components/SystemInfo";
import { dockerService } from "@/services/dockerService";
import { DockerContainerInfo, DockerImage } from "@/types/docker";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import {
  Box,
  Container as ContainerIcon,
  Image,
  Layers,
  Activity,
  Pause,
  CircleSlash,
  ArrowRight,
  ChevronRight,
  HardDrive,
  Power,
  PowerOff
} from "lucide-react";
import StatusBadge from "@/components/StatusBadge";

const Overview = () => {
  const [containers, setContainers] = useState<DockerContainerInfo[]>([]);
  const [images, setImages] = useState<DockerImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [imagesData, containersData] = await Promise.all([
          dockerService.getImages(),
          dockerService.getContainersSnapshot(),
        ]);
        console.log(`Image data`, imagesData)
        setImages(imagesData);
        setContainers(containersData);
      } catch (err) {
        console.error("Failed to fetch data:", err);
        setError(err instanceof Error ? err : new Error("Unknown error"));
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const renderContainersList = () => {
    if (containers.length === 0) {
      return (
        <div className="text-center p-4 text-muted-foreground">
          No containers found
        </div>
      );
    }    return containers.slice(0, 5).map((container) => (
      <div
        key={container.ID}
        className="flex items-center justify-between py-3 px-4 border-b border-border last:border-0 hover:bg-accent/50"
      >
        <div className="flex items-center space-x-3">
          <ContainerIcon className="w-4 h-4 text-muted-foreground" />
          <Link
            to={`/containers/${container.ID}`}
            className="font-medium"
          >
            {container.Name[0].split("/")[1]}
          </Link>
          <StatusBadge status={container.State as any} />
        </div>
        <Link
          to={`/containers/${container.ID}`}
          className="text-muted-foreground hover:text-foreground"
        >
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    ));
  };

  const renderImagesList = () => {
    if (images.length === 0) {
      return (
        <div className="text-center p-4 text-muted-foreground">
          No images found
        </div>
      );
    }    return images.slice(0, 5).map((image) => (
      <div
        key={image.id}
        className="flex items-center justify-between py-3 px-4 border-b border-border last:border-0 hover:bg-accent/50"
      >
        <Link to={`images/${image.id}`} className="flex-1">
          <div className="flex items-center space-x-3">
            <Layers className="w-4 h-4 text-muted-foreground" />
            <span className="font-medium">
              {image.repo_tags.length > 0
                ? (image.repo_tags[0].includes("/")
                  ? image.repo_tags[0].split("/")[1]
                  : image.repo_tags[0])
                : "<none>:<none>"}
            </span>
          </div>
        </Link>
        <span className="text-sm text-muted-foreground">
          {image.size}
        </span>
      </div>
    ));
  };

  // Quick stats calculation
  const stats = {
    totalContainers: containers.length,
    runningContainers: containers.filter(c => c.State === "running").length,
    stoppedContainers: containers.filter(c => c.State === "exited").length,
    totalImages: images.length,
  };

  return (
    <div className="animate-fade-in space-y-6">
      {/* Stats Overview */}      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card p-4 rounded-lg border border-border">
          <div className="flex items-center space-x-4">            <div className="p-2 bg-accent/50 rounded-lg">
              <ContainerIcon className="w-5 h-5 text-muted-foreground" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Containers</p>
              <p className="text-2xl font-bold">{stats.totalContainers}</p>
            </div>
          </div>
        </div>
        <div className="bg-card p-4 rounded-lg border border-border">
          <div className="flex items-center space-x-4">
            <div className="p-2 bg-accent/50 rounded-lg">
              <Activity className="w-5 h-5 text-muted-foreground" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Running</p>
              <p className="text-2xl font-bold">{stats.runningContainers}</p>
            </div>
          </div>
        </div>
        <div className="bg-card p-4 rounded-lg border border-border">
          <div className="flex items-center space-x-4">
            <div className="p-2 bg-accent/50 rounded-lg">
              <Pause className="w-5 h-5 text-muted-foreground" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Stopped</p>
              <p className="text-2xl font-bold">{stats.stoppedContainers}</p>
            </div>
          </div>
        </div>
        <div className="bg-card p-4 rounded-lg border border-border">
          <div className="flex items-center space-x-4">            <div className="p-2 bg-accent/50 rounded-lg">
              <Box className="w-5 h-5 text-muted-foreground" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Images</p>
              <p className="text-2xl font-bold">{stats.totalImages}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Containers */}
        <div className="border border-border rounded-lg">
          <div className="flex items-center justify-between p-4 border-b border-border bg-card/50">
            <div className="flex items-center space-x-2">
              <ContainerIcon className="w-4 h-4 text-muted-foreground" />
              <h2 className="font-bold">Active Containers</h2>
            </div>
            <Link
              to="/containers"
              className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-2"
            >
              View all
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="divide-y divide-border">
            {isLoading ? (
              <LoadingSkeleton count={3} />
            ) : error ? (
              <div className="p-4 text-destructive bg-card">Failed to load containers</div>
            ) : (
              renderContainersList()
            )}
          </div>
        </div>

        {/* Recent Images */}
        <div className="border border-border rounded-lg">
          <div className="flex items-center justify-between p-4 border-b border-border bg-card/50">
            <div className="flex items-center space-x-2">
              <Layers className="w-4 h-4 text-muted-foreground" />
              <h2 className="font-bold">Recent Images</h2>
            </div>
            <Link
              to="/images"
              className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-2"
            >
              View all
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="divide-y divide-border">
            {isLoading ? (
              <LoadingSkeleton count={3} />
            ) : error ? (
              <div className="p-4 text-destructive bg-card">Failed to load images</div>
            ) : (
              renderImagesList()
            )}
          </div>
        </div>

        {/* Container Events */}
        <div className="border border-border rounded-lg lg:col-span-2">
          <div className="flex items-center space-x-2 p-4 border-b border-border bg-card/50">
            <CircleSlash className="w-4 h-4 text-muted-foreground" />
            <h2 className="font-bold">Recent Events</h2>
          </div>
          <div className="p-4 h-48 flex items-center justify-center text-muted-foreground">
            Container events will be shown here...
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;
