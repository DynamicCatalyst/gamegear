// import { api } from "./api";

// export const getDistinctProductsByName = async () => {
//     try {
//         const response = await api.get("/products/distinct/products");
//         return response.data;
//     } catch (error) {
//         throw error;
//     } 
// }

// export const updateCartItemQuantity = async (cartId, itemId, quantity) => {
//   try {
//     const result = await api.put(
//       `/cartItems/cart/${cartId}/item/${itemId}/update?quantity=${quantity}`
//     );
//     return result.data;
//   } catch (error) {
//     throw error;
//   }
// };