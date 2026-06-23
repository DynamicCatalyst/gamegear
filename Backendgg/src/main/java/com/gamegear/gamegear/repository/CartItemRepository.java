package com.gamegear.gamegear.repository;

import com.gamegear.gamegear.model.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
@Repository
public interface CartItemRepository extends JpaRepository<CartItem, Long> {
    public List<CartItem> findByProductId(Long productId);

    void deleteAllByCartId(Long cartId);
}

