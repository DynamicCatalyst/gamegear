# GameGear Spring Boot Backend Analysis

## Project Overview
- **Name**: GameGear
- **Description**: E-commerce application for gaming gear
- **Technology Stack**: Spring Boot 3.5.5, Java 21, MySQL, JWT Authentication
- **Build Tool**: Maven
- **Architecture**: Layered architecture (Controller → Service → Repository → Database)

---

## Tech Stack & Dependencies

### Core Framework
- **Spring Boot 3.5.5** - Latest LTS with modern Java features
- **Java 21** - Latest long-term support version
- **Maven** - Dependency management and build automation

### Data & Database
- **Spring Data JPA** - ORM abstraction layer
- **Hibernate** - JPA implementation with MySQL dialect
- **MySQL Connector** - Database driver
- **Database**: AWS RDS MySQL (gamegeardb.cp26c4guc2su.ap-south-1.rds.amazonaws.com)

### Security
- **Spring Security** - Authentication and authorization
- **JWT (JSON Web Tokens)** - JJWT 0.11.1 for stateless authentication
- **BCryptPasswordEncoder** - Password encryption
- **CORS Configuration** - Cross-origin request handling

### Payment Integration
- **Stripe Java 30.0.0** - Payment processing

### Utilities
- **ModelMapper 3.2.4** - DTO mapping and object conversion
- **Lombok 1.18.38** - Code generation for getters, setters, constructors
- **Spring Boot Validation** - Input validation via annotations

---

## Project Structure

```
src/main/java/com/gamegear/gamegear/
├── controller/           # REST API endpoints
│   ├── AuthController
│   ├── ProductController
│   ├── CartController
│   ├── OrderController
│   ├── UserController
│   ├── CategoryController
│   ├── ImageController
│   ├── CartItemController
│   └── AddressController
├── model/               # JPA entities
│   ├── User
│   ├── Product
│   ├── Order
│   ├── OrderItem
│   ├── Cart
│   ├── CartItem
│   ├── Category
│   ├── Image
│   ├── Address
│   └── Role
├── service/             # Business logic
│   ├── product/         # ProductService (IProductService)
│   ├── order/
│   ├── cart/
│   ├── category/
│   ├── user/
│   ├── address/
│   └── image/
├── repository/          # Data access (Spring Data JPA)
├── security/            # Security configuration
│   ├── config/          # ggconfig, ggconfigCors
│   ├── jwt/             # JwtUtils, AuthTokenFilter, JwtEntryPoint
│   └── user/            # ShopUserDetailsService
├── dtos/                # Data Transfer Objects
├── request/             # Request payload classes
├── response/            # Response payload classes (ApiResponse)
├── enums/               # OrderStatus and other enums
├── exceptions/          # Custom exceptions
└── utils/               # Helper utilities (CookieUtils, etc.)
```

---

## Key Features & Entities

### 1. Authentication & Authorization
- **JWT-based stateless authentication**
  - Access token (5 minutes expiration - 300000ms)
  - Refresh token (30 days expiration - 2592000000ms)
  - Tokens stored in HTTP-only cookies
- **Role-based access control (RBAC)**
  - ROLE_ADMIN - Can create, update, delete products
  - ROLE_USER - Can browse, purchase, manage cart
- **User Endpoints**: `/api/v1/auth/login`, `/api/v1/auth/refresh-token`

### 2. Product Management
- **Full CRUD operations** (Admin-only for create/update/delete)
- **Search Capabilities**:
  - By product ID
  - By name
  - By brand
  - By category
  - By category + brand combination
  - By brand + name combination
  - Distinct products by name
  - Distinct brands list
- **Product Attributes**: name, brand, price (BigDecimal), inventory, description, images
- **Related Entities**: Category (Many-to-One), Images (One-to-Many)

### 3. Shopping Cart
- **User-specific carts** (One-to-One relationship with User)
- **Cart items management** - Add, remove, update quantities
- **Secured endpoints** - Requires authentication
- **Cart calculations** - Total amount computation

### 4. Order Management
- **Order placement** from cart items
- **Order status tracking**: Enum-based (OrderStatus)
- **Order items** - Immutable reference to products at purchase time
- **Order attributes**: orderDate, totalAmount, orderStatus, user reference
- **Secured endpoints** - Requires authentication

