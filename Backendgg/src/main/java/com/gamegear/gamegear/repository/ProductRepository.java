package com.gamegear.gamegear.repository;

import com.gamegear.gamegear.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ProductRepository
        extends JpaRepository<Product, Long>, JpaSpecificationExecutor<Product> {


    List<Product> findByCategoryNameAndBrand(String category, String brand);

    List<Product> findByCategoryName(String category);

    List<Product> findByNameAndBrand(String brand, String name);

    @Query("SELECT p FROM Product p WHERE LOWER(p.name) LIKE LOWER(CONCAT('%', :NAME, '%'))")
    List<Product> findByName(@Param("NAME") String name);

    List<Product> findByBrand(String brand);

    boolean existsByNameAndBrand(String name, String brand);

    @Query("SELECT p FROM Product p WHERE " +
            "(:category IS NULL OR p.category.name = :category) AND " +
            "(:brands IS NULL OR p.brand IN :brands) AND " +
            "(:name = '' OR LOWER(p.name) LIKE LOWER(CONCAT('%', :name, '%')))")
    org.springframework.data.domain.Page<Product> search(@Param("category") String category,
                                                         @Param("brands") List<String> brands,
                                                         @Param("name") String name,
                                                         org.springframework.data.domain.Pageable pageable);
}


