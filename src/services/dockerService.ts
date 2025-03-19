import { ContainerType, SystemInfoType } from "@/types";

// Mock data for containers
const mockContainers: ContainerType[] = [
  {
    id: "1",
    names: ["/web-app"],
    image: "nginx:latest",
    state: "running",
    status: "Up 2 minutes",
    ports: [{PrivatePort: 80, PublicPort: 8080, Type: "tcp"}],
    created: new Date().toISOString(),
  },
  {
    id: "2",
    names: ["/db"],
    image: "postgres:13",
    state: "running",
    status: "Up 1 hour",
    ports: [{PrivatePort: 5432, Type: "tcp"}],
    created: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: "3",
    names: ["/redis"],
    image: "redis:latest",
    state: "exited",
    status: "Exited (0) 5 minutes ago",
    ports: [{PrivatePort: 6379, Type: "tcp"}],
    created: new Date(Date.now() - 300000).toISOString(),
  },
];

// Mock data for system info
const mockSystemInfo: SystemInfoType = {
  os: "Ubuntu 20.04",
  arch: "x86_64",
  ncpu: 8,
  memoryTotal: 16,
  dockerVersion: "20.10.7",
};

export const dockerService = {
  getContainers: async (): Promise<ContainerType[]> => {
    // Simulate API call
    return await new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockContainers);
      }, 500);
    });
  },

  getContainerById: async (id: string): Promise<ContainerType | undefined> => {
    // Simulate API call
    return await new Promise((resolve) => {
      setTimeout(() => {
        const container = mockContainers.find((c) => c.id === id);
        resolve(container);
      }, 500);
    });
  },

  getSystemInfo: async (): Promise<SystemInfoType> => {
    // Simulate API call
    return await new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockSystemInfo);
      }, 500);
    });
  },
  
  // Add these refresh methods
  refreshContainers: async () => {
    // In a real app, this would re-fetch from the API
    // For now, it's just a simulation
    console.log("Refreshing containers data");
    return await new Promise(resolve => setTimeout(() => {
      resolve(mockContainers);
    }, 500));
  },
  
  refreshSystemInfo: async () => {
    // In a real app, this would re-fetch from the API
    // For now, it's just a simulation
    console.log("Refreshing system info data");
    return await new Promise(resolve => setTimeout(() => {
      resolve(mockSystemInfo);
    }, 500));
  }
};
