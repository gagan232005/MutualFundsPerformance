package com.gagan.mutualfunds.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.Instant;
import java.util.LinkedHashMap;
import java.util.Map;

/**
 * Centralized error handling so the API returns clean, consistent JSON
 * error bodies (with the right HTTP status) instead of either a raw
 * Spring stack-trace page or -- as the previous version of this project
 * did -- silently swallowing the exception and returning an empty/zeroed
 * payload that looks like a valid but wrong answer.
 */
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(FundDataException.class)
    public ResponseEntity<Map<String, Object>> handleFundDataException(FundDataException ex) {
        return ResponseEntity.status(HttpStatus.BAD_GATEWAY).body(errorBody(ex.getMessage()));
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Map<String, Object>> handleBadRequest(IllegalArgumentException ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorBody(ex.getMessage()));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, Object>> handleGeneric(Exception ex) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(errorBody("Something went wrong while processing your request."));
    }

    private Map<String, Object> errorBody(String message) {
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("timestamp", Instant.now().toString());
        body.put("error", message != null ? message : "Unexpected error");
        return body;
    }
}
