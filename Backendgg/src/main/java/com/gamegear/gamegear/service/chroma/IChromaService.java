package com.gamegear.gamegear.service.chroma;



import java.util.List;

import static org.springframework.ai.chroma.vectorstore.ChromaApi.*;

public interface IChromaService {
    void deleteCollection(String collectionName);
    List<Collection> getCollections();
    Collection getCollectionById(String collectionName);
    GetEmbeddingResponse getEmbedding(String collectionId);


}
