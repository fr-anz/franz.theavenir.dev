export async function fetchGithubContribution() {
  const response = await fetch("/api/github-contributions");

  if (!response.ok) {
    throw new Error("Failed to fetch");
  }
  return response.json();
}
