'use client';

import { useState, useEffect } from 'react';

export default function Home() {
  const [articles, setArticles] = useState([]);

  const fetchNews = async (apiType = 'japanese') => {
    try {
      let apiUrl;
      switch(apiType) {
        case 'mixed':
          apiUrl = '/api/news-mixed';
          break;
        case 'alternative':
          apiUrl = '/api/news-alternative';
          break;
        case 'japanese':
        default:
          apiUrl = '/api/news';
          break;
      }
      
      const response = await fetch(apiUrl);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success && data.articles) {
        setArticles(data.articles);
        console.log('API使用:', data.apiUsed || 'NewsAPI');
        console.log('取得記事数:', data.articles.length);
        console.log('備考:', data.note || '');
        
        // デバッグ情報をコンソール出力
        data.articles.forEach((article, index) => {
          if (article.debugInfo) {
            console.log(`記事${index + 1}: ${article.debugInfo.hoursAgo}時間前 ${article.language || ''}`);
          }
        });
      } else {
        console.error('API Error:', data.error);
        setArticles([]);
      }
    } catch (error) {
      console.error('Fetch Error:', error);
      setArticles([]);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ marginBottom: '20px' }}>
        <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>🤖 AI最新ニュース</h1>
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button 
            onClick={() => fetchNews('japanese')}
            style={{ 
              backgroundColor: '#E91E63', 
              color: 'white', 
              padding: '10px 20px', 
              border: 'none', 
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            🇯🇵 日本語記事のみ
          </button>
          <button 
            onClick={() => fetchNews('mixed')}
            style={{ 
              backgroundColor: '#4CAF50', 
              color: 'white', 
              padding: '10px 20px', 
              border: 'none', 
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            🌐 英語+日本語
          </button>
          <button 
            onClick={() => fetchNews('alternative')}
            style={{ 
              backgroundColor: '#2196F3', 
              color: 'white', 
              padding: '10px 20px', 
              border: 'none', 
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            🔄 代替API (日本語)
          </button>
        </div>
      </div>

      <div>
        {articles.length > 0 ? (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {articles.map((article, index) => (
              <li key={index} style={{ marginBottom: '15px', paddingBottom: '15px', borderBottom: '1px solid #eee' }}>
                <a
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ 
                    color: '#0066cc', 
                    textDecoration: 'none', 
                    fontSize: '16px',
                    fontWeight: 'bold'
                  }}
                >
                  {article.title}
                </a>
                <div style={{ fontSize: '12px', margin: '5px 0 0 0' }}>
                  <p style={{ color: '#666', margin: '2px 0' }}>
                    {new Date(article.publishedAt).toLocaleString('ja-JP')} 
                    {article.language && <span style={{ marginLeft: '10px', backgroundColor: '#f0f0f0', padding: '2px 6px', borderRadius: '3px' }}>{article.language}</span>}
                  </p>
                  {article.debugInfo && (
                    <p style={{ color: '#999', margin: '2px 0' }}>
                      {article.debugInfo.hoursAgo}時間前の記事 | {article.source}
                    </p>
                  )}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>ニュースがありません</p>
        )}
      </div>
    </div>
  );
} 