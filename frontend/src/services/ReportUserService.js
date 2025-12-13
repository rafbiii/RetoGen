class ReportUserService {
  static async reportUser(token, reported_user_email, description) {
    try {
      const response = await fetch('http://127.0.0.1:8000/report_user/report_user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: token,
          reported_user_email: reported_user_email,
          description: description
        }),
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error reporting user:', error);
      return { confirmation: 'backend error' };
    }
  }
}

export default ReportUserService;
