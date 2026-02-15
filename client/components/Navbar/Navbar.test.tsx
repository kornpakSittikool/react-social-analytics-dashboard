import { render, screen } from "@testing-library/react";
import Navbar from "./Navbar.component.";

describe("Navbar", () => {
  it("renders Portfolio brand", () => {
    render(<Navbar />);

    expect(screen.getByText("Portfolio")).toBeInTheDocument();
  });

  it("does not render navigation links", () => {
    render(<Navbar />);

    expect(screen.queryByRole("link")).not.toBeInTheDocument();
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
