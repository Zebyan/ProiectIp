#define ULTRASONIC_PIN 19

void setup() {
  Serial.begin(115200);
  pinMode(ULTRASONIC_PIN, OUTPUT);
  digitalWrite(ULTRASONIC_PIN, LOW);
}


void loop() {
  // Step 1: Trigger pulse (send)
  pinMode(ULTRASONIC_PIN, OUTPUT);
  digitalWrite(ULTRASONIC_PIN, LOW);
  delayMicroseconds(2);
  digitalWrite(ULTRASONIC_PIN, HIGH);
  delayMicroseconds(10);
  digitalWrite(ULTRASONIC_PIN, LOW);

  // Step 2: Switch to input to read echo
  pinMode(ULTRASONIC_PIN, INPUT);
  long duration = pulseIn(ULTRASONIC_PIN, HIGH, 10000); // 10ms timeout

  // Step 3: Process result
  if (duration == 0) {
    Serial.println("Timeout - no echo");
  } else {
    float distance = duration * 0.0343 / 2;
    Serial.print("Distance: ");
    Serial.print(distance);
    Serial.println(" cm");
  }

  delay(500); // prevent watchdog reset
}
