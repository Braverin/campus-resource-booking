
package com.example.booking.repo;

import com.example.booking.domain.ResourceEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ResourceRepo extends JpaRepository<ResourceEntity, Long> {}
