import { LucideIcon } from "lucide-react";

export interface DockerContainerInfo {
  id: string;
  names: string;  // Changed from string[] to string
  image: string;
  status: string;
  created_at: string;  // Changed from created to created_at
  ports: Array<{
    private_port: string;
    public_port: string;
    protocol: string;
    host_ip: string;
  }>;
  restart_policy: string;
  health_status?: string;
  memory_usage: number;
  memory_limit: number;
  state?: string;
  command?: string;
  labels?: Record<string, string>;
  networkSettings?: {
    networks: Record<string, DockerNetwork>;
  };
}

export interface DockerNetwork {
  IPAddress: string;
  Gateway: string;
  NetworkID: string;
}

export interface DockerImageBasicInfo {
  image_id: string;
  repo_tags: string[];
  size: string;
  created_at: string;
}

export interface DockerImageDetailInfo {
  parent_id?: string;
  repo_digests?: string[];
  architecture?: string;
  os?: string;
  labels?: Record<string, string>;
  exposed_ports?: Record<string, Record<string, string>>; // Properly typed as a record of port to config
  container_count: number;
}

export interface DockerImage {
  basic_info: DockerImageBasicInfo;
  detail_info?: DockerImageDetailInfo;
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
