"""FT232H経由でSPIバスへ簡単なデータを送受信するサンプル。

事前に `export BLINKA_FT232H=1` を設定してから実行すること。
D0=SCK, D1=MOSI, D2=MISO, D3=CS(任意のGPIOをCSに使う場合)。
"""
import board
import busio
import digitalio

spi = busio.SPI(board.SCK, MOSI=board.MOSI, MISO=board.MISO)
cs = digitalio.DigitalInOut(board.D3)
cs.direction = digitalio.Direction.OUTPUT
cs.value = True

while not spi.try_lock():
    pass

try:
    spi.configure(baudrate=1_000_000, phase=0, polarity=0)

    tx = bytearray([0x01, 0x02, 0x03])
    rx = bytearray(len(tx))

    cs.value = False
    spi.write_readinto(tx, rx)
    cs.value = True

    print("送信:", list(tx))
    print("受信:", list(rx))
finally:
    spi.unlock()
