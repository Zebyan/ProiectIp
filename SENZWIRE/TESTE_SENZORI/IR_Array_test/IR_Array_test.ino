// Define analog IR sensor pins (use ADC1 pins to avoid Wi-Fi/ADC2 conflict)
const int irPins[6] = {25, 26, 12, 15, 14, 13}; // Must be ADC1-capable
const int numSensors = 6;

unsigned long lastReadTime = 0;
const unsigned long readInterval = 500; // 0.5 seconds

void setup() {
  Serial.begin(115200);

  // Set up analog IR sensor pins (ADC pins are input by default, no need for pinMode)
  Serial.println("Starting 6 analog IR sensor monitor...");
}

void loop() {
  unsigned long currentTime = millis();

  if (currentTime - lastReadTime >= readInterval) {
    lastReadTime = currentTime;

    Serial.print("IR Sensor Values: ");
    for (int i = 0; i < numSensors; i++) {
      int value = analogRead(irPins[i]); // Value range: 0–4095
      Serial.print("A");
      Serial.print(irPins[i]);
      Serial.print(": ");
      Serial.print(value);
      Serial.print("  ");
    }
    Serial.println();
  }
}
