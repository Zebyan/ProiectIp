#include "soc/gpio_struct.h"   // Gives access to GPIO struct
#include "driver/gpio.h"       // Basic GPIO functionality

unsigned long start, end;
unsigned long arduinoTime, directTime;

#define TEST_PIN 5 // Pick a safe pin (not 0, 1, 6–11, 34–39)

void setup() {
  Serial.begin(115200);
  pinMode(TEST_PIN, INPUT); // Initial pin state
}

void loop() {
  // --- Arduino GPIO Method ---
  start = micros();
  pinMode(TEST_PIN, OUTPUT);
  digitalWrite(TEST_PIN, HIGH);
  digitalWrite(TEST_PIN, LOW);
  pinMode(TEST_PIN, INPUT);
  end = micros();
  arduinoTime = end - start;

  // --- Direct Register Access ---
  uint32_t pinMask = (1UL << TEST_PIN);

  start = micros();
  GPIO.enable_w1ts = pinMask;  // Set as output
  GPIO.out_w1ts = pinMask;     // Set HIGH
  GPIO.out_w1tc = pinMask;     // Set LOW
  GPIO.enable_w1tc = pinMask;  // Set as input (clear output enable)
  end = micros();
  directTime = end - start;

  // --- Print the Results ---
  Serial.print("Arduino pinMode/digitalWrite time: ");
  Serial.print(arduinoTime);
  Serial.print(" us\t| Direct register time: ");
  Serial.print(directTime);
  Serial.println(" us");

  delay(1000);
}
