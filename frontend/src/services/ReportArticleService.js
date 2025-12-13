class ReportArticleService {
  static async reportArticle(token, article_id, description) {
    try {
      const response = await fetch('http://localhost:8000/report_article/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: token,
          article_id: article_id,
          description: description
        }),
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error reporting article:', error);
      return { confirmation: 'backend error' };
    }
  }
}

export default ReportArticleService;