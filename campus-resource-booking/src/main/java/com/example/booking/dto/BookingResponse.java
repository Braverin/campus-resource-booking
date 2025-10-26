
package com.example.booking.dto;

import java.time.LocalDateTime;

public record BookingResponse(
        Long id,
        Long resourceId,
        Long userId,
        LocalDateTime start,
        LocalDateTime end,
        String status,
        long depositCents,
        long penaltyCents,
        int creditRequired
) {}
