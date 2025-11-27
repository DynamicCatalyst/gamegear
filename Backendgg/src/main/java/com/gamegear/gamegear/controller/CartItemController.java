package com.gamegear.gamegear.controller;


import com.gamegear.gamegear.dtos.CartItemDto;
import com.gamegear.gamegear.model.Cart;
import com.gamegear.gamegear.model.CartItem;
import com.gamegear.gamegear.model.User;
import com.gamegear.gamegear.response.ApiResponse;
import com.gamegear.gamegear.service.cart.ICartItemService;
import com.gamegear.gamegear.service.cart.ICartService;
import com.gamegear.gamegear.service.user.IUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("${api.prefix}/cartItems")
public class CartItemController {
    private final ICartItemService cartItemService;
    private final IUserService userService;
    private final ICartService cartService;

    @PostMapping("/item/add")
    private ResponseEntity<ApiResponse> addItemToCart(
                                                      @RequestParam Long productId,
                                                      @RequestParam int quantity){
        User user = userService.getAuthenticatedUser();
        Cart cart = cartService.initializeCartForUser(user);
//        cartItemService.addItemToCart(cart.getId(), productId,quantity);
        CartItem cartItem =  cartItemService.addItemToCart(cart.getId(), productId,quantity);
        CartItemDto cartItemDto = cartItemService.convertToDto(cartItem);
        return ResponseEntity.ok(new ApiResponse("Item Added Successfully!", cartItemDto ));
    }

    @DeleteMapping("/cart/{cartId}/item/{itemId}/remove")
    public ResponseEntity<ApiResponse> removeItemFromCart(@PathVariable Long cartId,@PathVariable Long itemId){
        cartItemService.removeItemFromCart(cartId,itemId);
        return ResponseEntity.ok(new ApiResponse("Item Removed Successfully!", null));
    }


    @PutMapping("/cart/{cartId}/item/{itemId}/update")
    public ResponseEntity<ApiResponse> updateCartItem(@PathVariable Long cartId,
                                                      @PathVariable Long itemId,
                                                      @RequestParam int quantity){
        cartItemService.updateItemQuantity(cartId, itemId, quantity);
        return ResponseEntity.ok(new ApiResponse("Item updated Successfully!", null));
    }
}
