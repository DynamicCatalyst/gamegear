#  GameGear – FullStack E‑commerce (Spring Boot, Spring AI, Stripe) 🎮

GameGear is a full‑stack e‑commerce website with a **Spring Boot** backend and **Angular** frontend, using **PostgreSQL** with help of`docker compose`. 
It covers secure APIs, Stripe payments, AI‑powered image search, and JWT‑based authentication with role‑based access.

---

## Project Overview

### Backend

- **Framework:** Spring Boot
- **Layers:**
  - **Controller layr** – `controller/*` (e.g. `ProductController`, `AuthController`, `OrderController`, `CartController`)
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


### Live URLs

- **Website:** `https://gamegear.one`

### Authentication & Authorization

- **JWT‑based auth** with:
  - Access tokens (short‑lived)
  - Refresh tokens (long‑lived)

**urls (/api/v1):**

| Area  | Example pattern                         | Notes                         |
|-------|-----------------------------------------|-------------------------------|
| Auth  | `/auth/**`                              | Login, register, refresh      |
| Users | `/users/**`                             | User profile, registration    |
| Cart  | `/carts/**`, `/cartItems/**`            | Cart operations (secured)     |
| Orders| `/orders/**`                            | Order creation/history        |

### Product API endpoints

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

## 🚀 Future Upgrades
- Enable users to review products and rate them.
-  Product Review & Ratings
