package org.gucardev.timebasedauth.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NonNull;

@Data
@AllArgsConstructor
@NonNull
public class LoginResponse {
    private String key;
}
