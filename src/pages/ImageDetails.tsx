import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DockerImage } from "@/types/docker";
import { dockerService } from "@/services/dockerService";
import { Container, HardDrive, Cpu, Clock, Tag, ArrowLeft } from "lucide-react";

export default function ImageDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [image, setImage] = useState<DockerImage | null>(null);

  useEffect(() => {
    const fetchImageDetails = async () => {
      try {
        setLoading(true);
        const images = await dockerService.getImages();
        const foundImage = images.find(img => img.id === id);
        
        if (!foundImage) {
          setError("Image not found");
          return;
        }

        setImage(foundImage);
      } catch (err) {
        setError("Failed to fetch image details");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchImageDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="animate-fade-in">
        <div className="mb-6">
          <div className="h-6 w-32 bg-accent/50 animate-pulse mb-2" />
          <div className="h-4 w-48 bg-accent/50 animate-pulse" />
        </div>
        <div className="border border-border">
          <div className="h-12 bg-accent/50 animate-pulse" />
          <div className="h-48 bg-accent/50 animate-pulse opacity-50" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="border border-red-300 bg-red-50 text-red-700 p-4">
        <p>{error}</p>
      </div>
    );
  }

  if (!image) {
    return null;
  }

  return (
    <div className="animate-fade-in">
      <button 
        onClick={() => navigate(-1)}
        className="mb-4 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Images
      </button>

      <div className="mb-6">
        <h2 className="text-lg font-bold">Image Details</h2>
        <p className="text-sm text-muted-foreground">Detailed information about the Docker image</p>
      </div>

      <div className="border border-border">
        {/* Header Section */}
        <div className="border-b border-border bg-accent/50 px-4 py-3">
          <div className="flex items-center gap-2">
            <Container className="w-4 h-4" />
            <span>{image.repo_tags.length > 0 ? image.repo_tags.join(", ") : "<none>"}</span>
          </div>
          <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
            <Tag className="w-4 h-4" />
            {image.id}
          </div>
        </div>

        {/* Details Section */}
        <div className="px-4 py-3">
          <div className="grid grid-cols-2 gap-y-4">
            <div>
              <div className="text-sm font-medium text-muted-foreground mb-1">Platform</div>
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4" />
                {image.arch}/{image.os}
              </div>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground mb-1">Size</div>
              <div className="flex items-center gap-2">
                <HardDrive className="w-4 h-4" />
                {typeof image.size === 'string' ? image.size : `${(image.size / (1024 * 1024)).toFixed(2)} MB`}
              </div>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground mb-1">Created</div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                {new Date(image.created_at).toLocaleString()}
              </div>
            </div>
          </div>

          {/* Labels Section */}
          {image.labels && image.labels.length > 0 && (
            <div className="mt-4 pt-4 border-t border-border">
              <div className="text-sm font-medium text-muted-foreground mb-3">Labels</div>
              <div className="space-y-2">
                {image.labels.map((label, index) => (
                  <div key={index} className="text-sm">
                    {label}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 