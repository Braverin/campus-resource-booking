package com.example.booking.repo;

import com.example.booking.domain.CreditHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CreditHistoryRepository extends JpaRepository<CreditHistory, Long> {
    List<CreditHistory> findByUserIdOrderByCreatedAtDesc(Long userId);
}
