/** Standard response envelope from the Spring Boot backend: { message, data }. */
export interface ApiResponse<T> {
  message: string;
  data: T;
}
