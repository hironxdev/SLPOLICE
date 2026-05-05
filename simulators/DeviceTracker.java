import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.Random;

public class DeviceTracker {
    private static final String API_ENDPOINT = "http://localhost:5000/api/devices/track";
    private static final String IMEI = "359881030310000";
    
    public static void main(String[] args) {
        System.out.println("Starting CCID Device Tracking Simulator (Java Agent)...");
        Random rand = new Random();
        double baseLat = 6.9271; // Colombo, Sri Lanka
        double baseLon = 79.8612;

        while (true) {
            try {
                // Determine simulated movement
                baseLat += (rand.nextDouble() - 0.5) * 0.001;
                baseLon += (rand.nextDouble() - 0.5) * 0.001;

                String jsonPayload = String.format(
                    "{\"imei\":\"%s\",\"model\":\"Samsung Galaxy S22\",\"os\":\"Android 13\",\"targetName\":\"Alpha-T\", " +
                    "\"location\":{\"latitude\":%f,\"longitude\":%f}, " +
                    "\"connection\":{\"ip\":\"192.168.1.%d\",\"networkType\":\"WIFI\"}}",
                    IMEI, baseLat, baseLon, rand.nextInt(254) + 1
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
                System.out.println("[+] Sent tracking pulse. Response Code: " + code);

                // Wait 10 seconds before next pulse
                Thread.sleep(10000);
            } catch (Exception e) {
                System.out.println("[-] Error transmitting data: " + e.getMessage());
                try {
                    Thread.sleep(5000);
                } catch(InterruptedException ie) {}
            }
        }
    }
}
