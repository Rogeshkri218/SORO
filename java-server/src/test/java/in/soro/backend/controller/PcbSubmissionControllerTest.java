package in.soro.backend.controller;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.time.Instant;
import java.util.List;

import in.soro.backend.config.CorsConfig;
import in.soro.backend.exception.GlobalExceptionHandler;
import in.soro.backend.model.PcbSubmission;
import in.soro.backend.repository.PcbSubmissionRepository;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

@WebMvcTest(PcbSubmissionController.class)
@Import({CorsConfig.class, GlobalExceptionHandler.class})
@TestPropertySource(properties = "app.cors.allowed-origins=http://localhost:5173")
class PcbSubmissionControllerTest {
    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private PcbSubmissionRepository repository;

    @Test
    void createsValidPcbSubmissionWithoutFileUpload() throws Exception {
        Instant now = Instant.parse("2026-01-02T03:04:05Z");
        when(repository.save(any(PcbSubmission.class))).thenReturn(
                new PcbSubmission("pcb-id", "pcb-layout", "KiCad", "", "Two-layer sensor board.", "", List.of(),
                        "", null, "", new PcbSubmission.Contact("Test Person", "test@example.invalid",
                        "+1 555 123 4567", ""), new PcbSubmission.Specifications("", "2", "", "", ""),
                        "Pending Review", now));

        mockMvc.perform(post("/api/pcb-submissions")
                        .header("Origin", "http://localhost:5173")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "projectType":"pcb-layout",
                                  "software":"KiCad",
                                  "description":"Two-layer sensor board.",
                                  "contact":{
                                    "fullName":"Test Person",
                                    "email":"test@example.invalid",
                                    "phone":"+1 555 123 4567"
                                  },
                                  "specifications":{"layers":"2"}
                                }
                                """))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.id").value("pcb-id"));
    }

    @Test
    void rejectsInvalidPcbSubmission() throws Exception {
        mockMvc.perform(post("/api/pcb-submissions")
                        .header("Origin", "http://localhost:5173")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "projectType":"pcb-layout",
                                  "software":"unsupported",
                                  "description":"",
                                  "contact":{"fullName":"","email":"invalid","phone":"1"}
                                }
                                """))
                .andExpect(status().isBadRequest());
    }

    @Test
    void rejectsImpossibleCalendarDeadline() throws Exception {
        mockMvc.perform(post("/api/pcb-submissions")
                        .header("Origin", "http://localhost:5173")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "projectType":"pcb-layout",
                                  "software":"KiCad",
                                  "description":"Two-layer sensor board.",
                                  "deadline":"2026-02-31",
                                  "contact":{
                                    "fullName":"Test Person",
                                    "email":"test@example.invalid",
                                    "phone":"+1 555 123 4567"
                                  }
                                }
                                """))
                .andExpect(status().isBadRequest());
    }
}
