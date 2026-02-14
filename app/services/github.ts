
export class GithubService {
    static async getProfile() {
        const response = await fetch(
            `https://api.github.com/users/${process.env.GITHUB_USERNAME}`,
            {
              method: 'GET',
              headers: {
                Authorization: `Bearer ${process.env.GITHUB_PERSONAL_ACCESS_TOKEN}`,
                Accept: "application/vnd.github+json",
              },
            }
          );
        
        const data = await response.json();
        return data;
    }

    static async getRepos() {
      const response = await fetch(
          `https://api.github.com/users/${process.env.GITHUB_USERNAME}/repos`,
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${process.env.GITHUB_PERSONAL_ACCESS_TOKEN}`,
              Accept: "application/vnd.github+json",
            },
          }
        );
      
      const data = await response.json();
      return data;
  }
}