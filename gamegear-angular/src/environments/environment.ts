/**
 * App environment configuration.
 * - apiBaseUrl: the Spring Boot backend (running offline on H2, CORS allows http://localhost:*).
 * - stripePublishableKey: leave empty offline; Checkout degrades gracefully when absent.
 */
export const environment = {
  production: false,
  apiBaseUrl: 'http://localhost:8081/api/v1',
  // Backend image bytes are served at {apiBaseUrl}/images/image/download/{imageId}
  stripePublishableKey: 'pk_test_51RCzewCMF0ubnu4N7OX0rWANBXFjEvSAeCFAyjLjMaQTQSy7IoKA7NVCAb4NbVN2OKdfuFKSYVf9e6vYscJtDXtT00XZEOpMH0',
};
