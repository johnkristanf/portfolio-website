
export class GithubService {
    static async getProfile() {
        const response = await fetch(
            `https://api.github.com/users/${process.env.GITHUB_USERNAME}`,
            {
              headers: {
                Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
                Accept: "application/vnd.github+json",
              },
            }
          );
        
        const data = await response.json();
        console.log("PROFILE DATA: ", data);
        return data;
    }
}