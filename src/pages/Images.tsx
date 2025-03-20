import React, { useState, useEffect } from "react";
import { DockerImage } from "@/types/docker";
import { dockerService } from "@/services/dockerService";
import { HardDrive, Clock, Play, Cpu, SignalZeroIcon, Container } from "lucide-react";
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
              className="border border-border rounded-md h-24 animate-pulse"
            />
          ))}
        </div>
      ) : error ? (
        <div className="border border-red-300 bg-red-50 text-red-700 rounded-md p-4">
          <p>Failed to load images</p>
        </div>
      ) : images.length > 0 ? (
        <div className="space-y-4">
          {images.map((image) => (
            <div 
              key={image.basic_info.image_id}
              className="border border-border rounded-md overflow-hidden"
            >
              <div className="flex justify-between items-center p-2 border-b border-border">
                <div className="flex items-center">
                  <Container className="w-4 h-4 mr-2 text-muted-foreground" />
                  <div>
                    <h3 className="font-bold">
                      {image.basic_info.repo_tags[0] || 'unnamed'}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      ID: {image.basic_info.image_id}
                    </p>
                  </div>
                </div>
                
                <button
                  onClick={() => handleCreateContainer(image.basic_info.image_id)}
                  className="px-3 py-1.5 border border-border rounded-md hover:bg-accent text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
                  title="Create Container"
                >
                  <Play className="w-4 h-4" />
                  <span className="text-sm">Create</span>
                </button>
              </div>

              <div className="p-4 grid grid-cols-3 gap-4">
                <div className="text-sm">
                  <p className="text-xs text-muted-foreground mb-1 flex items-center">
                    <HardDrive className="w-3 h-3 mr-1" />
                    Size
                  </p>
                  <p>{image.basic_info.size}</p>
                </div>
                {image.detail_info && (
                  <div className="text-sm">
                    <p className="text-xs text-muted-foreground mb-1 flex items-center">
                      <Cpu className="w-3 h-3 mr-1" />
                      Platform
                    </p>
                    <p>{image.detail_info.architecture}/{image.detail_info.os}</p>
                  </div>
                )}
                <div className="text-sm">
                  <p className="text-xs text-muted-foreground mb-1 flex items-center">
                    <Clock className="w-3 h-3 mr-1" />
                    Created
                  </p>
                  <p>{image.basic_info.created_at}</p>
                </div>
              </div>

              {image.detail_info?.container_count > 0 && (
                <div className="px-4 pb-4 text-sm text-muted-foreground">
                  {image.detail_info.container_count} containers using this image
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="border border-border rounded-md p-8 text-center">
          <p className="text-muted-foreground">No images found</p>
        </div>
      )}
    </div>
  );
}
