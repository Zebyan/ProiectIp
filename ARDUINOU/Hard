// === Includes ===
#include <QTRSensors.h>           // Pentru senzorii IR analogici (urmărirea liniei)
#include "BluetoothSerial.h"      // Comunicare Bluetooth
#include <WiFi.h>                 // Conectare Wi-Fi
#include <HTTPClient.h>           // Comunicare HTTP cu serverul
#include <list>                   // Pentru lista comenzilor de intersecție
#include <Wire.h>                 // Protocol I2C (folosit pentru PN532)
#include <Adafruit_PN532.h>       // Bibliotecă pentru modulul RFID PN532
#include <freertos/FreeRTOS.h>    // Suport pentru multitasking
#include <freertos/task.h>

// === Pin Definitions ===
#define IN1 20  // Motor dreapta înainte
#define IN2 19  // Motor dreapta înapoi
#define IN3 5   // Motor stânga înainte
#define IN4 8   // Motor stânga înapoi
#define ENA 32  // PWM motor dreapta
#define ENB 33  // PWM motor stânga
#define MAXSPEED 480  // Viteză maximă motoare

#define BUZZER_PIN 13       // Pin buzzer
#define ULTRASONIC_PIN 14   // Pin senzor ultrasonic (trig + echo combinat)
#define FWD_PIN 12          // Pin senzor linie frontal (digital)
#define RFID_SDA 21         // I2C SDA pentru PN532
#define RFID_SCL 22         // I2C SCL pentru PN532
#define PN532_IRQ 2         // IRQ PN532
#define PN532_RESET 3       // Reset PN532

// === Wi-Fi and Cloud ===
const char* ssid = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";
const char* updateURL = "http://your-cloud-endpoint.com/update";
const char* errorURL = "http://your-cloud-endpoint.com/error";
const char* arriveURL = "http://your-cloud-endpoint.com/arrived";
const char* rfidURL = "http://your-cloud-endpoint.com/rfid";
const char* confirmURL = "http://your-cloud-endpoint.com/confirm";
const char* routeURL = "http://your-cloud-endpoint.com/route"; // Endpoint pentru noi rute

BluetoothSerial SerialBT;                     // Instanță pentru Bluetooth
Adafruit_PN532 nfc(PN532_IRQ, PN532_RESET, &Wire); // Instanță PN532 pe I2C
QTRSensors qtr;                              // Instanță senzori IR analogici
TaskHandle_t buzzerTaskHandle = NULL;        // Handler pentru task-ul buzzer

bool sound_check = false;                    // Verificare stare buzzer
bool onoff = true;                           // Mod automat activat implicit
bool hasArrived = false;                     // Verificare dacă a ajuns la destinație

volatile float distance = -1;                // Distanță detectată (ultrasonic)

// Comenzi de intersecție: 0=înainte, 1=dreapta, 2=înapoi, 3=stânga, 5=180°
std::list<int> intersectionCommands;

const int NUM_SENSORS = 6;
uint16_t sensorValues[NUM_SENSORS];          // Valorile de la senzorii QTR
int lfspeed = 230;                           // Viteză de bază urmărire linie

// PID variables pentru corecția direcției
float Kp = 0.8, Ki = 0.0, Kd = 0.2;
int P = 0, I = 0, D = 0, error = 0, previousError = 0;

// === Motor Control ===
void setMotors(int leftSpeed, int rightSpeed) {
  // Setare sens și viteză motoare
  digitalWrite(IN1, rightSpeed > 0);
  digitalWrite(IN2, rightSpeed < 0);
  digitalWrite(IN3, leftSpeed > 0);
  digitalWrite(IN4, leftSpeed < 0);
  analogWrite(ENA, abs(rightSpeed));
  analogWrite(ENB, abs(leftSpeed));
}

// Funcții auxiliare pentru mișcări
void forward(int ls = MAXSPEED, int rs = MAXSPEED) { setMotors(ls, rs); }
void backward(int ls = MAXSPEED, int rs = MAXSPEED) { setMotors(-ls, -rs); }
void left(int ls = 200, int rs = 200) { setMotors(-ls, rs); }
void right(int ls = 200, int rs = 200) { setMotors(ls, -rs); }

