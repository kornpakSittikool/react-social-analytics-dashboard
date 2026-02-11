import { render, screen } from "@testing-library/react";
import Navbar from "./Navbar";

describe("Navbar", () => {
  it("renders MY SOCIAL brand in uppercase", () => {
    render(<Navbar />);

    expect(screen.getByRole("link", { name: "MY SOCIAL" })).toBeInTheDocument();
  });

  it("does not render center navigation links when section is commented out", () => {
    render(<Navbar />);

    expect(screen.queryByRole("link", { name: /overview/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /analytics/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /campaigns/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /audience/i })).not.toBeInTheDocument();
  });

  it("does not render removed controls", () => {
    render(<Navbar />);

    expect(screen.queryByRole("searchbox")).not.toBeInTheDocument();
    expect(screen.queryByLabelText(/search/i)).not.toBeInTheDocument();
    expect(screen.queryByLabelText(/mic|microphone/i)).not.toBeInTheDocument();
    expect(screen.queryByLabelText(/profile/i)).not.toBeInTheDocument();
    expect(screen.queryByLabelText(/notification/i)).not.toBeInTheDocument();
    expect(screen.queryByLabelText(/menu|hamburger/i)).not.toBeInTheDocument();
  });
});
