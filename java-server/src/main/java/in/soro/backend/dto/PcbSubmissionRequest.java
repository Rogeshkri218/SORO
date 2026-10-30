package in.soro.backend.dto;

import java.util.List;
import java.time.LocalDate;
import java.time.format.DateTimeParseException;

import jakarta.validation.Valid;
import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record PcbSubmissionRequest(
        @NotBlank @Pattern(regexp = "pcb-layout|pcb-design|mechanical-design") String projectType,
        @Size(max = 160) String software,
        @Size(max = 120) String softwareOther,
        @NotBlank @Size(max = 10000) String description,
        @Size(max = 300) String quantity,
        @Size(max = 6) List<@Pattern(regexp = "Schematic source files|PCB layout source files|Gerber / fabrication outputs|Bill of Materials \\(BOM\\)|Assembly drawings|CAD models or drawings") String> deliverables,
        @Size(max = 5000) String constraints,
        @Pattern(regexp = "^$|^\\d{4}-\\d{2}-\\d{2}$") String deadline,
        @Pattern(regexp = "^(?:|Email|Phone call|Other)$") String contactMethod,
        @NotNull @Valid Contact contact,
        @Valid Specifications specifications,
        @Size(max = 200) String website) {

    @AssertTrue(message = "The selected design software is invalid for this project type.")
    public boolean isSoftwareValidForProjectType() {
        if (projectType == null || software == null || software.isBlank()) {
            return true;
        }
        if ("mechanical-design".equals(projectType)) {
            return List.of("Not sure yet", "AutoCAD", "Fusion 360", "SolidWorks", "FreeCAD", "Other").contains(software);
        }
        return List.of("Altium Designer", "KiCad", "Cadence / OrCAD", "Not sure yet").contains(software);
    }

    @AssertTrue(message = "Select a PCB design software or “Not sure yet”.")
    public boolean isPcbSoftwarePresent() {
        return projectType == null
                || "mechanical-design".equals(projectType)
                || (software != null && !software.isBlank());
    }

    @AssertTrue(message = "The deadline must be a valid calendar date in YYYY-MM-DD format.")
    public boolean isDeadlineValid() {
        if (deadline == null || deadline.isBlank()) {
            return true;
        }
        try {
            LocalDate.parse(deadline);
            return true;
        } catch (DateTimeParseException exception) {
            return false;
        }
    }

    public record Contact(
            @NotBlank @Size(max = 120) String fullName,
            @NotBlank @Email @Size(max = 254) String email,
            @NotBlank @Pattern(regexp = "^\\+?[1-9][\\d\\s().-]{5,24}$") String phone,
            @Size(max = 160) String companyName) {
    }

    public record Specifications(
            @Size(max = 120) String dimensions,
            @Size(max = 40) String layers,
            @Size(max = 100) String material,
            @Size(max = 80) String copperThickness,
            @Size(max = 80) String surfaceFinish) {
    }
}
