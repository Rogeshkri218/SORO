package in.soro.backend.model;

import java.time.Instant;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "enquiries")
public record Enquiry(
        @Id String id,
        String name,
        String email,
        String phone,
        String company,
        String subject,
        String message,
        Instant createdAt) {
}
