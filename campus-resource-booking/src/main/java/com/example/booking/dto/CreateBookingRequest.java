
package com.example.booking.dto;

import jakarta.validation.constraints.*;
import java.time.LocalDateTime;

public record CreateBookingRequest(
        @NotNull Long resourceId,
        @NotNull LocalDateTime start,
        @NotNull LocalDateTime end,
        @PositiveOrZero long depositCents
) {}
