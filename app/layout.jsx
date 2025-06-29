import './globals.css'

export const metadata = {
  title: 'AI最新ニュース',
  description: 'NewsAPIから取得したAI関連の最新ニュース',
}

export default function RootLayout({ children }) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  )
} 