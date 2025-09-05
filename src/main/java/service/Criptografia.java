package service;
import java.nio.charset.StandardCharsets;
import java.util.Base64;
import javax.crypto.Cipher;
import javax.crypto.spec.SecretKeySpec;

public class Criptografia {

    private static final String ALGORITMO = "AES/ECB/PKCS5Padding";
    private static final byte[] CHAVE_FIXA = "EuAmoOSsenac1234".getBytes(StandardCharsets.UTF_8); // Lucas, se você for
                                                                                                  // trocar a chave,
                                                                                                  // sempre mantenha em
                                                                                                  // 16 caracteres não                                                                                    // importa o que
                                                                                                  // aconteca
    public static String valor = "";

    public static String criptografar() throws Exception {
        Cipher cipher = Cipher.getInstance(ALGORITMO);
        SecretKeySpec keySpec = new SecretKeySpec(CHAVE_FIXA, "AES");
        cipher.init(Cipher.ENCRYPT_MODE, keySpec);
        byte[] cifrado = cipher.doFinal(valor.getBytes(StandardCharsets.UTF_8));
        valor = Base64.getEncoder().encodeToString(cifrado);
        return valor;
    }

    public static String descriptografar() throws Exception {
        Cipher cipher = Cipher.getInstance(ALGORITMO);
        SecretKeySpec keySpec = new SecretKeySpec(CHAVE_FIXA, "AES");
        cipher.init(Cipher.DECRYPT_MODE, keySpec);
        byte[] decodificado = Base64.getDecoder().decode(valor);
        byte[] decifrado = cipher.doFinal(decodificado);
        valor = new String(decifrado, StandardCharsets.UTF_8);
        return valor;
    }
}
