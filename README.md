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

### ローカル開発
1. 依存関係のインストール:
```bash
npm install
```

2. 開発サーバーの起動:
```bash
npm run dev
```

3. ブラウザで http://localhost:3000 にアクセス

### Netlifyデプロイ
1. GitHubリポジトリをNetlifyに接続
2. ビルドコマンド: `npm run build && npm run export`
3. 公開ディレクトリ: `out`
4. 自動デプロイが実行されます

## プロジェクト構造

```
├── app/
│   ├── globals.css          # スタイル
│   ├── layout.jsx           # レイアウト
│   └── page.jsx             # メインページ
├── netlify/
│   └── functions/
│       └── news.js          # Netlify Function (NewsAPI連携)
├── netlify.toml             # Netlify設定
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