# 🎮 GameGear – Java Full Stack E‑commerce (Spring Boot, Spring AI, Stripe)

GameGear is a full‑stack e‑commerce platform built with a **Spring Boot** backend and **React + Vite** frontend.  
This repository is primarily focused on the **backend**: secure APIs, payment processing, AI‑powered image search, and JWT‑based authentication.

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

### Frontend (Summary)

- **Stack:** React 18, Vite, Redux Toolkit
- **UI:** React Bootstrap, MUI, React Toastify
- **Payments:** Stripe Elements
- **Routing:** React Router, protected routes for user/admin dashboards

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

![GameGear ER Diagram](https://github-production-user-asset-6210df.s3.amazonaws.com/139992935/519812856-bda85712-d249-43cb-8942-d7d15c8da456.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAVCODYLSA53PQK4ZA%2F20251127%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20251127T155641Z&X-Amz-Expires=300&X-Amz-Signature=113f44fbe6a9d270cd0e01e2167c2141140df151653bc85145d87cdbe78a6302&X-Amz-SignedHeaders=host)


## 🎥 Demo

You can showcase both user and admin flows with GIFs or video links.

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

### Frontend (brief)

- React 18, Vite
- Redux Toolkit
- React Router
- Stripe Elements
- React Bootstrap, MUI, React Toastify

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
