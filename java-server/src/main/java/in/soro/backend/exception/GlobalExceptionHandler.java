package in.soro.backend.exception;

import java.util.List;

import jakarta.servlet.http.HttpServletRequest;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import in.soro.backend.dto.ApiError;

@RestControllerAdvice
public class GlobalExceptionHandler {
    private static final Logger logger = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiError> handleValidation(MethodArgumentNotValidException exception) {
        List<ApiError.ValidationDetail> details = exception.getBindingResult().getFieldErrors().stream()
                .map(error -> new ApiError.ValidationDetail(error.getField(), error.getDefaultMessage()))
                .toList();
        return ResponseEntity.badRequest().body(new ApiError("Please check the submitted fields.", details));
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<ApiError> handleInvalidJson(HttpMessageNotReadableException exception) {
        return ResponseEntity.badRequest().body(new ApiError("Request JSON is invalid.", List.of()));
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ApiError> handleRejectedSubmission(IllegalArgumentException exception) {
        return ResponseEntity.badRequest().body(new ApiError(exception.getMessage(), List.of()));
    }

    @ExceptionHandler(DataAccessException.class)
    public ResponseEntity<ApiError> handleDatabaseFailure(DataAccessException exception) {
        logger.error("MongoDB request failed: {}", exception.getClass().getSimpleName());
        return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE)
                .body(new ApiError("The database is temporarily unavailable.", List.of()));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiError> handleUnexpectedFailure(Exception exception, HttpServletRequest request) {
        logger.error("Request {} {} failed: {}", request.getMethod(), request.getRequestURI(),
                exception.getClass().getSimpleName());
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ApiError("The request could not be completed.", List.of()));
    }
}
