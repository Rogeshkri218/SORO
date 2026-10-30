package in.soro.backend.repository;

import java.util.Optional;

import org.bson.Document;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.stereotype.Repository;

import in.soro.backend.model.UserDocument;

@Repository
public class UserRepository {
    private static final String COLLECTION = "users";
    private final MongoTemplate mongoTemplate;

    public UserRepository(MongoTemplate mongoTemplate) {
        this.mongoTemplate = mongoTemplate;
    }

    public Optional<UserDocument> findById(Object id) {
        return Optional.ofNullable(mongoTemplate.findById(id, Document.class, COLLECTION))
                .map(UserDocument::new);
    }
}
