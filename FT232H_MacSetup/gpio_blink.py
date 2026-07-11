"""FT232HのGPIOピン(C0)をLチカ(点滅)させるサンプル。

事前に `export BLINKA_FT232H=1` を設定してから実行すること。
C0ピンにLED(+直列抵抗)を接続しておく。
"""
import time

import board
import digitalio

led = digitalio.DigitalInOut(board.C0)
led.direction = digitalio.Direction.OUTPUT

try:
    while True:
        led.value = True
        time.sleep(0.5)
        led.value = False
        time.sleep(0.5)
except KeyboardInterrupt:
    led.value = False
