# Headless CMS Architecture (GAS + GitHub Pages)

このプロジェクトは、Google Apps Script (GAS) をバックエンドAPIとし、GitHub Pagesを静的フロントエンドホスティングとして利用する「Headless CMS構成」を採用しています。

## ディレクトリ構造

```text
Headless_GAS_CMS_with_GithubPages/
├── architecture.md       # このファイル（アーキテクチャ設計書）
├── docs/                 # GitHub Pagesで公開する静的ファイル（フロントエンド）
│   ├── index.html        # UIの骨組み。バナーなどのGAS特有の要素は存在しない
│   ├── style.css         # スタイリング
│   └── script.js         # GAS API (エンドポイント) からJSONを取得しDOMを構築するロジック
└── backend/              # GASへデプロイするバックエンドAPIコード
    ├── .clasp.json       # clasp設定ファイル
    └── src/
        ├── appsscript.json # GASプロジェクト設定
        └── Code.gs       # スプレッドシートからデータを取得し、JSONで返すロジック
```

## 通信フロー (Communication Flow)

1. **User (Browser)** -> `https://[username].github.io/GAS_sandbox/` にアクセス (GitHub Pages)
2. **GitHub Pages** -> 静的な `index.html`, `style.css`, `script.js` を高速にブラウザへ返却
3. **Browser (script.js)** -> ページロード時に、GASのWebアプリURL (`/exec`) に対して非同期通信 (`fetch`) を実行
4. **GAS (Code.gs)** -> 指定されたスプレッドシートのデータを読み込み、整形してJSONとして返却
5. **Browser (script.js)** -> 受け取ったJSONデータを使って、画面上のHTML要素を動的に構築して表示

## 構成のメリット

- **警告バナーの完全排除**: GAS由来の「このアプリケーションは...」というバナーが表示されません。
- **読み込みの高速化**: ユーザーが最初にアクセスするページは静的ファイルのため、一瞬で表示されます。データはその後裏側で非同期に取得するため、体感速度が大きく向上します。
- **SEO・カスタムドメイン対応**: GitHub Pagesを利用するため、任意のドメイン設定やメタタグの柔軟な管理が可能です。
- **保守性の向上**: フロントエンド（UI）とバックエンド（データ提供）が完全に分離されるため、今後の改修が容易になります。
