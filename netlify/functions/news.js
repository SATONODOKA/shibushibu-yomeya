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
      q: '(AI OR "人工知能" OR "機械学習" OR "ChatGPT" OR "OpenAI" OR "Gemini" OR "Claude") AND -sport AND -music AND -game',
      sortBy: 'publishedAt',
      pageSize: '15',
      language: 'en',
      apiKey: API_KEY
    });

    const response = await fetch(`${API_URL}?${params}`);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();
    
    console.log('NewsAPI Status:', data.status);
    console.log('Total Results:', data.totalResults);
    console.log('Articles Count:', data.articles?.length);
    
    // AI関連キーワードでさらにフィルタリング
    const aiKeywords = ['AI', '人工知能', 'ChatGPT', 'OpenAI', 'Google', 'Microsoft', 'Meta', '機械学習', 'ディープラーニング', 'Claude', 'Gemini', 'GPT', 'LLM', 'neural', 'algorithm'];
    
    const articles = data.articles
      .filter(article => {
        if (!article.title || !article.url) return false;
        
        // タイトル + 説明文でAI関連キーワードをチェック
        const text = (article.title + ' ' + (article.description || '')).toLowerCase();
        return aiKeywords.some(keyword => text.includes(keyword.toLowerCase()));
      })
      .slice(0, 5)
      .map(article => ({
        title: article.title,
        url: article.url,
        publishedAt: article.publishedAt,
        description: article.description || '',
        source: article.source?.name || '',
        debugInfo: {
          originalDate: article.publishedAt,
          hoursAgo: Math.floor((new Date() - new Date(article.publishedAt)) / (1000 * 60 * 60))
        }
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