package org.gucardev.timebasedauth.dao;

import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class Startup implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        createDummyData();
    }

    private void createDummyData() {

        User admin = new User();
        admin.setName("admin");
        admin.setUsername("admin");
        admin.setPassword(passwordEncoder.encode("pass"));
        admin.setRole(Role.ROLE_ADMIN);
        userRepository.save(admin);

        User user = new User();
        user.setName("user");
        user.setUsername("user");
        user.setPassword(passwordEncoder.encode("pass"));
        user.setRole(Role.ROLE_USER);
        userRepository.save(user);

    }
}
