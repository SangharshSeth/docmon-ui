import React, { useState, useEffect } from "react";
import { DockerImage } from "@/types/docker";
import { dockerService } from "@/services/dockerService";
import { HardDrive, Clock, Play, Cpu, Container } from "lucide-react";
import clsx from "clsx";

export default function Images() {
  const [images, setImages] = useState<DockerImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        setIsLoading(true);
        const data = await dockerService.getImages();
        setImages(data);
      } catch (err) {
        console.error("Failed to fetch images:", err);
        setError(err instanceof Error ? err : new Error('Failed to fetch images'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchImages();
  }, []);

  const handleCreateContainer = (imageId: string) => {
    console.log('Create container from image:', imageId);
    // TODO: Implement container creation
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h2 className="text-lg font-bold">Images</h2>
        <p className="text-sm text-muted-foreground">View and manage Docker images</p>
      </div>
      
      {isLoading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, index) => (
            <div 
              key={index} 
              className="border border-border rounded-md h-12 animate-pulse"
            />
          ))}
        </div>
      ) : error ? (
        <div className="border border-border bg-card text-destructive rounded-md p-4">
          <p>Failed to load images</p>
        </div>
      ) : images.length > 0 ? (
        <div className="border border-border rounded-md overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-accent/50">
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Container className="w-4 h-4" />
                    Repository Tags
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  <div className="flex items-center gap-2">
                    ID
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <HardDrive className="w-4 h-4" />
                    Size
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Cpu className="w-4 h-4" />
                    Platform
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Created
                  </div>
                </th>
                <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {images.map((image) => (
                <tr key={image.id} className="border-b border-border hover:bg-accent/50 transition-colors">
                  <td className="px-4 py-3 text-sm">
                    {image.repo_tags[0] || 'unnamed'}
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">
                    {image.id.substring(7, 19)}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {image.size}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {image.arch}/{image.os}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {image.created_at}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => handleCreateContainer(image.id)}
                      className="px-3 py-1.5 border border-border rounded-md hover:bg-accent text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2 ml-auto"
                      title="Create Container"
                    >
                      <Play className="w-4 h-4" />
                      <span className="text-sm">Create</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="border border-border rounded-md p-8 text-center">
          <p className="text-muted-foreground">No images found</p>
        </div>
      )}
    </div>
  );
}
