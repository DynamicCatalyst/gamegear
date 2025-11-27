package com.gamegear.gamegear.service.product;

import com.gamegear.gamegear.dtos.ImageDto;
import com.gamegear.gamegear.dtos.ProductDto;
import com.gamegear.gamegear.model.*;
import com.gamegear.gamegear.repository.CartItemRepository;
import com.gamegear.gamegear.repository.CategoryRepository;
import com.gamegear.gamegear.repository.ImageRepository;
import com.gamegear.gamegear.repository.ProductRepository;
import com.gamegear.gamegear.request.AddProductRequest;
import com.gamegear.gamegear.request.ProductUpdateRequest;
import com.gamegear.gamegear.service.chroma.ChromaService;
import jakarta.persistence.EntityExistsException;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductService implements IProductService{
    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final CartItemRepository cartItemRepository;
    private final com.gamegear.gamegear.repository.orderItemRepository orderItemRepository;
    private final ModelMapper modelMapper;
    private final ImageRepository imageRepository;

    @Override
    public Product addProduct(AddProductRequest request) {
        if (productExists(request.getName(), request.getBrand())){
            throw new EntityExistsException(request.getName() +" already Exists! :)");
        }
        Category category = Optional.ofNullable(categoryRepository.findByName(request.getCategory().getName()))
                .orElseGet(()->{
                    Category newCategory = new Category(request.getCategory().getName());
                    return categoryRepository.save(newCategory);
                });
        request.setCategory(category);
        return productRepository.save(createProduct(request, category));
    }
    private boolean productExists(String name, String brand){
        return productRepository.existsByNameAndBrand(name,brand);
    }
    private Product createProduct(AddProductRequest request, Category category){
        return new Product(
                request.getName(),
                request.getBrand(),
                request.getPrice(),
                request.getInventory(),
                request.getDescription(),
                category
        );
    }


    @Override
    public Product updateProduct(ProductUpdateRequest request, Long productId) {
        return productRepository.findById(productId).map(existingProduct -> updateExistingProducts(existingProduct, request))
                .map(productRepository :: save).orElseThrow( () -> new EntityNotFoundException("Product not found"));

    }
    private Product updateExistingProducts(Product existingProduct, ProductUpdateRequest request){
        existingProduct.setName(request.getName());
        existingProduct.setBrand(request.getBrand());
        existingProduct.setPrice(request.getPrice());
        existingProduct.setInventory(request.getInventory());
        existingProduct.setDescription(request.getDescription());
        Category category = categoryRepository.findByName(request.getCategory().getName());
        existingProduct.setCategory(category);

        return existingProduct;
    }
    @Override
    public Product getProductById(Long productId) {
        return productRepository.findById(productId)
                .orElseThrow(()-> new EntityNotFoundException("Product not found"));
    }

    @Override
    public void deleteProductById(Long productId) {
        productRepository.findById(productId)
                .ifPresentOrElse(
                        product -> {
                            List<CartItem> cartItems = cartItemRepository.findByProductId(productId);
                            cartItems.forEach(cartItem -> {
                                Cart cart  = cartItem.getCart();
                                cart.removeItem(cartItem);
                                cartItemRepository.delete(cartItem);
                            });
                            List<OrderItem> orderItems = orderItemRepository.findByProductId(productId);
                            orderItems.forEach(orderItem -> {
                                orderItem.setProduct(null);
                                orderItemRepository.save(orderItem);
                            });

                            Optional.ofNullable(product.getCategory())
                                    .ifPresent(category -> category.getProducts().remove(product));
                            product.setCategory(null);
                            productRepository.deleteById(product.getId());
                        },
                        () -> {
                            throw new EntityNotFoundException("Product not found!");
                        }
                        );
    }

    @Override
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    @Override
    public List<Product> getProductsByCategoryAndBrand(String category, String brand) {
        return productRepository.findByCategoryNameAndBrand(category, brand);
    }

    @Override
    public List<Product> getProductsByCategory(String category) {
        return productRepository.findByCategoryName(category);
    }

    @Override
    public List<Product> getProductByBrandAndName(String brand, String name) {
        return productRepository.findByNameAndBrand(brand, name);
    }

    @Override
    public List<Product> getProductByBrand(String brand) {
        return productRepository.findByBrand(brand);
    }

    @Override
    public List<Product> getProductByName(String name) {
        return productRepository.findByName(name);
    }


    @Override
    public List<Product> findDistinctProductsByName(){
        List<Product> products = getAllProducts();
        Map<String,Product> distinctProductMap = products.stream()
                .collect(Collectors.toMap(
                        Product::getName,
                        product -> product,
                        (existing, replacement) -> existing));

        return new ArrayList<>(distinctProductMap.values());
    }

    @Override
    public List<String> getAllDistinctBrands(){
        return productRepository.findAll()
                .stream()
                .map(Product :: getBrand)
                .distinct()
                .toList();
    }

    private final ChromaService chromaService;

    @Override
    public List<Product> searchProductsByImage(MultipartFile image) throws IOException {
        List<Long> ListOfProductIds = chromaService.searchImageSimilarity(image);
        List<Product> products = productRepository.findAllById(ListOfProductIds);
        return products;
    }


    @Override
    public List<ProductDto> getConvertedProducts(List<Product> products){
        return products.stream().map(this::convertToDto).toList();
    }
    @Override
    public ProductDto convertToDto(Product product){
        ProductDto productDto = modelMapper.map(product, ProductDto.class);
        List<Image> images = imageRepository.findByProductId(product.getId());
        List<ImageDto> imageDtos = images.stream().map(image -> modelMapper.map(image, ImageDto.class)).toList();
        productDto.setImages(imageDtos);
        return productDto;
    }
}
