'use client';

import { useState, useEffect } from 'react';

export default function Home() {
  const [articles, setArticles] = useState([]);

  const fetchNews = async (useAlternative = false) => {
    try {
      const apiUrl = useAlternative ? '/api/news-alternative' : '/api/news';
      const response = await fetch(apiUrl);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success && data.articles) {
        setArticles(data.articles);
        console.log('API使用:', data.apiUsed || 'NewsAPI');
        console.log('取得記事数:', data.articles.length);
        
        // デバッグ情報をコンソール出力
        data.articles.forEach((article, index) => {
          if (article.debugInfo) {
            console.log(`記事${index + 1}: ${article.debugInfo.hoursAgo}時間前の記事`);
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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1>AI最新ニュース</h1>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            onClick={() => fetchNews(false)}
            style={{ 
              backgroundColor: '#0066cc', 
              color: 'white', 
              padding: '10px 20px', 
              border: 'none', 
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            更新 (NewsAPI)
          </button>
          <button 
            onClick={() => fetchNews(true)}
            style={{ 
              backgroundColor: '#ff6600', 
              color: 'white', 
              padding: '10px 20px', 
              border: 'none', 
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            代替API試行
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