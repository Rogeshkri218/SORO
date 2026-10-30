package in.soro.backend.config;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import org.bson.Document;
import org.junit.jupiter.api.Test;
import org.springframework.dao.DataAccessResourceFailureException;
import org.springframework.data.mongodb.core.MongoTemplate;

class MongoHealthCheckTest {
    private final MongoTemplate mongoTemplate = org.mockito.Mockito.mock(MongoTemplate.class);
    private final MongoHealthCheck healthCheck = new MongoHealthCheck(mongoTemplate);

    @Test
    void executesMongoPingToCheckDatabaseAvailability() {
        when(mongoTemplate.executeCommand(new Document("ping", 1))).thenReturn(new Document("ok", 1));

        assertTrue(healthCheck.isDatabaseAvailable());
        verify(mongoTemplate).executeCommand(new Document("ping", 1));
    }

    @Test
    void reportsUnavailableWhenMongoPingFails() {
        when(mongoTemplate.executeCommand(new Document("ping", 1)))
                .thenThrow(new DataAccessResourceFailureException("MongoDB unavailable"));

        assertFalse(healthCheck.isDatabaseAvailable());
        verify(mongoTemplate).executeCommand(new Document("ping", 1));
    }
}
