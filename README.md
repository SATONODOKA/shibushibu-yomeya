# AI最新ニュース

NewsAPIを使用してAI関連の最新ニュースを取得・表示するシンプルなNext.jsアプリケーションです。

## 機能

1. **自動ニュース取得**: ページ読み込み時にAI関連の最新ニュースを5件自動取得
2. **更新ボタン**: 手動でニュースを再取得できる更新機能
3. **外部リンク**: ニュースタイトルをクリックして元記事に遷移

## 技術スタック

- **Next.js 14**: React フレームワーク（App Router使用）
- **JavaScript**: プログラミング言語
- **NewsAPI**: ニュースデータの取得

## セットアップ

1. 依存関係のインストール:
```bash
npm install
```

2. 開発サーバーの起動:
```bash
npm run dev
```

3. ブラウザで http://localhost:3000 にアクセス

## プロジェクト構造

```
├── app/
│   ├── api/
│   │   └── news/
│   │       └── route.js     # NewsAPI連携
│   ├── globals.css          # スタイル
│   ├── layout.jsx           # レイアウト
│   └── page.jsx             # メインページ
├── package.json
├── next.config.js
└── README.md
```

## API仕様

- **NewsAPI**: https://newsapi.org/
- **クエリ**: AI関連キーワード
- **取得件数**: 5件
- **ソート**: 公開日時順

## ライセンス

MIT License 