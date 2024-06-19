package org.gucardev.timebasedauth;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.gucardev.timebasedauth.dao.UserSecretRepository;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Base64;

@Component
@RequiredArgsConstructor
@Slf4j
public class OtpFilter extends OncePerRequestFilter {

    private final UserDetailsServiceImpl userDetailsService;
    private final UserSecretRepository userSecretRepository;
    private final OTPService otpService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        String header = request.getHeader(HttpHeaders.AUTHORIZATION);

        if (header == null) {
            filterChain.doFilter(request, response);
            return;
        }

        byte[] decodedBytes = Base64.getDecoder().decode(header);
        var decodedString = new String(decodedBytes);
        var username = decodedString.split(":")[0];
        var otp = Integer.parseInt(decodedString.split(":")[1]);
        log.info("{} - {}", username, otp);

        var user = userDetailsService.loadUserByUsername(username);

        var userSecret = userSecretRepository.findByUserUsername(user.getUsername());

        if (userSecret.isEmpty()) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            log.error("User secret not found");
            return;
        }

        if (!otpService.validateOTP(userSecret.get().getSecret(), otp)) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            log.error("Invalid OTP");
            return;
        }

        log.info("successfully authenticated");
        filterChain.doFilter(request, response);
    }
}
