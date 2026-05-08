import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.Random;

public class GeoIPTracker {
    private static final String API_ENDPOINT = "http://localhost:5000/api/emails/resolve";
    private static final String TARGET_EMAIL = "suspect1@example.com";
    
    public static void main(String[] args) {
        System.out.println("Starting CSEU Geo-IP Resolution Service (Java Agent)...");
        Random rand = new Random();
        
        while (true) {
            try {
                // Simulate an unresolved IP picking up from the database and resolving it
                String mockIp = String.format("%d.%d.%d.%d", 
                    rand.nextInt(223)+1, rand.nextInt(256), rand.nextInt(256), rand.nextInt(254)+1);
                    
                double lat = 6.9271 + (rand.nextDouble() - 0.5) * 2.0; 
                double lon = 79.8612 + (rand.nextDouble() - 0.5) * 2.0;

                String jsonPayload = String.format(
                    "{\"targetEmail\":\"%s\", \"ip\":\"%s\", " +
                    "\"location\":{\"latitude\":%f,\"longitude\":%f,\"city\":\"Colombo\",\"country\":\"Sri Lanka\"}}",
                    TARGET_EMAIL, mockIp, lat, lon
                );

                URL url = new URL(API_ENDPOINT);
                HttpURLConnection con = (HttpURLConnection) url.openConnection();
                con.setRequestMethod("POST");
                con.setRequestProperty("Content-Type", "application/json");
                con.setDoOutput(true);

                try (OutputStream os = con.getOutputStream()) {
                    byte[] input = jsonPayload.getBytes("utf-8");
                    os.write(input, 0, input.length);			
                }

                int code = con.getResponseCode();
                System.out.println("[+] Resolved IP " + mockIp + " -> (" + lat + ", " + lon + "). Response: " + code);

                // Wait 15 seconds before resolving another dummy IP
                Thread.sleep(15000);
            } catch (Exception e) {
                System.out.println("[-] Error transmitting data: " + e.getMessage());
                try {
                    Thread.sleep(5000);
                } catch(InterruptedException ie) {}
            }
        }
    }
}
