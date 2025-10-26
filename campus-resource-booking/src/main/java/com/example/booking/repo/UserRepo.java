
package com.example.booking.repo;

import com.example.booking.domain.UserAccount;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepo extends JpaRepository<UserAccount, Long> {}