### 5. User Management
- **Registration & Login**
- **User profiles**: firstName, lastName, email (unique natural ID), password
- **Relationships**: Cart (1-to-1), Orders (1-to-many), Addresses (1-to-many), Roles (many-to-many)
- **Email as unique identifier** with @NaturalId annotation

### 6. Address Management
- **User addresses** (One-to-Many)
- **Billing/Shipping addresses** for orders

### 7. Images Management
- **Product images** (One-to-Many per product)
- **File upload support** (5MB max)
- **DTO mapping** for API responses

### 8. Payment Integration
- **Stripe integration** (v30.0.0)
- **API Key stored** in application.properties (sk_test_* - test mode)

---

## Database Schema Overview

### Key Tables
- **users** - User accounts with roles
- **user_roles** - Many-to-many junction table
- **products** - Product catalog
- **categories** - Product categories
- **images** - Product images
- **carts** - User shopping carts
- **cart_items** - Cart line items
- **orders** - Customer orders
- **order_items** - Order line items
- **addresses** - User addresses

### Relationships
- User ↔ Cart (1:1)
- User ↔ Orders (1:many)
- User ↔ Addresses (1:many)
- User ↔ Roles (many:many)
- Product ↔ Category (many:1)
- Product ↔ Images (1:many)
- Cart ↔ CartItems (1:many)
- Order ↔ OrderItems (1:many)

---

## Security Configuration

### Authentication Flow
1. User logs in with email/password (LoginRequest)
2. AuthenticationManager validates credentials
3. JwtUtils generates access token + refresh token
4. Refresh token stored in HTTP-only cookie
5. Access token returned in response body
6. Refresh endpoint allows token renewal without re-login

### Protected Routes
```
/api/v1/carts/**        - Authenticated
/api/v1/cartItems/**    - Authenticated
/api/v1/orders/**       - Authenticated
```

### CORS Configuration
**Allowed Origins**:
- http://localhost:5174 (local dev)
- http://gamegeardotcom.s3-website.ap-south-1.amazonaws.com (AWS S3)
- https://gamegear.one (production)
- https://www.gamegear.one (production)

**Allowed Methods**: GET, POST, PUT, DELETE, OPTIONS
**Credentials**: Enabled for cookie-based auth

### Endpoint Security
- **@PreAuthorize("hasRole('ROLE_ADMIN')")** - Admin-only endpoints
- Admin-protected endpoints:
  - POST /api/v1/products/add
  - PUT /api/v1/products/{productId}/update
  - DELETE /api/v1/products/{productId}/delete

---

## API Structure

### Response Format
All endpoints return `ApiResponse` wrapper:
```json
{
  "message": "Retrieved successfully!",
  "data": { /* actual response */ }
}
```

### Request/Response DTOs
- **ProductDto** - Product representation with nested images
- **ImageDto** - Image file metadata
- **AddProductRequest** - Create product payload
- **ProductUpdateRequest** - Update product payload
- **LoginRequest** - Authentication payload
- **OrderItemDto** - Order line item representation

---

## Configuration Properties

### Server
- **Port**: 5000
- **Multipart Max Request Size**: 5MB
- **Multipart Max File Size**: 5MB

### Database
- **URL**: AWS RDS MySQL endpoint
- **Driver**: MySQL JDBC Connector
- **Dialect**: MySQL8Dialect
- **DDL Auto**: update (auto-migration enabled)
- **Show SQL**: true (logging enabled)

### Authentication
- **JWT Secret**: 32-character hex string (properly configured)
- **Access Token Expiration**: 5 minutes
- **Refresh Token Expiration**: 30 days
- **Use Secure Cookie**: false (development mode)

### API
- **API Prefix**: `/api/v1`

---

## Code Quality Observations

### Strengths
✅ **Clean Architecture** - Clear separation of concerns (controller/service/repository)
✅ **Security-First** - JWT auth, password encryption, role-based access
✅ **ORM Best Practices** - Spring Data JPA with proper entity relationships
✅ **DTO Pattern** - DTOs for API contracts, preventing entity exposure
✅ **Lombok Integration** - Reduced boilerplate code
✅ **Exception Handling** - Custom exceptions (EntityNotFoundException, EntityExistsException)
✅ **Validation** - Spring validation framework integrated
✅ **Database Best Practices** - Cascade policies, orphan removal configured

