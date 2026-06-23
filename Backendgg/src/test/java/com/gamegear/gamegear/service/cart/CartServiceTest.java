package com.gamegear.gamegear.service.cart;

import com.gamegear.gamegear.model.Cart;
import com.gamegear.gamegear.model.User;
import com.gamegear.gamegear.repository.CartItemRepository;
import com.gamegear.gamegear.repository.CartRepository;
import jakarta.persistence.EntityNotFoundException;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.modelmapper.ModelMapper;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class CartServiceTest {

    @Mock private CartRepository cartRepository;
    @Mock private CartItemRepository cartItemRepository;
    @Mock private ModelMapper mapper;

    @InjectMocks private CartService cartService;

    @Test
    void getCart_returnsCart_whenFound() {
        Cart cart = new Cart();
        cart.setId(1L);
        when(cartRepository.findById(1L)).thenReturn(Optional.of(cart));
        when(cartRepository.save(cart)).thenReturn(cart);

        Cart found = cartService.getCart(1L);

        assertThat(found.getId()).isEqualTo(1L);
    }

    @Test
    void getCart_throwsException_whenNotFound() {
        when(cartRepository.findById(42L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> cartService.getCart(42L))
                .isInstanceOf(EntityNotFoundException.class)
                .hasMessageContaining("Cart not found");
    }

    @Test
    void initializeCartForUser_returnsExistingCart_whenUserAlreadyHasOne() {
        User user = new User();
        user.setId(7L);
        Cart existing = new Cart();
        existing.setId(3L);
        when(cartRepository.findByUserId(7L)).thenReturn(existing);

        Cart result = cartService.initializeCartForUser(user);

        assertThat(result.getId()).isEqualTo(3L);
        // No new cart should be created when one already exists.
        verify(cartRepository, never()).save(any(Cart.class));
    }

    @Test
    void initializeCartForUser_createsNewCart_whenUserHasNone() {
        User user = new User();
        user.setId(8L);
        when(cartRepository.findByUserId(8L)).thenReturn(null);
        when(cartRepository.save(any(Cart.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Cart result = cartService.initializeCartForUser(user);

        assertThat(result.getUser()).isEqualTo(user);
        verify(cartRepository).save(any(Cart.class));
    }
}
