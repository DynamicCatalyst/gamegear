package com.gamegear.gamegear.data;

import com.gamegear.gamegear.model.Category;
import com.gamegear.gamegear.model.Image;
import com.gamegear.gamegear.model.Product;
import com.gamegear.gamegear.repository.CategoryRepository;
import com.gamegear.gamegear.repository.ImageRepository;
import com.gamegear.gamegear.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.ApplicationListener;
import org.springframework.core.annotation.Order;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import javax.sql.rowset.serial.SerialBlob;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Component
@Order(2)
@RequiredArgsConstructor
public class SampleDataInitializer implements ApplicationListener<ApplicationReadyEvent> {
    private static final Logger log = LoggerFactory.getLogger(SampleDataInitializer.class);

    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;
    private final ImageRepository imageRepository;

    @Override
    @Transactional
    public void onApplicationEvent(ApplicationReadyEvent event) {
        if (productRepository.count() > 0) {
            log.info("Sample data already present ({} products); skipping seed.", productRepository.count());
            return;
        }
        seedProducts();
    }

    private void seedProducts() {
        Map<String, List<Product>> catalog = new LinkedHashMap<>();

        catalog.put("Consoles", List.of(
                product("PlayStation 5", "Sony", "49999", 25,
                        "Sony PlayStation 5 with ultra-high-speed SSD, ray tracing, and DualSense controller."),
                product("Xbox Series X", "Microsoft", "52999", 20,
                        "Microsoft Xbox Series X, 1TB SSD, 4K gaming at up to 120 FPS."),
                product("Nintendo Switch OLED", "Nintendo", "34999", 40,
                        "Nintendo Switch OLED with a vivid 7-inch screen and enhanced audio.")
        ));

        catalog.put("Controllers", List.of(
                product("DualSense Wireless Controller", "Sony", "5999", 100,
                        "DualSense controller with haptic feedback and adaptive triggers for PS5."),
                product("Xbox Elite Series 2", "Microsoft", "17999", 50,
                        "Pro-grade Xbox Elite Series 2 controller with adjustable-tension thumbsticks.")
        ));

        catalog.put("PC Gaming", List.of(
                product("ASUS TUF Gaming F15", "ASUS", "74999", 15,
                        "Gaming laptop with Intel Core i7, RTX 4060, 144Hz display, and military-grade durability."),
                product("Dell G15 Gaming Laptop", "Dell", "62999", 20,
                        "Dell G15 with AMD Ryzen 7, RTX 3060, 120Hz display optimized for long sessions."),
                product("HP Victus 16 Gaming Laptop", "HP", "57999", 18,
                        "HP Victus 16 with AMD Ryzen 5, RTX 3050, 144Hz display — great value gaming laptop."),
                product("Razer BlackWidow V4", "Razer", "14999", 60,
                        "Mechanical gaming keyboard with green clicky switches and Razer Chroma RGB lighting."),
                product("NVIDIA RTX 3050 8GB", "NVIDIA", "24999", 30,
                        "NVIDIA GeForce RTX 3050 8GB GDDR6 — ray tracing and DLSS for 1080p gaming.")
        ));

        catalog.put("Accessories", List.of(
                product("Logitech G Pro X Superlight", "Logitech", "12999", 80,
                        "Ultra-lightweight wireless gaming mouse at just 63g with HERO 25K sensor."),
                product("SteelSeries Arctis Nova Pro", "SteelSeries", "29999", 35,
                        "High-fidelity gaming headset with active noise cancellation and Hi-Res audio."),
                product("ASUS ROG Delta S Headset", "ASUS", "18999", 45,
                        "ROG Delta S gaming headset with ESS Quad-DAC, 50mm drivers, and AI noise cancellation."),
                product("Meta Quest Pro VR Headset", "Meta", "89999", 10,
                        "Meta Quest Pro mixed reality headset with eye and face tracking for immersive VR."),
                product("Monster Gaming Chair", "Monster", "19999", 25,
                        "Ergonomic gaming chair with lumbar support, reclining backrest, and adjustable armrests."),
                product("D-GROEE Extended Gaming Mousepad", "D-GROEE", "1499", 150,
                        "XXL extended gaming mousepad with stitched edges and smooth micro-textured surface."),
                product("Car Racing Simulator Cockpit", "Generic", "34999", 8,
                        "Full racing simulator cockpit with steering wheel mount, pedal support, and adjustable frame.")
        ));

        record ImageEntry(String resource, String contentType, String productName) {}
        List<ImageEntry> images = List.of(
                new ImageEntry("static/product-images/ps5.png",                   "image/png",  "PlayStation 5"),
                new ImageEntry("static/product-images/xbox.jpg",                  "image/jpeg", "Xbox Series X"),
                new ImageEntry("static/product-images/nintendo.jpg",              "image/jpeg", "Nintendo Switch OLED"),
                new ImageEntry("static/product-images/dualsense_wireless.jpg",    "image/jpeg", "DualSense Wireless Controller"),
                new ImageEntry("static/product-images/xbox_elite_series_2.jpg",   "image/jpeg", "Xbox Elite Series 2"),
                new ImageEntry("static/product-images/asus_tuf_f15.jpg",          "image/jpeg", "ASUS TUF Gaming F15"),
                new ImageEntry("static/product-images/dell_gaming_laptop.jpg",    "image/jpeg", "Dell G15 Gaming Laptop"),
                new ImageEntry("static/product-images/victus_by_hp.jpg",          "image/jpeg", "HP Victus 16 Gaming Laptop"),
                new ImageEntry("static/product-images/razor_blackwidow_keyboard.jpg", "image/jpeg", "Razer BlackWidow V4"),
                new ImageEntry("static/product-images/rtx_3050_graphics_card.jpg","image/jpeg", "NVIDIA RTX 3050 8GB"),
                new ImageEntry("static/product-images/logitech_mouse.jpg",        "image/jpeg", "Logitech G Pro X Superlight"),
                new ImageEntry("static/product-images/arctis_nova.jpg",           "image/jpeg", "SteelSeries Arctis Nova Pro"),
                new ImageEntry("static/product-images/Rog_pelta_headphones.jpg",  "image/jpeg", "ASUS ROG Delta S Headset"),
                new ImageEntry("static/product-images/meta_quest_pro_vr_headset.jpg", "image/jpeg", "Meta Quest Pro VR Headset"),
                new ImageEntry("static/product-images/monsters_gamingChair.jpg",  "image/jpeg", "Monster Gaming Chair"),
                new ImageEntry("static/product-images/mousepad_D_GROEE.jpg",      "image/jpeg", "D-GROEE Extended Gaming Mousepad"),
                new ImageEntry("static/product-images/car_racing_simulatir.jpg",  "image/jpeg", "Car Racing Simulator Cockpit")
        );

        // Save categories + products
        Map<String, Product> savedByName = new java.util.HashMap<>();
        int productCount = 0;
        for (Map.Entry<String, List<Product>> entry : catalog.entrySet()) {
            Category category = categoryRepository.save(new Category(entry.getKey()));
            for (Product p : entry.getValue()) {
                p.setCategory(category);
                Product saved = productRepository.save(p);
                savedByName.put(saved.getName(), saved);
                productCount++;
            }
        }

        // Attach images
        int imageCount = 0;
        for (ImageEntry ie : images) {
            Product product = savedByName.get(ie.productName());
            if (product == null) continue;
            try {
                ClassPathResource res = new ClassPathResource(ie.resource());
                if (!res.exists()) {
                    log.warn("Image resource not found: {}", ie.resource());
                    continue;
                }
                byte[] bytes = res.getInputStream().readAllBytes();
                Image image = new Image();
                image.setFileName(res.getFilename());
                image.setFileType(ie.contentType());
                image.setImage(new SerialBlob(bytes));
                image.setProduct(product);
                image.setDownloadUrl("/api/v1/images/image/download/0");
                Image saved = imageRepository.save(image);
                saved.setDownloadUrl("/api/v1/images/image/download/" + saved.getId());
                imageRepository.save(saved);
                imageCount++;
            } catch (Exception e) {
                log.warn("Could not seed image '{}' for '{}': {}", ie.resource(), ie.productName(), e.getMessage());
            }
        }

        log.info("Seeded {} categories, {} products, {} images.", catalog.size(), productCount, imageCount);
    }

    private Product product(String name, String brand, String price, int inventory, String description) {
        Product p = new Product();
        p.setName(name);
        p.setBrand(brand);
        p.setPrice(new BigDecimal(price));
        p.setInventory(inventory);
        p.setDescription(description);
        return p;
    }
}
