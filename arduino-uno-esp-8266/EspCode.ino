#include <SoftwareSerial.h>
#include <ESP8266WiFi.h>

// Do not change port
const int SERVER_PORT = 8080;

// Set the name of your Wi-Fi hotspot here
const char *ssid = "*****";
// Set password of your Wi-Fi hotspot here
const char *password = "*****";
// Server IP should match with the variable "IP_ADDR" in the python script
const char *server_ip = "192.168.100.1";

SoftwareSerial NodeMCU(D2, D3);
WiFiClient client;

void connectToServer()
{
  // Attempt to connect to the TCP socket server
  while (!client.connect(server_ip, SERVER_PORT))
  {
    Serial.println("Connection to server failed. Retrying in 3 seconds...");
    delay(3000);
  }
  Serial.println("Connected to server");
}

void disconnectFromServer()
{
  client.stop();
  Serial.println("Disconnected from server");
}

void connectToWiFi()
{
  // Attempt to connect to the Wi-Fi
  WiFi.begin(ssid, password);
  int attempts = 0;

  while (WiFi.status() != WL_CONNECTED && attempts < 20)
  {
    delay(500);
    Serial.print(".");
    attempts++;
  }

  if (WiFi.status() != WL_CONNECTED)
  {
    Serial.println("Failed to connect to Wi-Fi. Retrying in 3 seconds.");
    delay(3000);
    // Reset the ESP8266 to attempt reconnection
    ESP.restart();
  }

  Serial.println("Connected to Wi-Fi");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());
}

void sendUIDToServer(String uidTag)
{
  connectToServer();
  Serial.println("Sending UID tag: " + String(uidTag));
  client.println(uidTag);
  disconnectFromServer();
}

void setup()
{
  // put your setup code here, to run once:
  Serial.begin(9600);
  NodeMCU.begin(4800);
  connectToWiFi();
}

void loop()
{
  // put your main code here, to run repeatedly:
  while (NodeMCU.available() > 0)
  {
    String val = NodeMCU.readStringUntil('\n');
    Serial.print("Received UID code: ");
    Serial.println(val);
    sendUIDToServer(val)
  }
  delay(100);
}
