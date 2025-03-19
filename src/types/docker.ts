
export interface DockerContainer {
  id: string;
  names: string[];
  image: string;
  imageID: string;
  command: string;
  created: number;
  state: "running" | "exited" | "paused" | "restarting" | "created";
  status: string;
  ports: DockerPort[];
  labels: Record<string, string>;
  sizeRw?: number;
  sizeRootFs?: number;
  hostConfig: {
    networkMode: string;
  };
  networkSettings: {
    networks: Record<string, DockerNetwork>;
  };
  mounts: DockerMount[];
  stats?: DockerStats;
}

export interface DockerPort {
  IP?: string;
  PrivatePort: number;
  PublicPort?: number;
  Type: string;
}

export interface DockerNetwork {
  IPAddress: string;
  Gateway: string;
  NetworkID: string;
}

export interface DockerMount {
  Type: string;
  Source: string;
  Destination: string;
  Mode: string;
  RW: boolean;
  Propagation: string;
}

export interface DockerStats {
  cpu_percentage: number;
  memory_usage: number;
  memory_limit: number;
  memory_percentage: number;
  network_rx: number;
  network_tx: number;
  block_read: number;
  block_write: number;
}

export interface DockerSystem {
  containers: number;
  containersRunning: number;
  containersPaused: number;
  containersStopped: number;
  images: number;
  memTotal: number;
  memFree: number;
  cpus: number;
  serverVersion: string;
  engineVersion: string;
}

export interface DockerLog {
  timestamp: string;
  stream: "stdout" | "stderr";
  message: string;
}
