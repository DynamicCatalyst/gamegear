package com.gamegear.gamegear.repository;

import com.gamegear.gamegear.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {


    List<Product> findByCategoryNameAndBrand(String category, String brand);

    List<Product> findByCategoryName(String category);

    List<Product> findByNameAndBrand(String brand, String name);

    @Query("SELECT p FROM Product p WHERE LOWER(p.name) LIKE LOWER(CONCAT('%', :NAME, '%'))")
    List<Product> findByName(@Param("NAME") String name);

    List<Product> findByBrand(String brand);

    boolean existsByNameAndBrand(String name, String brand);
}
