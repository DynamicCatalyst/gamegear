package com.gamegear.gamegear.service.product;

import com.gamegear.gamegear.dtos.ProductDto;
import com.gamegear.gamegear.model.Product;
import com.gamegear.gamegear.request.AddProductRequest;
import com.gamegear.gamegear.request.ProductUpdateRequest;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface IProductService {
    Product addProduct(AddProductRequest product);
    Product updateProduct(ProductUpdateRequest product, Long ProductId);
    Product getProductById(Long productId);
    void deleteProductById(Long productId);

    List<Product> getAllProducts();
    List<Product> getProductsByCategoryAndBrand(String category, String brand);
    List<Product> getProductsByCategory(String category);
    List<Product> getProductByBrandAndName(String brand, String name);
    List<Product> getProductByBrand(String brand);
    List<Product> getProductByName(String name);


    List<Product> findDistinctProductsByName();

    List<String> getAllDistinctBrands();


    List<Product> searchProductsByImage(MultipartFile image) throws IOException;

    List<ProductDto> getConvertedProducts(List<Product> products);



    ProductDto convertToDto(Product product);
}
