package in.soro.backend.model;

import java.time.Instant;
import java.time.LocalDate;
import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "pcb_submissions")
public record PcbSubmission(
        @Id String id,
        String projectType,
        String software,
        String softwareOther,
        String description,
        String quantity,
        List<String> deliverables,
        String constraints,
        LocalDate deadline,
        String contactMethod,
        Contact contact,
        Specifications specifications,
        String status,
        Instant createdAt) {

    public record Contact(String fullName, String email, String phone, String companyName) {
    }

    public record Specifications(
            String dimensions,
            String layers,
            String material,
            String copperThickness,
            String surfaceFinish) {
    }
}
