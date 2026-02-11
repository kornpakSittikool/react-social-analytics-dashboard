import { render, screen } from "@testing-library/react";
import Home from "./page";

describe("Home page", () => {
  it("renders the top navigation brand", () => {
    render(<Home />);

    expect(screen.getByRole("link", { name: "Social" })).toBeInTheDocument();
  });

  it("renders category chips similar to the reference layout", () => {
    render(<Home />);

    expect(screen.getByRole("button", { name: "ทั้งหมด" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "เพลง" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "มิกซ์" })).toBeInTheDocument();
  });

  it("renders music cards grid", () => {
    render(<Home />);

    expect(screen.getByRole("heading", { name: "มิกซ์ของวันนี้" })).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /Heartbreak Anniversary/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /ไม่ได้คุยนานแล้ว/i }),
    ).toBeInTheDocument();
  });
});
