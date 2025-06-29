// 英語+日本語混合版 - より多くの記事を取得
const API_KEY = 'ffe3f921a4cc4d769e8efa691a5d1523';
const API_URL = 'https://newsapi.org/v2/everything';

exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ success: false, error: 'Method not allowed' })
    };
  }

  try {
    const params = new URLSearchParams({
      q: '(AI OR "人工知能" OR "機械学習" OR ChatGPT OR OpenAI OR "artificial intelligence" OR "machine learning") AND -sport AND -music AND -game',
      sortBy: 'publishedAt',
      pageSize: '20',
      language: 'en,jp',
      apiKey: API_KEY
    });

    const response = await fetch(`${API_URL}?${params}`);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();
    
    console.log('NewsAPI Mixed Status:', data.status);
    console.log('Total Results:', data.totalResults);
    console.log('Articles Count:', data.articles?.length);
    
    // 多言語対応AI関連キーワード
    const aiKeywords = [
      'AI', '人工知能', 'ChatGPT', 'OpenAI', 'Google', 'Microsoft', 'Meta',
      '機械学習', 'ディープラーニング', 'Claude', 'Gemini', 'GPT', 'LLM',
      'artificial intelligence', 'machine learning', 'deep learning', 'neural network',
      '生成AI', '対話AI', 'ロボット', '自動化', 'algorithm', 'automation'
    ];
    
    const articles = data.articles
      .filter(article => {
        if (!article.title || !article.url) return false;
        
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
        language: detectLanguage(article.title),
        debugInfo: {
          originalDate: article.publishedAt,
          hoursAgo: Math.floor((new Date() - new Date(article.publishedAt)) / (1000 * 60 * 60))
        }
      }));

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ 
        success: true, 
        articles,
        apiUsed: 'NewsAPI (English + Japanese)',
        note: '英語と日本語混合、より多くのソース'
      })
    };
    
  } catch (error) {
    console.error('Error fetching news:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        success: false, 
        error: 'ニュースの取得に失敗しました (Mixed Language)',
        details: error.message
      })
    };
  }
};

// 簡易言語判定関数
function detectLanguage(text) {
  const japanesePattern = /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/;
  return japanesePattern.test(text) ? '🇯🇵 日本語' : '🇺🇸 English';
} 