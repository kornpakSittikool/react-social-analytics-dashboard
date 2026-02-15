import { render, screen, within } from "@testing-library/react";
import GitHubSection from "./GitHubSection";
import {
  getContributionsSvgUrl,
  getGitHubProfile,
  getGitHubRepos,
  type GitHubProfile,
  type GitHubRepo,
} from "@/app/services/githubService/githubService";

jest.mock("@/app/services/githubService/githubService", () => ({
  __esModule: true,
  getContributionsSvgUrl: jest.fn(),
  getGitHubProfile: jest.fn(),
  getGitHubRepos: jest.fn(),
}));

const mockGetContributionsSvgUrl = getContributionsSvgUrl as jest.MockedFunction<
  typeof getContributionsSvgUrl
>;
const mockGetGitHubProfile = getGitHubProfile as jest.MockedFunction<typeof getGitHubProfile>;
const mockGetGitHubRepos = getGitHubRepos as jest.MockedFunction<typeof getGitHubRepos>;

describe("GitHubSection", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetContributionsSvgUrl.mockReturnValue("https://ghchart.rshah.org/example");
  });

  it("returns null when username is empty", () => {
    const { container } = render(<GitHubSection username="" />);

    expect(container).toBeEmptyDOMElement();
    expect(mockGetGitHubProfile).not.toHaveBeenCalled();
    expect(mockGetGitHubRepos).not.toHaveBeenCalled();
  });

  it("renders profile data, stats, and top repos", async () => {
    const profile: GitHubProfile = {
      login: "octocat",
      name: "Octo Cat",
      avatar_url: "https://avatars.githubusercontent.com/u/1?v=4",
      html_url: "https://github.com/octocat",
      bio: "Hello from the sea",
    };

    const repos: GitHubRepo[] = [
      {
        id: 1,
        name: "JsonCraft",
        description: "JsonCraft repo",
        html_url: "https://github.com/octocat/jsoncraft",
        stargazers_count: 50,
        forks_count: 5,
        language: "TypeScript",
        fork: false,
      },
      {
        id: 2,
        name: "beta",
        description: "Beta repo",
        html_url: "https://github.com/octocat/beta",
        stargazers_count: 5,
        forks_count: 2,
        language: "TypeScript",
        fork: false,
      },
      {
        id: 3,
        name: "forked",
        description: "Forked repo",
        html_url: "https://github.com/octocat/forked",
        stargazers_count: 500,
        forks_count: 1,
        language: "TypeScript",
        fork: true,
      },
    ];

    mockGetGitHubProfile.mockResolvedValue(profile);
    mockGetGitHubRepos.mockResolvedValue(repos);

    render(<GitHubSection username="octocat" />);

    expect(await screen.findByText(profile.name)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: `@${profile.login}` })).toHaveAttribute(
      "href",
      profile.html_url,
    );

    const reposCard = screen.getByText("Repos").closest("div");
    expect(within(reposCard as HTMLElement).getByText("2")).toBeInTheDocument();

    const starsCard = screen.getByText("Stars").closest("div");
    expect(within(starsCard as HTMLElement).getByText("55")).toBeInTheDocument();

    const forksCard = screen.getByText("Forks").closest("div");
    expect(within(forksCard as HTMLElement).getByText("7")).toBeInTheDocument();

    const mainStackCard = screen.getByText("Main Stack").closest("div");
    expect(within(mainStackCard as HTMLElement).getByText("TypeScript")).toBeInTheDocument();

    const chart = screen.getByAltText("GitHub contributions chart");
    expect(chart).toHaveAttribute("src", "https://ghchart.rshah.org/example");

    expect(screen.getByRole("link", { name: /preview jsoncraft/i })).toHaveAttribute(
      "href",
      "/mono?domin_url=http%3A%2F%2Flocalhost%3A4000%2F",
    );
    expect(screen.getByRole("link", { name: /preview beta/i })).toHaveAttribute(
      "href",
      "/mono?domin_url=",
    );
    expect(screen.getByRole("link", { name: /preview coding jsoncraft/i })).toHaveAttribute(
      "href",
      "https://github.com/octocat/jsoncraft",
    );
    expect(screen.getByRole("link", { name: /preview coding beta/i })).toHaveAttribute(
      "href",
      "https://github.com/octocat/beta",
    );
    expect(screen.queryByRole("link", { name: /forked/i })).not.toBeInTheDocument();
  });

  it("shows error when GitHub data fails to load", async () => {
    mockGetGitHubProfile.mockRejectedValue(new Error("Boom"));
    mockGetGitHubRepos.mockResolvedValue([]);

    render(<GitHubSection username="octocat" />);

    expect(await screen.findByText(/Failed to load GitHub data: Boom/i)).toBeInTheDocument();
    expect(screen.getByText("No profile data found.")).toBeInTheDocument();
  });
});
