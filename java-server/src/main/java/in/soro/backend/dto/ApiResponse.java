package in.soro.backend.dto;

import java.time.Instant;

public record ApiResponse<T>(boolean success, T data) {
    public record Created(String id, Instant createdAt) {
    }

    public record PcbCreated(String id, String status, Instant createdAt) {
    }
}
