'use client';

import { useState, useEffect } from 'react';

export default function Home() {
  const [articles, setArticles] = useState([]);

  const fetchNews = async () => {
    const response = await fetch('/api/news');
    const data = await response.json();
    
    if (data.success && data.articles) {
      setArticles(data.articles);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1>AI最新ニュース</h1>
        <button 
          onClick={fetchNews}
          style={{ 
            backgroundColor: '#0066cc', 
            color: 'white', 
            padding: '10px 20px', 
            border: 'none', 
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          更新
        </button>
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
                <p style={{ color: '#666', fontSize: '12px', margin: '5px 0 0 0' }}>
                  {new Date(article.publishedAt).toLocaleString('ja-JP')}
                </p>
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