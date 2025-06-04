#include <Wire.h>
#include <Adafruit_PN532.h>

#define SDA_PIN 21
#define SCL_PIN 22

Adafruit_PN532 nfc(SDA_PIN, SCL_PIN);

#define SESSION_TIMEOUT 300000UL  // 5 minute în milisecunde

// Cartele farmacist (UID 4 bytes)
const uint8_t farmacisti[][4] = {
  { 0x74, 0x2B, 0x35, 0x02 },
  { 0xD9, 0xD9, 0x86, 0x4F },
  { 0xF4, 0x22, 0x87, 0x4F },
  { 0x24, 0xD, 0xEF, 0x9F },
  { 0x96, 0x40, 0xF0, 0x9F },
  { 0xD3, 0xC, 0xF0, 0x9F },
  { 0x04, 0x11, 0x22, 0x33 },
  { 0x93, 0xFF, 0x9F, 0x2C },
};
const int numarFarmacisti = sizeof(farmacisti) / sizeof(farmacisti[0]);

// Medicamente (UID 7 bytes)
struct Medicament {
  const char* nume;
  uint8_t uid[7];
};

Medicament medicamente[] = {
  { "Paracetamol", { 0x4, 0xC6, 0x43, 0xA, 0xBE, 0x2A, 0x81 } },
  { "Ibuprofen", { 0x4, 0xC7, 0x43, 0xA, 0xBE, 0x2A, 0x81 } },
};
const int numarMedicamente = sizeof(medicamente) / sizeof(medicamente[0]);

// Sesiune
bool sesiuneActiva = false;
unsigned long startSesiune = 0;

bool comparaUID(const uint8_t* uid1, const uint8_t* uid2, uint8_t len) {
  for (uint8_t i = 0; i < len; i++) {
    if (uid1[i] != uid2[i]) return false;
  }
  return true;
}


void setup() {
  Serial.begin(115200);
  Wire.begin(SDA_PIN, SCL_PIN);
  delay(100);
  nfc.begin();

  uint32_t versiondata = nfc.getFirmwareVersion();
  if (!versiondata) {
    Serial.println("PN532 nu a fost detectat!");
    while (1)
      ;
  }

  nfc.SAMConfig();
  Serial.println("Scanare RFID activă...");
}

void loop() {
  uint8_t uid[7];
  uint8_t uidLength;

  // Verificăm expirarea sesiunii
  if (sesiuneActiva && (millis() - startSesiune >= SESSION_TIMEOUT)) {
    sesiuneActiva = false;
    Serial.println("Sesiunea farmacistului a expirat. Va rugăm reautentificare.");
  }

  if (nfc.readPassiveTargetID(PN532_MIFARE_ISO14443A, uid, &uidLength)) {
    Serial.print("UID detectat: ");
    for (int i = 0; i < uidLength; i++) {
      Serial.print("0x");
      Serial.print(uid[i], HEX);
      Serial.print(" ");
    }
    Serial.println();

    if (uidLength == 4) {
      for (int i = 0; i < numarFarmacisti; i++) {
        if (comparaUID(uid, farmacisti[i], 4)) {
          sesiuneActiva = true;
          startSesiune = millis();
          Serial.println("Autentificare farmacist reușită. Sesiune activă 5 minute.");
          delay(1000);  // Anti-repetiție
          return;
        }
      }
      Serial.println("Cartele necunoscută. Acces respins.");
      delay(1000);
    }

    else if (uidLength == 7) {
      if (!sesiuneActiva) {
        Serial.println("Nu este autentificat niciun farmacist. Operație interzisă.");
        delay(1000);
        return;
      }

      bool gasit = false;
      for (int i = 0; i < numarMedicamente; i++) {
        if (comparaUID(uid, medicamente[i].uid, 7)) {
          Serial.print("Medicament adăugat în comandă: ");
          Serial.println(medicamente[i].nume);
          gasit = true;
          break;
        }
      }

      if (!gasit) {
        Serial.println("Medicament necunoscut.");
      }

      delay(1000);  // Anti-bouncing
    }

    else {
      Serial.println("UID de lungime invalidă.");
      delay(1000);
    }
  }
}