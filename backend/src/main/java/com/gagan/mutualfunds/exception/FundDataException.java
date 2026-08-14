package com.gagan.mutualfunds.exception;

/**
 * Raised whenever real fund data (scheme list, NAV history) can't be
 * fetched or is unusable. Deliberately unchecked so service code can throw
 * it without cluttering every method signature; caught centrally by
 * {@link com.gagan.mutualfunds.exception.GlobalExceptionHandler} and turned
 * into a clean JSON error response instead of a raw 500 / silently empty
 * payload.
 */
public class FundDataException extends RuntimeException {

    public FundDataException(String message, Throwable cause) {
        super(message, cause);
    }

    public FundDataException(String message) {
        super(message);
    }
}
