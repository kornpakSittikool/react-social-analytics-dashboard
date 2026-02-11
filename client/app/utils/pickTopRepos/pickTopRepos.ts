import { GitHubRepo } from "@/app/services/githubService/githubService";

export function pickTopRepos(repos: GitHubRepo[], n = 6): GitHubRepo[] {
  return (repos ?? [])
    .filter((r) => r && !r.fork)
    .sort((a, b) => (b.stargazers_count ?? 0) - (a.stargazers_count ?? 0))
    .slice(0, n);
}
