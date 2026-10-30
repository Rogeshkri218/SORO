package in.soro.backend.controller;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.time.Instant;

import in.soro.backend.config.CorsConfig;
import in.soro.backend.exception.GlobalExceptionHandler;
import in.soro.backend.model.Enquiry;
import in.soro.backend.repository.EnquiryRepository;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

@WebMvcTest(EnquiryController.class)
@Import({CorsConfig.class, GlobalExceptionHandler.class})
@TestPropertySource(properties = "app.cors.allowed-origins=http://localhost:5173")
class EnquiryControllerTest {
    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private EnquiryRepository repository;

    @Test
    void createsValidEnquiry() throws Exception {
        Instant now = Instant.parse("2026-01-02T03:04:05Z");
        when(repository.save(any(Enquiry.class))).thenReturn(
                new Enquiry("enquiry-id", "Test Person", "test@example.invalid", "", "", "Design question",
                        "Please contact me about an engineering project.", now));

        mockMvc.perform(post("/api/enquiries")
                        .header("Origin", "http://localhost:5173")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "name":"Test Person",
                                  "email":"test@example.invalid",
                                  "subject":"Design question",
                                  "message":"Please contact me about an engineering project."
                                }
                                """))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.id").value("enquiry-id"));
    }

    @Test
    void rejectsInvalidEnquiryWithoutSaving() throws Exception {
        mockMvc.perform(post("/api/enquiries")
                        .header("Origin", "http://localhost:5173")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "name":"",
                                  "email":"invalid",
                                  "subject":"Hi",
                                  "message":"short"
                                }
                                """))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.details.length()").value(org.hamcrest.Matchers.greaterThan(0)));
    }

    @Test
    void rejectsUnconfiguredCorsOrigin() throws Exception {
        mockMvc.perform(post("/api/enquiries")
                        .header("Origin", "https://untrusted.example")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{}"))
                .andExpect(status().isForbidden());

        verifyNoInteractions(repository);
    }
}
