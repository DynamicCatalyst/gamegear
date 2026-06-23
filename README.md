# 🎮 GameGear – Java Full Stack E‑commerce (Spring Boot, Spring AI, Stripe)

GameGear is a full‑stack e‑commerce platform with a **Spring Boot** backend and an **Angular** frontend, backed by **PostgreSQL** and runnable end‑to‑end with a single `docker compose` command. It covers secure APIs, Stripe payments, AI‑powered image search, and JWT‑based authentication with role‑based access.

---

## 🧩 Project Overview

### Backend

- **Framework:** Spring Boot 3 (Java 21)
- **Layers:**
  - **Controller layer** – `controller/*` (e.g. `ProductController`, `AuthController`, `OrderController`, `CartController`)
  - **Service layer** – `service/*` (business logic, image similarity, AI, Stripe payment orchestration)
  - **Repository layer** – `repository/*` (Spring Data JPA over PostgreSQL)
  - **Domain model** – `model/*` (User, Role, Product, Category, Cart, Order, Image, etc.)
  - **DTOs / Requests / Responses** – `dtos/*`, `request/*`, `response/*` (API contracts)
- **Security:**
  - Spring Security with **JWT** (access + refresh tokens)
  - Role‑based authorization (`ROLE_USER`, `ROLE_ADMIN`)
  - Stateless sessions, CORS configuration, and secured URL patterns
- **Data & Persistence:**
  - PostgreSQL as main database
  - JPA + Hibernate
- **AI & Vector Search:**
  - Spring AI + OpenAI
  - Chroma Vector Store for **image similarity search** (e.g. “search products by image”)
- **Payments:**
  - Stripe integration (`stripe-java`) for secure checkout

### Frontend

- **Framework:** Angular (standalone components, signals)
- **State:** Signal-based services (auth, cart, search, pagination)
- **HTTP:** `HttpClient` with an auth interceptor that attaches the JWT and transparently refreshes it on a 401
- **Routing:** lazy-loaded feature routes with functional route guards for user/admin areas
- **Payments:** Stripe.js + Card Element on the checkout page
- **UI:** Bootstrap 5 + bootstrap-icons

---

## 🚀 Running Locally with Docker

The whole stack (PostgreSQL + Spring Boot + Angular) builds and runs from the repo root:

```bash
# 1. Backend secrets (optional for a basic run — Stripe/AI features stay off if unset)
cp Backendgg/.env.example Backendgg/.env   # then fill in values as needed

# 2. Build and start everything
docker compose up --build
```

| Service  | URL                     |
|----------|-------------------------|
| Frontend | http://localhost:4200   |
| Backend  | http://localhost:8081   |
| Database | localhost:5432          |

The frontend (nginx) serves the built Angular app and the browser calls the backend API at `/api/v1`.

---

## 🌐 API Overview

### Live URLs

- **Website:** `https://gamegear.one`

### Authentication & Authorization

- **JWT‑based auth** with:
  - Access tokens (short‑lived)
  - Refresh tokens (long‑lived)

**Key patterns (/api/v1):**

| Area  | Example pattern                         | Notes                         |
|-------|-----------------------------------------|-------------------------------|
| Auth  | `/auth/**`                              | Login, register, refresh      |
| Users | `/users/**`                             | User profile, registration    |
| Cart  | `/carts/**`, `/cartItems/**`            | Cart operations (secured)     |
| Orders| `/orders/**`                            | Order creation/history        |

### Product API (selected endpoints)

**prefixed with** `/api/v1`:

| Method | Endpoint                                      | Description                                      | Auth        |
|--------|-----------------------------------------------|--------------------------------------------------|------------|
| GET    | `/products/all`                               | Get all products                                 | Public     |
| GET    | `/products/product/{productId}/product`       | Get single product by ID                         | Public     |
| GET    | `/products/products/{name}/products`          | Get products by name                             | Public     |
| GET    | `/products/product/by-brand?brand={brand}`    | Get products by brand                            | Public     |
| GET    | `/products/product/{category}/all/products`   | Get products by category                         | Public     |
| GET    | `/products/products/by/brand-and-name`        | Filter by brand & name                           | Public     |
| GET    | `/products/products/by/category-and-brand`    | Filter by category & brand                       | Public     |
| GET    | `/products/distinct/products`                 | Distinct products by name                        | Public     |
| GET    | `/products/distinct/brands`                   | All distinct brands                              | Public     |
| POST   | `/products/add`                               | Create product                                   | `ROLE_ADMIN` |
| PUT    | `/products/product/{productId}/update`        | Update product                                   | `ROLE_ADMIN` |
| DELETE | `/products/product/{productId}/delete`        | Delete product (handles cart/order refs)         | `ROLE_ADMIN` |


---

### Image search

| Method | Endpoint                                      | Description                                      | Auth        |
|--------|-----------------------------------------------|--------------------------------------------------|------------|
| POST   | `/products/search-by-image`                   | **Image similarity search** for matching products| Public     |
---

## 🗄️ Data Model & ER Diagram

> Entities are under `Backendgg/src/main/java/com/gamegear/gamegear/model`.

**ER Diagram (backend)**  

![GameGear ER Diagram](https://i.ibb.co/RrR1Km4/Untitled.png)


## 🎥 Demo

### 👤 User Flow Demo

- Browse products
- Search by category/brand/name
- Use **image search** to find similar products
- Login & Register
- Add to cart and checkout with Stripe
- View orders & profile

_demo user:_

[▶ User Flow Demo](https://player.vimeo.com/video/1141160325)

### 🛠️ Admin Flow Demo

- Admin login
- Create/update/delete products
- Manage inventory and categories
- Observe AI image search results and product linkage

_demo admin:_

[▶ Admin Flow Demo](https://player.vimeo.com/video/1141165207)


## 🛠️ Technologies

### Backend

- **Language:** Java 21  
- **Framework:** Spring Boot 3
- **Security:** Spring Security, JWT (JJWT), BCrypt
- **Database:** PostgreSQL
- **ORM:** Hibernate / Spring Data JPA
- **AI & Vector DB:** Spring AI, Chroma Vector Store, OpenAI
- **Payments:** Stripe (`stripe-java`)
- **Build Tool:** Maven

### Frontend

- Angular (standalone components, signals)
- TypeScript
- RxJS
- Stripe.js + Card Element
- Bootstrap 5

### Infrastructure

- Docker + Docker Compose (PostgreSQL, backend, nginx-served frontend)

---

## 🚀 Future Upgrades

### Email Notification Service:  
 - Send order confirmations, password resets, promotional emails.

### Product Review & Ratings:  

 - Enable users to review products and rate them.

### Wishlist & Favorites:  

 - Allow users to save favorite products for later.

### Data Analytics & Dashboard:  

 - Build endpoints for analytics on sales, user activity, and product performance.
