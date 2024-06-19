package org.gucardev.timebasedauth;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.gucardev.timebasedauth.dao.UserRepository;
import org.gucardev.timebasedauth.dao.UserSecret;
import org.gucardev.timebasedauth.dao.UserSecretRepository;
import org.gucardev.timebasedauth.dto.LoginRequest;
import org.gucardev.timebasedauth.dto.LoginResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.UUID;

@RestController
@RequestMapping("/api")
@Slf4j
@RequiredArgsConstructor
public class OTPController {

    private final OTPService otpService;
    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final UserSecretRepository userSecretRepository;

    @GetMapping("/say-hello")
    public ResponseEntity<Object> validateOTP(@RequestParam String name) {
        return ResponseEntity.ok("hello %s !".formatted(name));
    }


    @PostMapping("/validate-otp")
    public ResponseEntity<Boolean> validateOTP(@RequestParam String key, @RequestParam int otp) {
        boolean isValid = otpService.validateOTP(key, otp);
        log.info("Validation result: {}", isValid);
        return ResponseEntity.ok(isValid);
    }

    @GetMapping("/time")
    public long serverTime() {
        var time = Instant.now().getEpochSecond();
        log.info("server time: {}", time);
        return time;
    }

    @PostMapping("/login")
    private ResponseEntity<Object> login(@RequestBody LoginRequest loginRequest) {
        var key = "";
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.getUsername(), loginRequest.getPassword()));
            log.info("Authentication successful {}", loginRequest.getUsername());

            key = UUID.randomUUID().toString().substring(0, 8);
            var user = userSecretRepository.findByUserUsername(loginRequest.getUsername());
            if (user.isPresent()) {
                user.get().setSecret(key);
                userSecretRepository.save(user.get());
            } else {
                UserSecret userSecret = new UserSecret();
                userSecret.setUser(userRepository.findByUsername(loginRequest.getUsername()).get());
                userSecret.setSecret(key);
                userSecretRepository.save(userSecret);
            }

        } catch (Exception e) {
            log.error("Authentication failed", e);
            return ResponseEntity.badRequest().body(Boolean.FALSE);
        }
        return ResponseEntity.ok(new LoginResponse(key));
    }
}
