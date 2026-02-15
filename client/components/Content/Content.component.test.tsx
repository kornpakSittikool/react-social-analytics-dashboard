import { render, screen } from "@testing-library/react";
import Content from "./Content.component";

describe("Content", () => {
  it("renders the main heading", () => {
    render(<Content />);

    expect(screen.getByRole("heading", { name: /music feed/i })).toBeInTheDocument();
  });

  it("renders category buttons", () => {
    const { container } = render(<Content />);

    const sections = container.querySelectorAll("section");
    expect(sections.length).toBeGreaterThan(0);

    const categoryButtons = sections[0]?.querySelectorAll("button");
    expect(categoryButtons?.length).toBe(9);
  });

  it("renders video cards and thumbnails", () => {
    render(<Content />);

    expect(screen.getAllByRole("article")).toHaveLength(6);
    expect(screen.getAllByRole("img")).toHaveLength(6);
    expect(screen.getAllByRole("button", { name: /more options/i })).toHaveLength(6);
  });
});
