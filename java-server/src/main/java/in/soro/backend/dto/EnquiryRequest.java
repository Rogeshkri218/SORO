package in.soro.backend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record EnquiryRequest(
        @NotBlank @Size(max = 120) String name,
        @NotBlank @Email @Size(max = 254) String email,
        @Pattern(regexp = "^$|^\\+?[1-9][\\d\\s().-]{5,24}$") @Size(max = 40) String phone,
        @Size(max = 160) String company,
        @NotBlank @Size(min = 3, max = 180) String subject,
        @NotBlank @Size(min = 20, max = 5000) String message,
        @Size(max = 200) String website) {
}
