import { handleApiError } from './handleApiError';
import apiClient from './interceptors';

interface ApiMarking {
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

export async function getMarkingById(id: string): Promise<ApiMarking> {
  try {
    const { data } = await apiClient.get<ApiMarking>(
      `/api/environments/markings/${id}`
    );
    return data;
  } catch (err) {
    const message = handleApiError(err);
    throw new Error(message);
  }
}

export async function deleteComment(commentId: string): Promise<void> {
  try {
    await apiClient.delete(`/api/comments/${commentId}`);
  } catch (err) {
    const message = handleApiError(err);
    throw new Error(message);
  }
}
