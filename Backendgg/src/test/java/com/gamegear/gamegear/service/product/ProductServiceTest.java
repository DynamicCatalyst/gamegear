package com.gamegear.gamegear.service.product;

import com.gamegear.gamegear.model.Category;
import com.gamegear.gamegear.model.Product;
import com.gamegear.gamegear.repository.CartItemRepository;
import com.gamegear.gamegear.repository.CategoryRepository;
import com.gamegear.gamegear.repository.ImageRepository;
import com.gamegear.gamegear.repository.ProductRepository;
import com.gamegear.gamegear.repository.OrderItemRepository;
import com.gamegear.gamegear.request.AddProductRequest;
import com.gamegear.gamegear.service.chroma.ChromaService;
import jakarta.persistence.EntityExistsException;
import jakarta.persistence.EntityNotFoundException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.modelmapper.ModelMapper;

import java.math.BigDecimal;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ProductServiceTest {

    @Mock private ProductRepository productRepository;
    @Mock private CategoryRepository categoryRepository;
    @Mock private CartItemRepository cartItemRepository;
    @Mock private OrderItemRepository orderItemRepository;
    @Mock private ModelMapper modelMapper;
    @Mock private ImageRepository imageRepository;
    @Mock private ChromaService chromaService;

    @InjectMocks private ProductService productService;

    private AddProductRequest request;
    private Category category;

    @BeforeEach
    void setUp() {
        category = new Category("Consoles");
        category.setId(1L);

        request = new AddProductRequest();
        request.setName("PlayStation 5");
        request.setBrand("Sony");
        request.setPrice(new BigDecimal("499.99"));
        request.setInventory(10);
        request.setDescription("Sony PlayStation 5 console");
        request.setCategory(category);
    }

    @Test
    void addProduct_savesProduct_whenItDoesNotExistYet() {
        when(productRepository.existsByNameAndBrand("PlayStation 5", "Sony")).thenReturn(false);
        when(categoryRepository.findByName("Consoles")).thenReturn(category);
        when(productRepository.save(any(Product.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Product saved = productService.addProduct(request);

        assertThat(saved.getName()).isEqualTo("PlayStation 5");
        assertThat(saved.getBrand()).isEqualTo("Sony");
        assertThat(saved.getCategory()).isEqualTo(category);
        verify(productRepository).save(any(Product.class));
    }

    @Test
    void addProduct_throwsException_whenProductAlreadyExists() {
        when(productRepository.existsByNameAndBrand("PlayStation 5", "Sony")).thenReturn(true);

        assertThatThrownBy(() -> productService.addProduct(request))
                .isInstanceOf(EntityExistsException.class);

        verify(productRepository, never()).save(any(Product.class));
    }

    @Test
    void getProductById_returnsProduct_whenFound() {
        Product product = new Product();
        product.setId(5L);
        product.setName("Xbox Series X");
        when(productRepository.findById(5L)).thenReturn(Optional.of(product));

        Product found = productService.getProductById(5L);

        assertThat(found.getId()).isEqualTo(5L);
        assertThat(found.getName()).isEqualTo("Xbox Series X");
    }

    @Test
    void getProductById_throwsException_whenNotFound() {
        when(productRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> productService.getProductById(99L))
                .isInstanceOf(EntityNotFoundException.class)
                .hasMessageContaining("Product not found");
    }
}
