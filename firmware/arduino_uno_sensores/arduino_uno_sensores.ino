/*
 * Aqua Track - Firmware Arduino Uno (Sensores locais / Serial)
 * Leitura analógica de pH e sensor de temperatura DS18B20
 */

#include <OneWire.h>
#include <DallasTemperature.h>

#define PINO_ONEWIRE 2   // DS18B20 no pino digital 2 com resistor pull-up 4.7k
#define PINO_PH      A0  // Sensor de pH no pino A0

OneWire oneWire(PINO_ONEWIRE);
DallasTemperature sensorTemp(&oneWire);

void setup() {
    Serial.begin(9600);
    sensorTemp.begin();
    pinMode(PINO_PH, INPUT);
    Serial.println("Aqua Track - Arduino Uno iniciado");
}

void loop() {
    sensorTemp.requestTemperatures();
    float temperatura = sensorTemp.getTempCByIndex(0);

    long soma = 0;
    for (int i = 0; i < 10; i++) {
        soma += analogRead(PINO_PH);
        delay(10);
    }
    float tensao = ((float)soma / 10.0) * (5.0 / 1023.0);
    float ph = 7.0 + ((2.5 - tensao) * 3.5);

    Serial.print("pH: ");
    Serial.print(ph, 2);
    Serial.print(" | Temperatura: ");
    Serial.print(temperatura, 1);
    Serial.println(" C");

    delay(2000);
}

