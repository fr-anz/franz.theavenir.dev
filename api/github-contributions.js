const query = /* GraphQL */ `
  query ($login: String!) {
    user(login: $login) {
      contributionsCollection {
        contributionCalendar {
          totalContributions
          weeks {
            contributionDays {
              date
              contributionCount
              contributionLevel
              color
              weekday
            }
          }
        }
      }
    }
  }
`;

export default async function handler(req, res) {
  try {
    const githubResponse = await fetch("https://api.github.com/graphql", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query,
        variables: {
          login: process.env.GITHUB_USERNAME,
        },
      }),
    });

    const result = await githubResponse.json();

    if (!githubResponse.ok || result.errors) {
      return res.status(502).json({
        error: result.errors?.[0]?.message || "GitHub request failed",
      });
    }

    const calendar =
      result.data.user.contributionsCollection.contributionCalendar;

    return res.status(200).json(calendar);
  } catch {
    return res.status(500).json({
      error: "Internal server error",
    });
  }
}
