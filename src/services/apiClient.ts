import { apiClient as realApiClient } from "../api/client";

// Database seeding engine (retained as local backup seed initialiser)
export function initializeSeedData() {
  const isSeeded = localStorage.getItem("shivil_seeded") === "true";
  if (isSeeded) return;
  localStorage.setItem("shivil_seeded", "true");
}

initializeSeedData();

// Generic API Query wrapper mapping to active Express backend endpoints
export const apiClient = {
  get: async <T>(key: string): Promise<T> => {
    const res = await realApiClient.get(`/${key}`);
    // Unwrap the standard backend response envelope
    if (res.data && res.data.success && res.data.data !== undefined) {
      return res.data.data as T;
    }
    return res.data as T;
  },

  post: async <T>(key: string, record: any): Promise<T> => {
    const res = await realApiClient.post(`/${key}`, record);
    if (res.data && res.data.success && res.data.data !== undefined) {
      return res.data.data as T;
    }
    return res.data as T;
  },

  put: async <T>(key: string, id: number, record: any): Promise<T> => {
    const res = await realApiClient.put(`/${key}/${id}`, record);
    if (res.data && res.data.success && res.data.data !== undefined) {
      return res.data.data as T;
    }
    return res.data as T;
  },

  delete: async (key: string, id: number): Promise<boolean> => {
    const res = await realApiClient.delete(`/${key}/${id}`);
    return res.data?.success || false;
  }
};