void turn180() {
  // Rotație la 180 de grade
  setMotors(-MAXSPEED, MAXSPEED);
  delay(800); // Ajustează în funcție de robot
  setMotors(0, 0);
}

void frana() { setMotors(0, 0); } // Oprire completă

// === Distance Sensor Task ===
void distanceTask(void* param) {
  // Măsurare distanță la obstacole
  for (;;) {
    pinMode(ULTRASONIC_PIN, OUTPUT);
    digitalWrite(ULTRASONIC_PIN, LOW);
    delayMicroseconds(2);
    digitalWrite(ULTRASONIC_PIN, HIGH);
    delayMicroseconds(10);
    digitalWrite(ULTRASONIC_PIN, LOW);
    pinMode(ULTRASONIC_PIN, INPUT);
    long duration = pulseIn(ULTRASONIC_PIN, HIGH, 30000);
    if (duration > 0) distance = duration * 0.0343 / 2;
    delay(100);
  }
}

// === Buzzer Task ===
void buzzerTask(void* param) {
  // Emite tonuri alternante
  pinMode(BUZZER_PIN, OUTPUT);
  while (true) {
    tone(BUZZER_PIN, 440); // Wee
    vTaskDelay(pdMS_TO_TICKS(500));
    tone(BUZZER_PIN, 880); // Woo
    vTaskDelay(pdMS_TO_TICKS(500));
    noTone(BUZZER_PIN);
    vTaskDelay(pdMS_TO_TICKS(100));
  }
}

// === Cloud Communication ===
void sendMessage(const char* url, const String& msg) {
  if (WiFi.status() != WL_CONNECTED) return;
  HTTPClient http;
  http.begin(url);
  http.addHeader("Content-Type", "application/json");
  String payload = "{\"message\": \"" + msg + "\"}";
  http.POST(payload);
  http.end();
}

void sendRFID(String tagId) {
  // Trimite ID-ul RFID către server
  if (WiFi.status() != WL_CONNECTED) return;
  HTTPClient http;
  http.begin(rfidURL);
  http.addHeader("Content-Type", "application/json");
  String payload = "{\"rfid\": \"" + tagId + "\"}";
  http.POST(payload);
  http.end();
}

bool waitForConfirmation() {
  // Așteaptă răspuns de la server că tag-ul RFID a fost validat
  HTTPClient http;
  http.begin(confirmURL);
  int code = http.GET();
  bool confirmed = (code == 200 && http.getString() == "confirmed");
  http.end();
  return confirmed;
}

void fetchNewRoute() {
  // Obține o nouă secvență de comenzi de intersecție
  HTTPClient http;
  http.begin(routeURL);
  int httpCode = http.GET();
  if (httpCode == 200) {
    String payload = http.getString();
    intersectionCommands.clear();
    for (int i = 0; i < payload.length(); i++) {
      if (isdigit(payload[i])) {
        intersectionCommands.push_back(payload[i] - '0');
      }
    }
    turn180();           // întoarce robotul pentru a merge înapoi
    hasArrived = false;  // resetare stare sosire
  }
  http.end();
}

// === RFID Reading ===
void readRFID() {
  // Citește un tag RFID și cere o nouă rută
  uint8_t uid[7];
  uint8_t uidLength;
  while (!nfc.readPassiveTargetID(PN532_MIFARE_ISO14443A, uid, &uidLength)) delay(500);
  String tagID = "";
  for (uint8_t i = 0; i < uidLength; i++) tagID += String(uid[i], HEX);
  sendRFID(tagID);
  while (!waitForConfirmation()) delay(1000);
  fetchNewRoute();
}

// === PID Line Following ===
void PID_Linefollow(int err) {
  // Algoritm PID pentru urmărirea liniei negre
  P = err;
  I += err;
  D = err - previousError;
  previousError = err;
  float PIDvalue = Kp * P + Ki * I + Kd * D;
  int leftPWM = lfspeed - PIDvalue;
  int rightPWM = lfspeed + PIDvalue;
  setMotors(leftPWM, rightPWM);
}

