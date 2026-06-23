package com.gamegear.gamegear.repository;

import com.gamegear.gamegear.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrderRepository extends JpaRepository<Order , Long> {
    List<Order> findByUserId(Long userId);
}
