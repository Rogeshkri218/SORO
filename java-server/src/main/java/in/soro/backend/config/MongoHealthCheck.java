package in.soro.backend.config;

import org.bson.Document;
import org.springframework.dao.DataAccessException;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.stereotype.Component;

import com.mongodb.MongoException;

@Component
public class MongoHealthCheck {
    private final MongoTemplate mongoTemplate;

    public MongoHealthCheck(MongoTemplate mongoTemplate) {
        this.mongoTemplate = mongoTemplate;
    }

    public boolean isDatabaseAvailable() {
        try {
            mongoTemplate.executeCommand(new Document("ping", 1));
            return true;
        } catch (DataAccessException | MongoException exception) {
            return false;
        }
    }
}
