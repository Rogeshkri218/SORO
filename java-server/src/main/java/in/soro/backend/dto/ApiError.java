package in.soro.backend.dto;

import java.util.List;

public record ApiError(String error, List<ValidationDetail> details) {
    public record ValidationDetail(String field, String message) {
    }
}
