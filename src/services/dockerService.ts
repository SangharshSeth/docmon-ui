
import { DockerContainer, DockerSystem, DockerLog } from '../types/docker';

// This is a mock service - in a real application, this would connect to Docker API
class DockerService {
  async getContainers(): Promise<DockerContainer[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Return mock container data
    return [
      {
        id: "c1d3c2b1a0",
        names: ["web-server"],
        image: "nginx:latest",
        imageID: "sha256:61395b4c586afb",
        command: "nginx -g 'daemon off;'",
        created: Date.now() - 7200000,
        state: "running",
        status: "Up 2 hours",
        ports: [
          { IP: "0.0.0.0", PrivatePort: 80, PublicPort: 8080, Type: "tcp" }
        ],
        labels: {
          "com.example.description": "Web server",
          "com.example.environment": "production"
        },
        hostConfig: {
          networkMode: "bridge"
        },
        networkSettings: {
          networks: {
            bridge: {
              IPAddress: "172.17.0.2",
              Gateway: "172.17.0.1",
              NetworkID: "bridge"
            }
          }
        },
        mounts: [
          {
            Type: "bind",
            Source: "/data/nginx",
            Destination: "/etc/nginx/conf.d",
            Mode: "ro",
            RW: false,
            Propagation: "rprivate"
          }
        ],
        stats: {
          cpu_percentage: 1.5,
          memory_usage: 14500000,
          memory_limit: 1073741824,
          memory_percentage: 1.35,
          network_rx: 1024000,
          network_tx: 2048000,
          block_read: 4096000,
          block_write: 1024000
        }
      },
      {
        id: "a2b3c4d5e6",
        names: ["api-service"],
        image: "node:16",
        imageID: "sha256:7de0a7e86a66f",
        command: "node server.js",
        created: Date.now() - 3600000,
        state: "running",
        status: "Up 1 hour",
        ports: [
          { IP: "0.0.0.0", PrivatePort: 3000, PublicPort: 3000, Type: "tcp" }
        ],
        labels: {
          "com.example.description": "API service",
          "com.example.environment": "development"
        },
        hostConfig: {
          networkMode: "bridge"
        },
        networkSettings: {
          networks: {
            bridge: {
              IPAddress: "172.17.0.3",
              Gateway: "172.17.0.1",
              NetworkID: "bridge"
            }
          }
        },
        mounts: [
          {
            Type: "volume",
            Source: "node_modules",
            Destination: "/app/node_modules",
            Mode: "rw",
            RW: true,
            Propagation: "rprivate"
          }
        ],
        stats: {
          cpu_percentage: 4.2,
          memory_usage: 128000000,
          memory_limit: 1073741824,
          memory_percentage: 11.92,
          network_rx: 512000,
          network_tx: 1024000,
          block_read: 2048000,
          block_write: 512000
        }
      },
      {
        id: "f7e6d5c4b3",
        names: ["database"],
        image: "postgres:14",
        imageID: "sha256:9e33a6f83ff15",
        command: "postgres",
        created: Date.now() - 86400000,
        state: "running",
        status: "Up 1 day",
        ports: [
          { IP: "0.0.0.0", PrivatePort: 5432, PublicPort: 5432, Type: "tcp" }
        ],
        labels: {
          "com.example.description": "Database",
          "com.example.environment": "production"
        },
        hostConfig: {
          networkMode: "bridge"
        },
        networkSettings: {
          networks: {
            bridge: {
              IPAddress: "172.17.0.4",
              Gateway: "172.17.0.1",
              NetworkID: "bridge"
            }
          }
        },
        mounts: [
          {
            Type: "volume",
            Source: "pg_data",
            Destination: "/var/lib/postgresql/data",
            Mode: "rw",
            RW: true,
            Propagation: "rprivate"
          }
        ],
        stats: {
          cpu_percentage: 2.8,
          memory_usage: 256000000,
          memory_limit: 1073741824,
          memory_percentage: 23.84,
          network_rx: 256000,
          network_tx: 512000,
          block_read: 10240000,
          block_write: 5120000
        }
      },
      {
        id: "i8h7g6f5e4",
        names: ["cache"],
        image: "redis:alpine",
        imageID: "sha256:2d3124239ae2b",
        command: "redis-server",
        created: Date.now() - 43200000,
        state: "exited",
        status: "Exited (137) 3 hours ago",
        ports: [
          { IP: "0.0.0.0", PrivatePort: 6379, PublicPort: 6379, Type: "tcp" }
        ],
        labels: {
          "com.example.description": "Cache",
          "com.example.environment": "production"
        },
        hostConfig: {
          networkMode: "bridge"
        },
        networkSettings: {
          networks: {
            bridge: {
              IPAddress: "",
              Gateway: "",
              NetworkID: "bridge"
            }
          }
        },
        mounts: [
          {
            Type: "volume",
            Source: "redis_data",
            Destination: "/data",
            Mode: "rw",
            RW: true,
            Propagation: "rprivate"
          }
        ]
      }
    ];
  }

  async getSystemInfo(): Promise<DockerSystem> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 600));
    
    // Return mock system data
    return {
      containers: 4,
      containersRunning: 3,
      containersPaused: 0,
      containersStopped: 1,
      images: 12,
      memTotal: 8589934592, // 8 GB
      memFree: 4294967296, // 4 GB
      cpus: 4,
      serverVersion: "20.10.16",
      engineVersion: "20.10.16"
    };
  }

  async getContainerLogs(containerId: string): Promise<DockerLog[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 700));
    
    // Return mock log data
    const logs: DockerLog[] = [];
    
    // Generate some fake logs based on container ID
    const baseTimestamp = new Date();
    baseTimestamp.setMinutes(baseTimestamp.getMinutes() - 30);
    
    for (let i = 0; i < 20; i++) {
      const logTimestamp = new Date(baseTimestamp);
      logTimestamp.setMinutes(logTimestamp.getMinutes() + i);
      
      const isError = Math.random() > 0.8;
      
      logs.push({
        timestamp: logTimestamp.toISOString(),
        stream: isError ? "stderr" : "stdout",
        message: isError
          ? `Error in container ${containerId.substring(0, 6)}: connection refused`
          : `Container ${containerId.substring(0, 6)} processed request successfully`
      });
    }
    
    return logs;
  }

  async startContainer(containerId: string): Promise<boolean> {
    console.log(`Starting container: ${containerId}`);
    await new Promise(resolve => setTimeout(resolve, 1000));
    return true;
  }

  async stopContainer(containerId: string): Promise<boolean> {
    console.log(`Stopping container: ${containerId}`);
    await new Promise(resolve => setTimeout(resolve, 1000));
    return true;
  }

  async restartContainer(containerId: string): Promise<boolean> {
    console.log(`Restarting container: ${containerId}`);
    await new Promise(resolve => setTimeout(resolve, 1500));
    return true;
  }
}

export const dockerService = new DockerService();
