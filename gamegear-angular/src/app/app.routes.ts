import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';

/**
 * Route table.
 * Feature components are lazy-loaded. Guards protect the secured routes
 * (the Spring Boot backend independently enforces auth/roles).
 */
export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/home/home/home').then((m) => m.Home),
  },
  {
    path: 'products',
    loadComponent: () =>
      import('./features/product/products/products').then((m) => m.Products),
  },
  {
    path: 'products/:name',
    loadComponent: () =>
      import('./features/product/products/products').then((m) => m.Products),
  },
  {
    path: 'products/category/:category/products',
    loadComponent: () =>
      import('./features/product/products/products').then((m) => m.Products),
  },
  {
    path: 'product/:productId/details',
    loadComponent: () =>
      import('./features/product/product-details/product-details').then(
        (m) => m.ProductDetails,
      ),
  },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login').then((m) => m.Login),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./features/auth/registration/registration').then((m) => m.Registration),
  },
  {
    path: 'unauthorized',
    loadComponent: () =>
      import('./features/auth/unauthorized/unauthorized').then((m) => m.Unauthorized),
  },
  {
    path: 'user-profile/:userId/profile',
    canActivate: [authGuard(['ROLE_USER', 'ROLE_ADMIN'])],
    loadComponent: () =>
      import('./features/user/user-profile/user-profile').then((m) => m.UserProfile),
  },
  {
    path: 'user/:userId/my-cart',
    canActivate: [authGuard(['ROLE_USER', 'ROLE_ADMIN'])],
    loadComponent: () => import('./features/cart/cart/cart').then((m) => m.Cart),
  },
  {
    path: 'checkout/:userId/checkout',
    canActivate: [authGuard(['ROLE_USER', 'ROLE_ADMIN'])],
    loadComponent: () =>
      import('./features/checkout/checkout/checkout').then((m) => m.Checkout),
  },
  {
    path: 'add-product',
    canActivate: [authGuard(['ROLE_ADMIN'])],
    loadComponent: () =>
      import('./features/product/add-product/add-product').then((m) => m.AddProduct),
  },
  {
    path: 'create-admin',
    canActivate: [authGuard(['ROLE_ADMIN'])],
    loadComponent: () =>
      import('./features/admin/create-admin/create-admin').then((m) => m.CreateAdmin),
  },
  {
    path: 'update-product/:productId/update',
    canActivate: [authGuard(['ROLE_ADMIN'])],
    loadComponent: () =>
      import('./features/product/product-update/product-update').then(
        (m) => m.ProductUpdate,
      ),
  },
  { path: '**', redirectTo: '' },
];

