package com.gamegear.gamegear.service.cart;


import com.gamegear.gamegear.dtos.CartItemDto;
import com.gamegear.gamegear.model.CartItem;

public interface ICartItemService {
    //add item //remove item //update items quantity //get cart items

    CartItem addItemToCart(Long cartId, Long productId, int quantity);
    void removeItemFromCart(Long cartId, Long productId);
    void updateItemQuantity(Long cartId, Long productId, int quantity);

    CartItem getCartItem(Long cartId, Long productId);

    CartItemDto convertToDto(CartItem cartItem);
}
