import { render, screen } from "@testing-library/react";
import Home from "./page";

jest.mock("@/components/GitHubSection/GitHubSection", () => ({
  __esModule: true,
  default: ({ username }: { username: string }) => (
    <div data-testid="github-section">{username}</div>
  ),
}));

describe("Home page", () => {
  it("renders the top navigation brand", () => {
    render(<Home />);

    expect(screen.getByText("Portfolio")).toBeInTheDocument();
  });

  it("renders GitHub section with fixed username", () => {
    render(<Home />);

    expect(screen.getByTestId("github-section")).toHaveTextContent("kornpakSittikool");
  });

  it("renders page wrapper with current layout classes", () => {
    const { container } = render(<Home />);

    expect(container.firstChild).toHaveClass("min-h-screen", "bg-gray-900", "mb-10");
  });
});
