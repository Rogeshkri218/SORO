package in.soro.backend.controller;

import java.time.Instant;
import java.time.LocalDate;
import java.util.List;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import in.soro.backend.dto.ApiResponse;
import in.soro.backend.dto.PcbSubmissionRequest;
import in.soro.backend.model.PcbSubmission;
import in.soro.backend.repository.PcbSubmissionRepository;

@RestController
@RequestMapping("/api/pcb-submissions")
public class PcbSubmissionController {
    private final PcbSubmissionRepository repository;

    public PcbSubmissionController(PcbSubmissionRepository repository) {
        this.repository = repository;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ApiResponse<ApiResponse.PcbCreated> create(@Valid @RequestBody PcbSubmissionRequest request) {
        if (request.website() != null && !request.website().isBlank()) {
            throw new IllegalArgumentException("Submission rejected.");
        }

        Instant now = Instant.now();
        PcbSubmission.Contact contact = new PcbSubmission.Contact(
                request.contact().fullName().trim(),
                request.contact().email().trim().toLowerCase(),
                request.contact().phone().trim(),
                emptyIfNull(request.contact().companyName()));
        PcbSubmissionRequest.Specifications requestSpecifications = request.specifications();
        PcbSubmission.Specifications specifications = requestSpecifications == null
                ? new PcbSubmission.Specifications("", "", "", "", "")
                : new PcbSubmission.Specifications(
                        emptyIfNull(requestSpecifications.dimensions()),
                        emptyIfNull(requestSpecifications.layers()),
                        emptyIfNull(requestSpecifications.material()),
                        emptyIfNull(requestSpecifications.copperThickness()),
                        emptyIfNull(requestSpecifications.surfaceFinish()));

        PcbSubmission submission = repository.save(new PcbSubmission(
                null,
                request.projectType(),
                emptyIfNull(request.software()),
                emptyIfNull(request.softwareOther()),
                request.description().trim(),
                emptyIfNull(request.quantity()),
                request.deliverables() == null ? List.of() : List.copyOf(request.deliverables()),
                emptyIfNull(request.constraints()),
                parseDeadline(request.deadline()),
                emptyIfNull(request.contactMethod()),
                contact,
                specifications,
                "Pending Review",
                now));

        return new ApiResponse<>(true,
                new ApiResponse.PcbCreated(submission.id(), submission.status(), submission.createdAt()));
    }

    private static LocalDate parseDeadline(String deadline) {
        return deadline == null || deadline.isBlank() ? null : LocalDate.parse(deadline);
    }

    private static String emptyIfNull(String value) {
        return value == null ? "" : value.trim();
    }
}
