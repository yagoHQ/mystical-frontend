// src/api/environment.api.ts

import { handleApiError } from './handleApiError';
import apiClient from './interceptors';

export interface Environment {
  id: string;
  title: string;
  location: string;
  isEditable: boolean;
  originPosition: [number, number, number];
  originRotation: [number, number, number];
  scannedBy: {
    id: string;
    name: string;
    email: string;
  };
  scannedDate: string;
  scans: Scan[];
  createdAt: string;
  markings?: ApiMarking[]; // Add the optional 'markings' property
}

export interface Scan {
  scanName: string;
  images: string[];
  id: string;
  fileUrl: string;
  isEditable: boolean;
  position: [number, number, number];
  rotation: [number, number, number];
  scale: [number, number, number];
  textures: string[];
}

export interface Marking {
  id: string;
  label: string;
  position: [number, number, number];
  remark?: string;
  createdAt: string;
  x?: number;
  y?: number;
  z?: number;
  url?: string;
}
export interface ApiMarking {
  id: string;
  environmentId: string;
  createdById: string;
  x: number;
  y: number;
  z: number;
  url: string;
  metadata: string;
  remark: string;
  createdAt?: string;
  createdBy?: {
    id: string;
    email: string;
    name: string | null;
    role: string;
  };
  comments?: any[];
}

// Structure for adding a new marking
export interface AddMarkingRequest {
  environmentId: string;
  createdById: string;
  x: number;
  y: number;
  z: number;
  remark: string;
  metadata: string;
  url: string;
}

/**
 * Fetch all environments from the server.
 */
export async function getEnvironments(): Promise<Environment[]> {
  try {
    const { data } = await apiClient.get<Environment[]>('/api/environments');
    return data;
  } catch (err) {
    const message = handleApiError(err);
    throw new Error(message);
  }
}

export async function updateEnvironment(
  environment: Environment
): Promise<Environment> {
  try {
    const { data } = await apiClient.post<Environment>(
      `/api/environments/updateScans`,
      environment
    );
    return data;
  } catch (err) {
    const message = handleApiError(err);
    throw new Error(message);
  }
}

export async function getEnvironmentById(id: string): Promise<Environment> {
  try {
    const { data } = await apiClient.get<Environment>(
      `/api/environments/${id}`
    );
    return data;
  } catch (err) {
    const message = handleApiError(err);
    throw new Error(message);
  }
}

export async function addMarkingToEnvironment(
  marking: AddMarkingRequest
): Promise<ApiMarking> {
  try {
    const { data } = await apiClient.post<ApiMarking>(
      '/api/environments/addMarking',
      marking
    );
    return data;
  } catch (err) {
    const message = handleApiError(err);
    throw new Error(message);
  }
}

export function convertApiMarkingsToComponentFormat(
  apiMarkings: ApiMarking[]
): Marking[] {
  return apiMarkings.map((mark) => ({
    id: mark.id,
    label: mark.remark || 'Unnamed Marking',
    position: [mark.x, mark.y, mark.z] as [number, number, number],
    url: mark.url || '', // Include URL if available
    createdAt: mark.createdAt || '',
  }));
}

export function deleteMarking(markingId: string): Promise<void> {
  return apiClient
    .delete(`/api/environments/deleteMarking/${markingId}`)
    .then(() => {
      console.log('Marking deleted successfully');
    })
    .catch((err) => {
      const message = handleApiError(err);
      throw new Error(message);
    });
}

export async function getDashboardData(): Promise<{
  areaScanned: number;
  totalUsers: number;
  totalMarkings: number;
  totalSuggestions: number;
  recentAreas: {
    id: string;
    title: string;
    location: string;
    createdAt: string;
  }[];
  recentSuggestions: {
    id: string;
    markingId: string;
    createdAt: string;
  }[];
  recentMarkings: {
    id: string;
    createdAt: string;
    remark: string;
    environmentId: string;
    environmentTitle: string;
  }[];
}> {
  try {
    const { data } = await apiClient.get('/api/environments/dashboard/getData');
    return data;
  } catch (err) {
    const message = handleApiError(err);
    throw new Error(message);
  }
}

export const addOriginToEnvironment = async (
  environmentId: string,
  originPosition: [number, number, number],
  originRotation: [number, number, number]
): Promise<Environment> => {
  try {
    const payload = {
      environmentId,
      positionX: originPosition[0].toString(),
      positionY: originPosition[1].toString(),
      positionZ: originPosition[2].toString(),
      rotationX: originRotation[0].toString(),
      rotationY: originRotation[1].toString(),
      rotationZ: originRotation[2].toString(),
    };

    const { data } = await apiClient.post<Environment>(
      '/api/environments/origin',
      payload,
      {
        headers: { 'Content-Type': 'application/json' },
      }
    );

    return data;
  } catch (err: any) {
    const message = handleApiError(err);
    throw new Error(message);
  }
};

export const deleteEnvironment = async (id: string): Promise<void> => {
  try {
    await apiClient.delete(`/api/environments/delete/${id}`);
  } catch (err: any) {
    const message = handleApiError(err);
    throw new Error(message);
  }
};

export const deleteScan = async (id: string): Promise<void> => {
  try {
    await apiClient.delete(`/api/scans/delete/${id}`);
  } catch (err: any) {
    const message = handleApiError(err);
    throw new Error(message);
  }
};
