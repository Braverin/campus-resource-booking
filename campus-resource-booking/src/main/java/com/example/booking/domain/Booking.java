
package com.example.booking.domain;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity @Table(name = "bookings")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Booking {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId;
    private Long resourceId;

    private LocalDateTime startTime;
    private LocalDateTime endTime;

    private String status; // NEW/CANCELLED/COMPLETED

    private long depositCents;
    private long penaltyCents;

    @Version
    private Long version;
}
