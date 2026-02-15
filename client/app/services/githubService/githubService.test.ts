import {
  GITHUB_API,
  getContributionsSvgUrl,
  getGitHubProfile,
  getGitHubRepos,
} from "./githubService";

type MockResponseOptions = {
  ok: boolean;
  status: number;
  body?: unknown;
};

const createResponse = ({ ok, status, body }: MockResponseOptions): Response =>
  ({
    ok,
    status,
    text: async () => {
      if (body === undefined || body === null) return "";
      return typeof body === "string" ? body : JSON.stringify(body);
    },
  }) as Response;

describe("githubService", () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
    global.fetch = originalFetch;
  });

  it("builds the contribution chart URL", () => {
    expect(getContributionsSvgUrl("octo cat")).toBe("https://ghchart.rshah.org/octo%20cat");
  });

  it("fetches GitHub profile data", async () => {
    const profile = {
      login: "octocat",
      name: "Octo Cat",
      avatar_url: "https://avatars.githubusercontent.com/u/1?v=4",
      html_url: "https://github.com/octocat",
      bio: "Hello",
    };

    (global.fetch as jest.Mock).mockResolvedValueOnce(
      createResponse({ ok: true, status: 200, body: profile }),
    );

    await expect(getGitHubProfile("octocat")).resolves.toEqual(profile);
    expect(global.fetch).toHaveBeenCalledWith(
      `${GITHUB_API}/users/octocat`,
      expect.objectContaining({ signal: expect.any(Object) }),
    );
  });

  it("encodes usernames in profile requests", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce(
      createResponse({ ok: true, status: 200, body: { login: "space" } }),
    );

    await getGitHubProfile("octo cat");
    expect(global.fetch).toHaveBeenCalledWith(
      `${GITHUB_API}/users/octo%20cat`,
      expect.any(Object),
    );
  });

  it("throws a friendly message for 404 profiles", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce(
      createResponse({ ok: false, status: 404 }),
    );

    await expect(getGitHubProfile("missing")).rejects.toThrow("User not found (404)");
  });

  it("throws a rate limit message for 403 responses", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce(
      createResponse({ ok: false, status: 403 }),
    );

    await expect(getGitHubProfile("rate")).rejects.toThrow(/Rate limit \/ forbidden \(403\)/);
  });

  it("fetches repositories with query options", async () => {
    const repos = [
      {
        id: 1,
        name: "alpha",
        description: null,
        html_url: "https://github.com/octocat/alpha",
        stargazers_count: 1,
        forks_count: 0,
        language: null,
        fork: false,
      },
    ];

    (global.fetch as jest.Mock).mockResolvedValueOnce(
      createResponse({ ok: true, status: 200, body: repos }),
    );

    await expect(getGitHubRepos("octocat", { perPage: 5, sort: "created" })).resolves.toEqual(
      repos,
    );
    expect(global.fetch).toHaveBeenCalledWith(
      `${GITHUB_API}/users/octocat/repos?per_page=5&sort=created`,
      expect.any(Object),
    );
  });

  it("returns an empty array when repo response is not an array", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce(
      createResponse({ ok: true, status: 200, body: { message: "not an array" } }),
    );

    await expect(getGitHubRepos("octocat")).resolves.toEqual([]);
  });

  it("throws detailed errors for unexpected status codes", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce(
      createResponse({ ok: false, status: 500, body: "server down" }),
    );

    await expect(getGitHubRepos("octocat")).rejects.toThrow(
      "GitHub API error: 500 - server down",
    );
  });
});
