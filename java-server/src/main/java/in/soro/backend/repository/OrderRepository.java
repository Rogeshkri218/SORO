package in.soro.backend.repository;

import java.util.Optional;

import org.bson.Document;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.stereotype.Repository;

import in.soro.backend.model.OrderDocument;

@Repository
public class OrderRepository {
    private static final String COLLECTION = "orders";
    private final MongoTemplate mongoTemplate;

    public OrderRepository(MongoTemplate mongoTemplate) {
        this.mongoTemplate = mongoTemplate;
    }

    public Optional<OrderDocument> findById(Object id) {
        return Optional.ofNullable(mongoTemplate.findById(id, Document.class, COLLECTION))
                .map(OrderDocument::new);
    }
}
