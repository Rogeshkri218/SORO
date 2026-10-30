package in.soro.backend.controller;

import java.time.Instant;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import in.soro.backend.config.MongoHealthCheck;

@RestController
public class HealthController {
    private final MongoHealthCheck mongoHealthCheck;

    public HealthController(MongoHealthCheck mongoHealthCheck) {
        this.mongoHealthCheck = mongoHealthCheck;
    }

    @GetMapping("/api/health")
    public ResponseEntity<HealthResponse> health() {
        boolean available = mongoHealthCheck.isDatabaseAvailable();
        HealthResponse response = new HealthResponse(
                available ? "UP" : "DEGRADED",
                available ? "connected" : "disconnected",
                Instant.now());
        return ResponseEntity.status(available ? HttpStatus.OK : HttpStatus.SERVICE_UNAVAILABLE)
                .body(response);
    }

    public record HealthResponse(String status, String database, Instant timestamp) {
    }
}