### Areas for Improvement

#### 1. **ProductService - N+1 Query Problem**
- `convertToDto()` loads images for each product individually
- Solution: Use JOIN FETCH in repository or batch processing

#### 2. **Error Handling Consistency**
- Controllers lack try-catch blocks; exceptions propagate to global handler
- Global exception handler should be created for consistent error responses

#### 3. **Logging**
- No logging framework (SLF4J/Logback) observed
- Add structured logging for debugging and monitoring

#### 4. **API Response Inconsistency**
- Some endpoints return wrapped data, others might return raw responses
- Standardize all responses

#### 5. **Configuration Management**
- Sensitive data in application.properties (Stripe key, DB password)
- Use environment variables or Spring Cloud Config

#### 6. **Request Validation**
- Input validation missing on request DTOs (@NotNull, @NotBlank, etc.)
- Add Bean Validation annotations

#### 7. **Pagination**
- No pagination support on list endpoints
- Implement Page<T> for large datasets

#### 8. **Transaction Management**
- No explicit @Transactional annotations observed
- Add for complex multi-entity operations

#### 9. **Testing**
- No test implementation visible
- Add unit tests and integration tests

#### 10. **Naming Conventions**
- Config classes named `ggconfig` (lowercase) - should follow PascalCase
- Repository injection uses lowercase variable names

---

## API Endpoints Summary

### Authentication
- `POST /api/v1/auth/login` - Login (public)
- `POST /api/v1/auth/refresh-token` - Refresh access token (public)

### Products
- `GET /api/v1/products/all` - Get all products
- `GET /api/v1/products/product/{id}/product` - Get product by ID
- `POST /api/v1/products/add` - Create product (ADMIN)
- `PUT /api/v1/products/product/{id}/update` - Update product (ADMIN)
- `DELETE /api/v1/products/product/{id}/delete` - Delete product (ADMIN)
- `GET /api/v1/products/products/by/brand-and-name` - Search by brand & name
- `GET /api/v1/products/products/by/category-and-brand` - Search by category & brand
- `GET /api/v1/products/products/{name}/products` - Search by name
- `GET /api/v1/products/product/by-brand` - Get by brand
- `GET /api/v1/products/product/{category}/all/products` - Get by category
- `GET /api/v1/products/distinct/products` - Get distinct products
- `GET /api/v1/products/distinct/brands` - Get all brands

### Cart (Authenticated)
- `/api/v1/carts/**` - Cart management endpoints

### Orders (Authenticated)
- `/api/v1/orders/**` - Order management endpoints

### Additional Controllers
- User management
- Category management
- Image management
- Address management

---

## Deployment Infrastructure

### Database
- **Hosted on**: AWS RDS (MySQL)
- **Region**: ap-south-1 (Mumbai)
- **Connection**: Remote via JDBC

### Frontend CDN
- **Primary**: gamegear.one (HTTPS)
- **Alternative**: www.gamegear.one

### Environment
- **Development**: Local (port 5174 for frontend)
- **Production**: AWS hosted with S3 CDN option

---

## Recommended Next Steps

1. **Add Global Exception Handler** - Centralize error handling
2. **Implement Logging** - Use SLF4J for structured logging
3. **Secure Configuration** - Move secrets to environment variables
4. **Add Request Validation** - Use @Valid with constraint annotations
5. **Optimize Queries** - Use JOIN FETCH to prevent N+1 queries
6. **Add Pagination** - Support large product lists
7. **Implement Testing** - Unit + integration test coverage
8. **Add API Documentation** - Implement Swagger/OpenAPI
9. **Transaction Management** - Add @Transactional where needed
10. **Code Style** - Fix naming convention issues (ggconfig → GgConfig)

---

## Summary
GameGear is a well-structured e-commerce backend with modern Spring Boot practices. It implements JWT authentication, role-based access control, and follows layered architecture patterns. The codebase has a solid foundation but could benefit from improved error handling, logging, configuration management, and query optimization.
