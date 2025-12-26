// Generic API response type
export interface ApiResponse<T> {
  success: boolean;
  data: T;
}

// Sample User type for demo components
export interface User {
  id: number;
  name: string;
  email: string;
}
