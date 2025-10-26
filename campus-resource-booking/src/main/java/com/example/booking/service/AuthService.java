package com.example.booking.service;

import com.example.booking.domain.UserAccount;
import com.example.booking.repo.UserAccountRepository;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthService {
    private final UserAccountRepository userAccountRepository;

    public AuthService(UserAccountRepository userAccountRepository) {
        this.userAccountRepository = userAccountRepository;
    }

    public Optional<UserAccount> login(String campusCard, String password) {
        return userAccountRepository.findByCampusCard(campusCard)
                .filter(user -> user.getPassword().equals(password));
    }
}

