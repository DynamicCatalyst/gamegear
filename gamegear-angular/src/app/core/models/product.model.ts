export interface Category {
  id: number;
  name: string;
}

export interface ProductImage {
  id: number;
  fileName: string;
  downloadUrl: string;
}

export interface Product {
  id: number;
  name: string;
  brand: string;
  price: number;
  inventory: number;
  description: string;
  category: Category;
  images: ProductImage[];
}

/** Payload for creating a product (POST /products/add). */
export interface AddProductRequest {
  name: string;
  brand: string;
  price: number;
  inventory: number;
  description: string;
  category: { name: string };
}

/** Payload for updating a product (PUT /products/product/{id}/update). */
export interface ProductUpdateRequest {
  name: string;
  brand: string;
  price: number;
  inventory: number;
  description: string;
  category: { name: string };
}
