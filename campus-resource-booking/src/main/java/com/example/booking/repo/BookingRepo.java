
package com.example.booking.repo;

import com.example.booking.domain.Booking;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface BookingRepo extends JpaRepository<Booking, Long> {
    List<Booking> findByUserId(Long userId);
    List<Booking> findByResourceIdAndEndTimeGreaterThanAndStartTimeLessThan(Long resourceId, LocalDateTime start, LocalDateTime end);
}
