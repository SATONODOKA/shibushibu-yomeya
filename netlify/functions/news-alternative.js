// 代替API: NewsData.io (より良い無料プラン)
// 制限: 200リクエスト/日、リアルタイムデータ対応
const NEWSDATA_API_KEY = 'pub_61930b57b2a4ecf7e4e97b25556b9cfe71d47'; // 無料キー例
const NEWSDATA_API_URL = 'https://newsdata.io/api/1/news';

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
      apikey: NEWSDATA_API_KEY,
      q: 'AI OR ChatGPT OR OpenAI OR "人工知能" OR "機械学習"',
      language: 'en,jp',
      category: 'technology,business',
      size: 10
    });

    const response = await fetch(`${NEWSDATA_API_URL}?${params}`);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();
    
    console.log('NewsData.io Status:', data.status);
    console.log('Results Count:', data.results?.length);
    
    // AI関連キーワードでフィルタリング
    const aiKeywords = ['AI', 'ChatGPT', 'OpenAI', 'Google', 'Microsoft', 'artificial intelligence', 'machine learning', 'neural network'];
    
    const articles = data.results
      ?.filter(article => {
        if (!article.title || !article.link) return false;
        
        const text = (article.title + ' ' + (article.description || '')).toLowerCase();
        return aiKeywords.some(keyword => text.includes(keyword.toLowerCase()));
      })
      .slice(0, 5)
      .map(article => ({
        title: article.title,
        url: article.link,
        publishedAt: article.pubDate,
        description: article.description || '',
        source: article.source_id || '',
        debugInfo: {
          originalDate: article.pubDate,
          hoursAgo: Math.floor((new Date() - new Date(article.pubDate)) / (1000 * 60 * 60))
        }
      })) || [];

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ 
        success: true, 
        articles,
        apiUsed: 'NewsData.io',
        note: 'リアルタイムデータ対応、より多くのソース'
      })
    };
    
  } catch (error) {
    console.error('Error fetching news:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        success: false, 
        error: 'ニュースの取得に失敗しました (NewsData.io)',
        details: error.message
      })
    };
  }
}; 