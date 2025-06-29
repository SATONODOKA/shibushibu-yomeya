const API_KEY = 'ffe3f921a4cc4d769e8efa691a5d1523';
const API_URL = 'https://newsapi.org/v2/everything';

export async function GET() {
  const params = new URLSearchParams({
    q: 'AI',
    sortBy: 'publishedAt',
    pageSize: '10',
    apiKey: API_KEY
  });

  const response = await fetch(`${API_URL}?${params}`);
  const data = await response.json();
  
  const articles = data.articles
    .filter(article => article.title && article.url)
    .slice(0, 5)
    .map(article => ({
      title: article.title,
      url: article.url,
      publishedAt: article.publishedAt
    }));

  return Response.json({ success: true, articles });
} 