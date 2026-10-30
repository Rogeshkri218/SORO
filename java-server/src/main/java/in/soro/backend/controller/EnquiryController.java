package in.soro.backend.controller;

import java.time.Instant;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import in.soro.backend.dto.ApiResponse;
import in.soro.backend.dto.EnquiryRequest;
import in.soro.backend.model.Enquiry;
import in.soro.backend.repository.EnquiryRepository;

@RestController
@RequestMapping("/api/enquiries")
public class EnquiryController {
    private final EnquiryRepository repository;

    public EnquiryController(EnquiryRepository repository) {
        this.repository = repository;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ApiResponse<ApiResponse.Created> create(@Valid @RequestBody EnquiryRequest request) {
        if (request.website() != null && !request.website().isBlank()) {
            throw new IllegalArgumentException("Submission rejected.");
        }

        Instant now = Instant.now();
        Enquiry enquiry = repository.save(new Enquiry(
                null,
                request.name().trim(),
                request.email().trim().toLowerCase(),
                emptyIfNull(request.phone()),
                emptyIfNull(request.company()),
                request.subject().trim(),
                request.message().trim(),
                now));

        return new ApiResponse<>(true, new ApiResponse.Created(enquiry.id(), enquiry.createdAt()));
    }

    private static String emptyIfNull(String value) {
        return value == null ? "" : value.trim();
    }
}
