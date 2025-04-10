import React from 'react';
import { LucideIcon } from 'lucide-react';

interface ResourceCardProps {
  icon: LucideIcon;  // Lucide icon component
  title: string;     // Card title
  value?: string;    // Optional value to display
  isLoading?: boolean; // Loading state
}

/**
 * A reusable card component for displaying resource usage information
 * @param icon - Lucide icon component to display
 * @param title - Card title
 * @param value - Optional value to display (defaults to "Coming soon")
 * @param isLoading - Whether the card is in loading state
 */
const ResourceCard: React.FC<ResourceCardProps> = ({ 
  icon: Icon, 
  title, 
  value, 
  isLoading = false 
}) => (
  <div className="border border-border bg-card rounded-md p-4 transition-colors hover:bg-accent/50">
    {/* Header section with icon and title */}
    <div className="flex items-center space-x-2 mb-2">
      <Icon className="w-4 h-4 text-chart-1" />
      <h3 className="text-sm font-medium text-card-foreground">{title}</h3>
    </div>

    {/* Content section */}
    <div className="h-32 flex items-center justify-center">
      {isLoading ? (
        <div className="w-full">
          <div className="h-4 bg-muted rounded animate-pulse w-24 mx-auto" />
        </div>
      ) : (
        <span className="text-muted-foreground">
          {value || "Coming soon"}
        </span>
      )}
    </div>
  </div>
);

export default ResourceCard;