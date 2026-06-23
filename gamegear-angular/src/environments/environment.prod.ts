/**
 * Production environment configuration.
 * apiBaseUrl is relative: the frontend's nginx reverse-proxies /api to the
 * backend container, so the browser talks to the same origin (works under HTTPS,
 * no CORS). stripePublishableKey is safe to ship to the client.
 */
export const environment = {
  production: true,
  apiBaseUrl: '/api/v1',
  stripePublishableKey: 'pk_test_51RCzewCMF0ubnu4N7OX0rWANBXFjEvSAeCFAyjLjMaQTQSy7IoKA7NVCAb4NbVN2OKdfuFKSYVf9e6vYscJtDXtT00XZEOpMH0',
};
