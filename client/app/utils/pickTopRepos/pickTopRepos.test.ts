import { pickTopRepos } from "./pickTopRepos";
import type { GitHubRepo } from "@/app/services/githubService/githubService";

const makeRepo = (overrides: Partial<GitHubRepo>): GitHubRepo => ({
  id: 1,
  name: "repo",
  description: null,
  html_url: "https://example.com/repo",
  stargazers_count: 0,
  forks_count: 0,
  language: null,
  fork: false,
  ...overrides,
});

describe("pickTopRepos", () => {
  it("filters forks and sorts by stargazers descending", () => {
    const repos = [
      makeRepo({ id: 1, stargazers_count: 5 }),
      makeRepo({ id: 2, stargazers_count: 10 }),
      makeRepo({ id: 3, stargazers_count: 100, fork: true }),
    ];

    const result = pickTopRepos(repos, 2);

    expect(result.map((repo) => repo.id)).toEqual([2, 1]);
  });

  it("removes nullish entries", () => {
    const repos = [null as unknown as GitHubRepo, makeRepo({ id: 4, stargazers_count: 3 })];

    const result = pickTopRepos(repos);

    expect(result).toHaveLength(1);
    expect(result[0].id).toBe(4);
  });

  it("uses the default size of 6", () => {
    const repos = Array.from({ length: 7 }, (_, index) =>
      makeRepo({ id: index + 1, stargazers_count: index }),
    );

    const result = pickTopRepos(repos);

    expect(result).toHaveLength(6);
  });

  it("treats missing stargazers as zero", () => {
    const repos = [
      makeRepo({ id: 1, stargazers_count: undefined as unknown as number }),
      makeRepo({ id: 2, stargazers_count: 1 }),
    ];

    const result = pickTopRepos(repos, 2);

    expect(result[0].id).toBe(2);
  });
});
