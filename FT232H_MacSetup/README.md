# Adafruit FT232H Breakout を macOS で使う

Adafruit FT232H Breakout（USB to GPIO / SPI / I2C、USB-C & Stemma QT対応）を
macOS から使うためのセットアップ手順とサンプルコード。

## 対応環境

- macOS（Intel / Apple Silicon 両対応）
- Python 3.9 以上
- USB-Cケーブル（**データ通信対応**のもの。充電専用ケーブルは不可）

## セットアップ手順

### 1. Homebrew で libusb をインストール

```bash
brew install libusb
```

### 2. Python 仮想環境を作成

```bash
python3 -m venv venv
source venv/bin/activate
```

### 3. Adafruit Blinka と pyftdi をインストール

```bash
pip install --upgrade pip
pip install pyftdi adafruit-blinka
```

### 4. macOS標準ドライバとの競合に注意

macOSはFTDIチップをUSBシリアルデバイス（`AppleUSBFTDI`）として自動認識し、
`/dev/tty.usbserial-XXXXXXXX` を作成します。pyftdi/libusb経由でのアクセスは
通常この標準ドライバと共存できますが、デバイスが掴まれて認識できない場合は
以下を試してください。

```bash
# 一時的にドライバをアンロード（再起動 or 抜き差しで元に戻る）
sudo kextunload -b com.apple.driver.AppleUSBFTDI
```

シリアルポートとして使うプログラム（screenなど）を起動したままにしていないかも確認してください。

### 5. 環境変数を設定してFT232Hモードを有効化

```bash
export BLINKA_FT232H=1
```

`~/.zshrc` に追記して恒久化すると便利です。

### 6. デバイス認識の確認

```bash
python -m pyftdi.list_devices
```

`ftdi://ftdi:232h/1` のようなデバイスが表示されればOK。

## サンプルコード

- `i2c_scan.py` — I2Cバス上のデバイスをスキャン
- `gpio_blink.py` — GPIOピン（C0）のON/OFF
- `spi_test.py` — SPI経由でのデータ送受信

いずれも `BLINKA_FT232H=1` を設定した状態で実行してください。

```bash
python i2c_scan.py
python gpio_blink.py
python spi_test.py
```

## ピン配置（Stemma QT / ヘッダー）

- Stemma QTコネクタ: I2C（SCL/SDA）を自動配線（`board.SCL` / `board.SDA`）
- `D0`〜`D7`, `C0`〜`C9`: GPIO / SPI / UART 等に割り当て可能
  （Adafruit Blinkaの `board` モジュールで名前アクセス）

## トラブルシューティング

| 症状 | 対処 |
|---|---|
| デバイスが見つからない | USB-Cケーブルがデータ通信対応か確認。別のUSBポート/ハブを試す |
| Permission denied | Linux用のudevルールはmacOSには不要。`sudo`をつけて実行して切り分ける |
| Apple Siliconでlibusbが見つからない | Homebrewのパスが `/opt/homebrew` になるため<br>`export DYLD_LIBRARY_PATH=/opt/homebrew/lib` を試す |
| I2Cデバイスが見えない | プルアップ抵抗の有無、配線（SCL/SDA逆挿し）を確認 |

## 参考リンク

- Adafruit公式ガイド: https://learn.adafruit.com/circuitpython-on-any-computer-with-ft232h
- pyftdi ドキュメント: https://eblot.github.io/pyftdi/
