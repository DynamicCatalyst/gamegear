package com.gamegear.gamegear.controller;

import com.gamegear.gamegear.dtos.ImageDto;
import com.gamegear.gamegear.model.Image;
import com.gamegear.gamegear.response.ApiResponse;
import com.gamegear.gamegear.service.image.IImageService;
import com.gamegear.gamegear.service.llm.LLMService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.sql.SQLException;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("${api.prefix}/images")
public class ImageController {
    private final IImageService imageService;
    private final LLMService llmService;
    @PostMapping("/upload")

    public ResponseEntity<ApiResponse> uploadImage(
            @RequestParam("files") List<MultipartFile> files,
            @RequestParam("productId") Long productId){
            List<ImageDto> imageDto = imageService.saveImages(productId, files);
            return ResponseEntity.ok(new ApiResponse("Images successfully uploaded", imageDto));
    }
    @GetMapping("/image/download/{imageId}")
    @Transactional
    public ResponseEntity<Resource> downloadImage(@PathVariable Long imageId) throws SQLException {
        Image image = imageService.getImageById(imageId);
        ByteArrayResource resource = new ByteArrayResource(image.getImage().getBytes(1,(int)image.getImage().length()));
        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(image.getFileType()))
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment: filename=\""+ image.getFileName() +"\"").body(resource);
    }

    @PutMapping("/image/{imageId}/update")
    @Transactional
    public ResponseEntity<ApiResponse> updateImage(
            @PathVariable Long imageId,
            @RequestParam("file") MultipartFile file
    ){
            imageService.updateImage(file, imageId);
            return ResponseEntity.ok(new ApiResponse("Successfully Updated Image!", null));
    }
    @DeleteMapping("/image/{imageId}/delete")
    @Transactional
    public ResponseEntity<ApiResponse> deleteImage(@PathVariable Long imageId){
            imageService.deleteImageById(imageId);
            return ResponseEntity.ok(new ApiResponse("Successfully Deleted Image!", null));
    }

    @PostMapping("/describe-image")

    public ResponseEntity<ApiResponse> describeImage(@RequestParam("image") MultipartFile image) throws IOException {
        String imageDescription = llmService.describeImage(image);
        return ResponseEntity.ok(new ApiResponse("The image description", imageDescription));
    }

}

