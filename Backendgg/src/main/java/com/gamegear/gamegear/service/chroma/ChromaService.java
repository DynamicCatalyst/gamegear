package com.gamegear.gamegear.service.chroma;

import com.gamegear.gamegear.service.llm.LLMService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.ai.chroma.vectorstore.ChromaApi;
import org.springframework.ai.chroma.vectorstore.ChromaVectorStore;
import org.springframework.ai.document.Document;
import org.springframework.ai.vectorstore.SearchRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;

import static org.springframework.ai.chroma.vectorstore.ChromaApi.*;
import static org.springframework.ai.chroma.vectorstore.ChromaApi.QueryRequest.Include.all;

@Service
@RequiredArgsConstructor
public class ChromaService implements IChromaService{
    private static final Logger log = LoggerFactory.getLogger(ChromaService.class);
    private final ChromaApi chromaApi;
    private final LLMService llmService;
    private final ChromaVectorStore chromaVectorStore;

    @Value("default_tenant")
    private String tenantName;

    @Value("default_database")
    private String databaseName;

    @Override
    public void deleteCollection(String collectionName) {
        try{
            chromaApi.deleteCollection(tenantName,databaseName,collectionName);

        }catch (Exception e){
            throw new RuntimeException("Failed to delete collection: "+ collectionName ,e);
        }

    }

    @Override
    public List<Collection> getCollections() {
        List<Collection> collections;
        try {
            collections = Objects.requireNonNull(chromaApi.listCollections(tenantName, databaseName))
                    .stream().toList();
        } catch (Exception e) {
            throw new RuntimeException("Failed to get Collection");
        }
        return collections;
    }

    @Override
    public Collection getCollectionById(String collectionName){
        Collection collection = chromaApi.getCollection(tenantName,databaseName,collectionName);
        if(collection == null){
            throw new EntityNotFoundException("No Collection Found With Name : "+ collectionName + "!");
        }
        return collection;
    }

    @Override
    public GetEmbeddingResponse getEmbedding(String collectionId) {
        try{
            ChromaApi.GetEmbeddingsRequest request = new ChromaApi.GetEmbeddingsRequest(
                    null,
                    null,
                    4,
                    0,
                    all
            );
            log.info("This is th request {} : ", request);
            log.info("This is th collectionId {} : ", collectionId);
            return chromaApi.getEmbeddings(tenantName, databaseName, collectionId, request);
        }
        catch(Exception e){
            throw new RuntimeException("Failed to get embedding: "+collectionId);
        }
    }


    public String saveEmbeddings(MultipartFile image, Long productId) throws IOException {
        String imageDescription = llmService.describeImage(image);
        Map<String, Object> metadata   = new HashMap<>();
        metadata.put("productId", productId);
        log.info("ProductId {} :", productId);
        var document = Document.builder().id(productId.toString())
                .text(imageDescription)
                .metadata(metadata)
                .build();
        log.info("document list {} :", List.of(document));
        try{
            chromaVectorStore.doAdd(List.of(document));
        }catch(Exception e){
            throw new RuntimeException(e.getMessage());
        }
        return "Document added to chroma store successfully!";
    }
    public List<Long> searchImageSimilarity(MultipartFile image) throws IOException {
        String imageDescription = llmService.describeImage(image);
        SearchRequest searchRequest = SearchRequest.builder()
                .query(imageDescription)
                .topK(10)
                .similarityThreshold(0.85f)
                .build();
        List<Document> searchResult = chromaVectorStore.doSimilaritySearch(searchRequest);

        searchResult.forEach(doc -> {
            Double score  = doc.getScore();

            Double distance = null;
            Object distanceObj = doc.getMetadata().get("distance");
            if(distanceObj!= null){
                distance = Double.parseDouble(distanceObj.toString());
            }

            Object productId = doc.getMetadata().get("productId");
            log.info("search image similarity score: {} , Product Id : {} , Distance : {}  ", score, productId, distance);
        });

        return searchResult.stream()
                .map(doc -> doc.getMetadata().get("productId"))
                .filter(Objects::nonNull)
                .map(Object::toString)
                .map(Long::parseLong)
                .collect(Collectors.toList());
    }

}
