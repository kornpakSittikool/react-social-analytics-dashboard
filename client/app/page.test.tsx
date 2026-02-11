import { render, screen } from "@testing-library/react";
import Home from "./page";

describe("Home page", () => {
  it("renders the dashboard heading and summary", () => {
    render(<Home />);

    expect(
      screen.getByRole("heading", {
        name: /social analytics dashboard/i,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        /track engagement, audience growth, and campaign performance in one place\./i,
      ),
    ).toBeInTheDocument();
  });

  it("renders the top navigation brand", () => {
    render(<Home />);

    expect(screen.getByRole("link", { name: "MY SOCIAL" })).toBeInTheDocument();
  });

  it("renders core analytics cards", () => {
    render(<Home />);

    expect(screen.getByText("Total Reach")).toBeInTheDocument();
    expect(screen.getByText("Engagement Rate")).toBeInTheDocument();
    expect(screen.getByText("New Followers")).toBeInTheDocument();
  });
});
