import { DockerContainerInfo, DockerImage, DockerLog } from "@/types/docker";
import { SystemInfoType } from "@/types/docker";

// Mock data for system info
const mockSystemInfo: SystemInfoType = {
  os: "Ubuntu 20.04",
  arch: "x86_64",
  ncpu: 8,
  memoryTotal: 16,
  dockerVersion: "20.10.7",
  images: 4,
  containers: 1
};

// Mock container stats
const mockContainerStats = {
  cpu_percentage: 15,
  memory_percentage: 25,
  memory_usage: 128 * 1024 * 1024, // 128MB
  memory_limit: 512 * 1024 * 1024, // 512MB
  block_read: 1024 * 1024, // 1MB
  block_write: 2048 * 1024, // 2MB
  network_rx: 512 * 1024, // 512KB
  network_tx: 256 * 1024, // 256KB
};

// Mock container logs
const mockLogs: DockerLog[] = [
  {
    timestamp: new Date(Date.now() - 5000).toISOString(),
    stream: "stdout",
    message: "Server started successfully"
  },
  {
    timestamp: new Date(Date.now() - 4000).toISOString(),
    stream: "stdout",
    message: "Listening on port 3000"
  },
  {
    timestamp: new Date(Date.now() - 3000).toISOString(),
    stream: "stderr",
    message: "Warning: Memory usage above 75%"
  }
];

export const dockerService = {
  getContainersSnapshot: async (): Promise<DockerContainerInfo[]> => {
    const data = await fetch("http://localhost:8082/api/containers-snapshot");
    return await data.json();

  },

  getSystemInfo: async (): Promise<SystemInfoType> => {
    // Simulate API call
    return await new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockSystemInfo);
      }, 100);
    });
  },

  refreshSystemInfo: async () => {
    // In a real app, this would re-fetch from the API
    // For now, it's just a simulation
    console.log("Refreshing system info data");
    return await new Promise((resolve) =>
      setTimeout(() => {
        resolve(mockSystemInfo);
      }, 500),
    );
  },

  getImages: async (): Promise<DockerImage[]> => {
    const response = await fetch("http://localhost:8082/api/images");
    return await response.json();
  },

  // Container actions (mocked)
  startContainer: async (id: string): Promise<void> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(`Starting container ${id}`);
        resolve();
      }, 1000);
    });
  },

  stopContainer: async (id: string): Promise<void> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(`Stopping container ${id}`);
        resolve();
      }, 1000);
    });
  },

  restartContainer: async (id: string): Promise<void> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(`Restarting container ${id}`);
        resolve();
      }, 1500);
    });
  },

  getContainerStats: async (id: string) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockContainerStats);
      }, 500);
    });
  },

  getContainerLogs: async (id: string): Promise<DockerLog[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockLogs);
      }, 500);
    });
  }
};
