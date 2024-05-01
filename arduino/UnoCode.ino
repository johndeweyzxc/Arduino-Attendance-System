#include <MFRC522.h>
#include <SoftwareSerial.h>
#include <LiquidCrystal.h>
#include <LiquidCrystal_I2C.h>

// Define the pins for the SPI interface to the MFRC522
#define SS_PIN 10
#define RST_PIN 9

// Initialize LCD
LiquidCrystal_I2C lcd(0x27, 16, 2);

// Initialize RFID instance
SoftwareSerial ArduinoUno(3, 2);
MFRC522 mfrc522(SS_PIN, RST_PIN);

// Function to read UID from NFC tag
String readUID()
{
    // Look for new cards
    if (!mfrc522.PICC_IsNewCardPresent())
    {
        Serial.println("No card is present...");
        return ""; // Return an empty string if no card is present
    }

    // Select one of the cards
    if (!mfrc522.PICC_ReadCardSerial())
    {
        Serial.println("Reading card fails...");
        return ""; // Return an empty string if card reading fails
    }

    // Concatenate the bytes of the UID into a string with spaces
    String uidTag = "";
    for (byte i = 0; i < mfrc522.uid.size; i++)
    {
        Serial.print(mfrc522.uid.uidByte[i] < 0x10 ? " 0" : " ");
        Serial.print(mfrc522.uid.uidByte[i], HEX);
        uidTag.concat(String(mfrc522.uid.uidByte[i] < 0x10 ? " 0" : " "));
        uidTag.concat(String(mfrc522.uid.uidByte[i], HEX));
    }
    uidTag.toUpperCase();

    return uidTag;
}

void setup()
{
    // put your setup code here, to run once:
    Serial.begin(115200);
    ArduinoUno.begin(4800);
    pinMode(3, INPUT);
    pinMode(2, OUTPUT);

    SPI.begin();
    mfrc522.PCD_Init();

    lcd.begin();
    lcd.backlight();
    lcd.clear();
    lcd.setCursor(4, 0); // Adjusted the cursor position
    lcd.print("GROUP 4");
    lcd.setCursor(2, 1);
    lcd.print("Attendance System");

    delay(3000);
}

void loop()
{
    // put your main code here, to run repeatedly:
    // Read UID and send to server repeatedly
    lcd.setCursor(0, 0);
    lcd.print("TAP NFC CARD");

    String uidTag = readUID();
    Serial.println("UID Tag: ");
    Serial.println(uidTag);

    if (uidTag != "")
    {
        Serial.print("Sending UID tag: ");
        Serial.println(uidTag);

        ArduinoUno.print(uidTag + '\n');

        lcd.setCursor(0, 1);
        lcd.clear();
        lcd.setCursor(2, 1);
        lcd.print("TAPPED " + uidTag);
        lcd.setCursor(1, 1);
        delay(1500);
    }

    delay(100); // Delay between each read attempt
}