// === Intersection Handling ===
void checkIntersection() {
  // Detectează intersecții și execută comenzi din listă
  bool leftT = sensorValues[0] > 800 && sensorValues[1] > 800;
  bool rightT = sensorValues[4] > 800 && sensorValues[5] > 800;
  bool center = digitalRead(FWD_PIN) == HIGH;

  if ((((leftT || rightT ) && center ) || (leftT&&rightT)) && !intersectionCommands.empty()) {
    int cmd = intersectionCommands.front();
    intersectionCommands.pop_front();
    sendMessage(updateURL, "passed intersection");
    switch (cmd) {
      case 0: forward(); break;
      case 1: right(); delay(400); break;
      case 2: backward(); delay(400); break;
      case 3: left(); delay(400); break;
      case 5: turn180(); break;
    }
  }
}

// === Automated Mode ===
void automatedControl() {
  // Comportament complet automat
  if (distance > 0 && distance < 15) {
    frana(); // Oprire dacă obstacolul e aproape
    sendMessage(errorURL, "obstacle detected");
    return;
  }

  qtr.read(sensorValues);
  int position = qtr.readLineBlack(sensorValues); // Citește poziția liniei negre
  error = 2500 - position; // Erorile sunt calculate față de centru
  PID_Linefollow(error); // Ajustează vitezele motoarelor
  checkIntersection(); // Verifică dacă e la o intersecție

  if (intersectionCommands.empty() && !hasArrived) {
    hasArrived = true;
    sendMessage(arriveURL, "arrived");
    readRFID(); // Citește RFID pentru următoarea rută
  }
}

// === Setup ===
void setup() {
  Serial.begin(115200);
  SerialBT.begin("ESP32_BT"); // Bluetooth activ
  WiFi.begin(ssid, password); // Conectare Wi-Fi
  while (WiFi.status() != WL_CONNECTED) delay(500);

  Wire.begin(RFID_SDA, RFID_SCL); // Inițializare I2C
  nfc.begin();
  if (!nfc.getFirmwareVersion()) {
    Serial.println("Didn't find PN53x board");
    while (1);
  }
  nfc.SAMConfig(); // Configurare PN532

  qtr.setTypeAnalog(); // Senzori analogici
  qtr.setSensorPins((const uint8_t[]){26, 36, 37, 38, 39, 25}, NUM_SENSORS); // Pini QTR
  for (int i = 0; i < 250; i++) qtr.calibrate(); // Calibrare senzori

  // Pini pentru control motoare
  pinMode(IN1, OUTPUT); pinMode(IN2, OUTPUT);
  pinMode(IN3, OUTPUT); pinMode(IN4, OUTPUT);
  pinMode(FWD_PIN, INPUT); // Linie frontală

  // Creează task-uri pentru senzor și buzzer
  xTaskCreatePinnedToCore(distanceTask, "dist", 2048, NULL, 1, NULL, 1);
  xTaskCreatePinnedToCore(buzzerTask, "buzz", 2048, NULL, 1, &buzzerTaskHandle, 1);
  vTaskSuspend(buzzerTaskHandle); // Dezactivează buzzer la început

  fetchNewRoute(); // Obține prima rută
}

// === Main Loop ===
void loop() {
  // Control manual prin Bluetooth
  if (SerialBT.available()) {
    char cmd = SerialBT.read();
    switch (cmd) {
      case 'F': forward(); break;
      case 'B': backward(); break;
      case 'L': left(); break;
      case 'R': right(); break;
      case 'O':
        // Activare/dezactivare buzzer
        if (sound_check) {
          noTone(BUZZER_PIN);
          vTaskSuspend(buzzerTaskHandle);
          sound_check = false;
        } else {
          vTaskResume(buzzerTaskHandle);
          sound_check = true;
        }
        break;
      case 'T': turn180(); break;
      case 'M': // Toggle auto/manual
        onoff = !onoff;
        Serial.println(onoff ? "Switched to AUTO mode" : "Switched to MANUAL mode");
        break;
      default: frana(); break;
    }
  }

  // Execută comportament automat
  if (onoff) {
    automatedControl();
  } else {
    frana();
  }

  delay(50); // Delay între iterații
}
