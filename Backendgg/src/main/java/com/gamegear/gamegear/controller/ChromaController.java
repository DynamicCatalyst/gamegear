package com.gamegear.gamegear.controller;


import com.gamegear.gamegear.response.ApiResponse;
import com.gamegear.gamegear.service.chroma.IChromaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static org.springframework.ai.chroma.vectorstore.ChromaApi.*;

@RequiredArgsConstructor
@RestController
@RequestMapping("${api.prefix}/collections")
public class ChromaController {
    private final IChromaService chromaService;

    @GetMapping
    public ResponseEntity<ApiResponse> getAllCollections(){
        List<Collection> collections = chromaService.getCollections();
        return ResponseEntity.ok(new ApiResponse("Collections found!", collections));
    }

    @DeleteMapping("/{collectionName}/delete")
    public ResponseEntity<ApiResponse> deleteCollection( @PathVariable String collectionName){
        chromaService.deleteCollection(collectionName);
        return ResponseEntity.ok(new ApiResponse("Collection Deleted! ", collectionName));
    }

    @GetMapping("/{collectionId}/embeddings")
    public ResponseEntity<ApiResponse> getAllCollectionEmbeddings(@PathVariable  String collectionId){
        GetEmbeddingResponse embedding  =chromaService.getEmbedding(collectionId);
        return ResponseEntity.ok(new ApiResponse("Embedding found!", embedding));
    }
}
