import { AxiosError } from 'axios';

interface ApiErrorResponse {
  message: string;
}

export const handleApiError = (error: unknown): string => {
  const axiosError = error as AxiosError<ApiErrorResponse>;

  if (axiosError.response) {
    const errorMessage =
      axiosError.response.data?.message || 'An error occurred';
    console.error('API Error:', errorMessage);
    return errorMessage;
  } else {
    console.error('Unexpected Error:', error);
    return 'Network error or server unavailable';
  }
};
