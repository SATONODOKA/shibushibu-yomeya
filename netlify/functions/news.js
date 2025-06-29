const API_KEY = 'ffe3f921a4cc4d769e8efa691a5d1523';
const API_URL = 'https://newsapi.org/v2/everything';

exports.handler = async (event, context) => {
  // CORS設定
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  // OPTIONSリクエスト対応（CORS preflight）
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  // GETリクエストのみ許可
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ success: false, error: 'Method not allowed' })
    };
  }

  try {
    const params = new URLSearchParams({
      q: 'AI',
      sortBy: 'publishedAt',
      pageSize: '10',
      apiKey: API_KEY
    });

    const response = await fetch(`${API_URL}?${params}`);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();
    
    const articles = data.articles
      .filter(article => article.title && article.url)
      .slice(0, 5)
      .map(article => ({
        title: article.title,
        url: article.url,
        publishedAt: article.publishedAt
      }));

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ success: true, articles })
    };
    
  } catch (error) {
    console.error('Error fetching news:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        success: false, 
        error: 'ニュースの取得に失敗しました' 
      })
    };
  }
}; 