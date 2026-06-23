package com.gamegear.gamegear.service.cart;


import com.gamegear.gamegear.dtos.CartDto;
import com.gamegear.gamegear.model.Cart;
import com.gamegear.gamegear.model.User;

import java.math.BigDecimal;

public interface ICartService {
    Cart getCart(Long cartId);

    Cart getCartByUserId(Long userId);

    void clearCart(Long cartId);

    Cart initializeCartForUser(User user);

    BigDecimal getTotalPrice(Long cartId);
    CartDto convertToDto(Cart cart);

}
