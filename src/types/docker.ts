import { LucideIcon } from "lucide-react";

export interface DockerContainerInfo {
  ID: string;
  Name: string[];
  Image: string;
  Command: string;
  CreatedAt: number;
  Status: string;
  State: string;
  Ports: Array<{
    IP: string;
    PrivatePort: number;
    PublicPort: number;
    Type: string;
  }>;
}

export interface DockerNetwork {
  IPAddress: string;
  Gateway: string;
  NetworkID: string;
}


export interface DockerImage {
  id: string;
  repo_tags: string[];
  created_at: string;
  size: number;
  arch: string;
  os: string;
  labels: string[];
}

export interface DockerLog {
  timestamp: string;
  stream: 'stdout' | 'stderr';
  message: string;
}

export interface ContainerStats {
  cpu_percentage: number;
  memory_percentage: number;
  memory_usage: number;
  memory_limit: number;
  block_read: number;
  block_write: number;
  network_rx: number;
  network_tx: number;
}

// Only keeping the fields that are actually used in the UI
export interface SystemInfoType {
  os: string;
  arch: string;
  ncpu: number;
  memoryTotal: number;
  dockerVersion: string;
  images: number;
  containers: number;
}
