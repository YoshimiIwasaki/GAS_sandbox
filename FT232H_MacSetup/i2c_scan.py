"""FT232H経由でI2Cバスをスキャンし、応答のあるアドレスを表示する。

事前に `export BLINKA_FT232H=1` を設定してから実行すること。
"""
import board
import busio

i2c = busio.I2C(board.SCL, board.SDA)

while not i2c.try_lock():
    pass

try:
    addresses = i2c.scan()
    if addresses:
        print("見つかったI2Cデバイス:", [hex(addr) for addr in addresses])
    else:
        print("I2Cデバイスが見つかりませんでした。配線を確認してください。")
finally:
    i2c.unlock()
