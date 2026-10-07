/*
 * Aqua Track - Firmware ESP32
 * Monitoramento de pH e Temperatura com envio para Firebase Realtime Database
 */

#include <WiFi.h>
#include <FirebaseESP32.h>
#include <OneWire.h>
#include <DallasTemperature.h>
#include <time.h>

// Rede Wi-Fi
#define WIFI_SSID "SEU_WIFI"
#define WIFI_PASSWORD "SUA_SENHA"

// Firebase
#define FIREBASE_HOST "https://monitoramento-ph-e-temperatura-default-rtdb.firebaseio.com/"
#define FIREBASE_AUTH "AIzaSyBDJjYlmWan7z_LEervJ_EhbZ2H78E6tog"

// Pinos
#define PINO_ONEWIRE 4    // DS18B20 Dados
#define PINO_PH      34   // Sensor pH Analógico (ADC1_CH6)

OneWire oneWire(PINO_ONEWIRE);
DallasTemperature sensorTemp(&oneWire);

FirebaseData fbdo;
FirebaseAuth auth;
FirebaseConfig config;

unsigned long ultimoEnvio = 0;
const long intervaloEnvio = 5000; // 5 segundos
int contadorMedicoes = 0;

const char* ntpServer = "pool.ntp.org";
const long gmtOffset_sec = -3 * 3600;
const int daylightOffset_sec = 0;

unsigned long long pegarTimestampMillis() {
    time_t now;
    time(&now);
    return ((unsigned long long)now) * 1000ULL;
}

float lerTemperatura() {
    sensorTemp.requestTemperatures();
    float t = sensorTemp.getTempCByIndex(0);
    if (t == DEVICE_DISCONNECTED_C || t < -40 || t > 85) {
        return 25.0; // fallback se desconectado
    }
    return t;
}

float lerPH() {
    long soma = 0;
    for (int i = 0; i < 15; i++) {
        soma += analogRead(PINO_PH);
        delay(10);
    }
    float tensao = ((float)soma / 15.0) * (3.3 / 4095.0);
    // Calibração padrão (ajuste com soluções tampão 4.0, 7.0, 10.0)
    float valorPH = 7.0 + ((2.5 - tensao) * 3.5);
    return constrain(valorPH, 0.0, 14.0);
}

void setup() {
    Serial.begin(115200);
    sensorTemp.begin();
    pinMode(PINO_PH, INPUT);

    Serial.print("Conectando ao Wi-Fi...");
    WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
    while (WiFi.status() != WL_CONNECTED) {
        delay(500);
        Serial.print(".");
    }
    Serial.println("\nWi-Fi Conectado!");

    configTime(gmtOffset_sec, daylightOffset_sec, ntpServer);

    config.database_url = FIREBASE_HOST;
    config.signer.tokens.legacy_token = FIREBASE_AUTH;
    Firebase.begin(&config, &auth);
    Firebase.reconnectWiFi(true);

    if (Firebase.getInt(fbdo, "/medicoes/total")) {
        contadorMedicoes = fbdo.intData();
    }
}

void loop() {
    if (millis() - ultimoEnvio >= intervaloEnvio) {
        ultimoEnvio = millis();

        if (WiFi.status() == WL_CONNECTED && Firebase.ready()) {
            float temp = lerTemperatura();
            float ph = lerPH();
            unsigned long long ts = pegarTimestampMillis();
            contadorMedicoes++;

            // 1. Atual
            FirebaseJson jsonAtual;
            jsonAtual.set("ph", ph);
            jsonAtual.set("temperatura", temp);
            jsonAtual.set("timestamp", (double)ts);
            jsonAtual.set("sensor_online", true);
            Firebase.setJSON(fbdo, "/medicoes/atual", jsonAtual);

            // 2. Total
            Firebase.setInt(fbdo, "/medicoes/total", contadorMedicoes);

            // 3. Histórico
            String caminhoHist = "/medicoes/historico/" + String((unsigned long)(ts / 1000ULL));
            FirebaseJson jsonHist;
            jsonHist.set("ph", ph);
            jsonHist.set("temperatura", temp);
            jsonHist.set("timestamp", (double)ts);
            Firebase.setJSON(fbdo, caminhoHist, jsonHist);

            Serial.printf("Enviado -> pH: %.2f | Temp: %.2f C\n", ph, temp);
        }
    }
}

