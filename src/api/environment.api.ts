// src/api/environment.api.ts

import { handleApiError } from './handleApiError';
import apiClient from './interceptors';

export interface Environment {
  id: string;
  title: string;
  location: string;
  scannedBy: {
    id: string;
    name: string;
    email: string;
  };
  scannedDate: string;
  scans: [];
  createdAt: string;
  markings?: ApiMarking[]; // Add the optional 'markings' property
}

export interface Marking {
  id: string;
  label: string;
  position: [number, number, number];
  remark?: string;
  x?: number;
  y?: number;
  z?: number;
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
  }));
}
