package in.soro.backend.controller;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import in.soro.backend.config.CorsConfig;
import in.soro.backend.config.MongoHealthCheck;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

@WebMvcTest(HealthController.class)
@Import(CorsConfig.class)
@TestPropertySource(properties = "app.cors.allowed-origins=http://localhost:5173")
class HealthControllerTest {
    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private MongoHealthCheck mongoHealthCheck;

    @Test
    void reportsReadyWhenMongoResponds() throws Exception {
        when(mongoHealthCheck.isDatabaseAvailable()).thenReturn(true);

        mockMvc.perform(get("/api/health"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("UP"))
                .andExpect(jsonPath("$.database").value("connected"));
    }

    @Test
    void reportsUnavailableWhenMongoDoesNotRespond() throws Exception {
        when(mongoHealthCheck.isDatabaseAvailable()).thenReturn(false);

        mockMvc.perform(get("/api/health"))
                .andExpect(status().isServiceUnavailable())
                .andExpect(jsonPath("$.status").value("DEGRADED"))
                .andExpect(jsonPath("$.database").value("disconnected"));
    }
}
