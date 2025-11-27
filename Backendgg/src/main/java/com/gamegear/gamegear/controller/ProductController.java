package com.gamegear.gamegear.controller;

import com.gamegear.gamegear.dtos.ProductDto;
import com.gamegear.gamegear.model.Product;
import com.gamegear.gamegear.request.AddProductRequest;
import com.gamegear.gamegear.request.ProductUpdateRequest;
import com.gamegear.gamegear.response.ApiResponse;
import com.gamegear.gamegear.service.chroma.ChromaService;
import com.gamegear.gamegear.service.product.IProductService;
import jakarta.persistence.EntityExistsException;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("${api.prefix}/products")
public class ProductController {
    private static final Logger log = LoggerFactory.getLogger(ProductController.class);
    private final IProductService productService;
    private final ChromaService chromaService;

    @GetMapping("/all")
    public ResponseEntity<ApiResponse> getAllProducts(){
        List<Product> products = productService.getAllProducts();
        List<ProductDto> convertedProducts = productService.getConvertedProducts(products);
        return ResponseEntity.ok(new ApiResponse("Retrieved successfully!", convertedProducts));
    }

    @GetMapping("/product/{productId}/product")
    public ResponseEntity<ApiResponse> getProductById(@PathVariable Long productId){
            Product product = productService.getProductById(productId);
            ProductDto productDto = productService.convertToDto(product);
            return ResponseEntity.ok(new ApiResponse("found!",productDto));

    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PostMapping("/add")
    public ResponseEntity<ApiResponse> addProduct(@RequestBody AddProductRequest product){
            Product ourproduct = productService.addProduct(product);
            ProductDto productDto = productService.convertToDto(ourproduct);
            return ResponseEntity.ok(new ApiResponse("successfully added product",productDto));

    }
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PutMapping("/product/{productId}/update")
    public ResponseEntity<ApiResponse> updateProduct(@RequestBody ProductUpdateRequest request, @PathVariable Long productId){

            Product outProduct = productService.updateProduct(request, productId);
            ProductDto productDto = productService.convertToDto(outProduct);
            return ResponseEntity.ok(new ApiResponse("successfully updated product",productDto));

    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @DeleteMapping("/product/{productId}/delete")
    public ResponseEntity<ApiResponse> deleteProduct(@PathVariable Long productId){

            productService.deleteProductById(productId);
            return ResponseEntity.ok(new ApiResponse("successfully deleted product",productId));

    }

    @GetMapping("/products/by/brand-and-name")
    public ResponseEntity<ApiResponse> getProductsByBrandAndName(@RequestParam String brandName, @RequestParam String productName){
            List<Product> products = productService.getProductByBrandAndName(brandName,productName);
            List<ProductDto> productDtos = productService.getConvertedProducts(products);
            return ResponseEntity.ok(new ApiResponse("success",productDtos));

    }

    @GetMapping("/products/by/category-and-brand")
    public ResponseEntity<ApiResponse> getProductByCategoryAndBrand(@RequestParam String category, @RequestParam String brand) {
            List<Product> products = productService.getProductsByCategoryAndBrand(category, brand);
            List<ProductDto> convertedProducts = productService.getConvertedProducts(products);
            return ResponseEntity.ok(new ApiResponse("success", convertedProducts));

    }

    @GetMapping("/products/{name}/products")
    public ResponseEntity<ApiResponse> getProductByName(@PathVariable String name) {

            List<Product> products = productService.getProductByName(name);
            List<ProductDto> convertedProducts = productService.getConvertedProducts(products);
            return ResponseEntity.ok(new ApiResponse("success", convertedProducts));
    }

    @GetMapping("/product/by-brand")
    public ResponseEntity<ApiResponse> findProductByBrand(@RequestParam String brand) {
            List<Product> products = productService.getProductByBrand(brand);
            List<ProductDto> convertedProducts = productService.getConvertedProducts(products);
            return ResponseEntity.ok(new ApiResponse("success", convertedProducts));

    }

    @GetMapping("/product/{category}/all/products")
    public ResponseEntity<ApiResponse> findProductsByCategory(@PathVariable String category) {
            List<Product> products = productService.getProductsByCategory(category);
            List<ProductDto> convertedProducts = productService.getConvertedProducts(products);
            return ResponseEntity.ok(new ApiResponse("success", convertedProducts));
    }

    @GetMapping("/distinct/products")
    public ResponseEntity<ApiResponse> findDistinctProductsByName(){
        List<Product> products = productService.findDistinctProductsByName();
        List<ProductDto> productDtos = productService.getConvertedProducts(products);
        return ResponseEntity.ok(new ApiResponse("Found", productDtos));
    }

    @GetMapping("/distinct/brands")
    public ResponseEntity<ApiResponse> getDistinctBrands() {
        return ResponseEntity.ok(new ApiResponse("Found", productService.getAllDistinctBrands()));
    }

    @PostMapping("/search-by-image")
    public ResponseEntity<ApiResponse> searchProductsByImage(@RequestParam("image") MultipartFile image) throws IOException {
        List<Product> matchingProducts = productService.searchProductsByImage(image);
        log.info("Found {} products", matchingProducts.size());
        List<ProductDto> convertedProducts = productService.getConvertedProducts(matchingProducts);
        log.info("Found {} products", convertedProducts);
        return ResponseEntity.ok(new ApiResponse("Matching products", convertedProducts));
    }


}
