package org.gucardev.timebasedauth;

import org.springframework.stereotype.Service;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.ByteBuffer;
import java.nio.charset.StandardCharsets;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.time.Instant;

@Service
public class OTPService {

    private static final String HMAC_ALGO = "HmacSHA256";
    public static final int REFRESH_TIME = 5;

    public int generateOTP(String key, long time) throws NoSuchAlgorithmException, InvalidKeyException {
        Mac hmac = Mac.getInstance(HMAC_ALGO);
        SecretKeySpec keySpec = new SecretKeySpec(key.getBytes(StandardCharsets.UTF_8), HMAC_ALGO);
        hmac.init(keySpec);

        byte[] timeBytes = ByteBuffer.allocate(8).putLong(time / REFRESH_TIME).array();
        byte[] hmacResult = hmac.doFinal(timeBytes);

        int offset = hmacResult[hmacResult.length - 1] & 0xf;
        int binary = ((hmacResult[offset] & 0x7f) << 24) | ((hmacResult[offset + 1] & 0xff) << 16)
                | ((hmacResult[offset + 2] & 0xff) << 8) | (hmacResult[offset + 3] & 0xff);

        return binary % 1000000;
    }

    public boolean validateOTP(String key, int otp) {
        long currentTime = Instant.now().getEpochSecond();
        try {
            int serverOTP = generateOTP(key, currentTime);
            return serverOTP == otp;
        } catch (NoSuchAlgorithmException | InvalidKeyException e) {
            e.printStackTrace();
            return false;
        }
    }
}
