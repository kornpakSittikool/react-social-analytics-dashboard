import { render, screen } from "@testing-library/react";
import AboutMePage from "./page";

describe("AboutMePage", () => {
  it("renders profile name and role", () => {
    render(<AboutMePage />);

    expect(screen.getByRole("heading", { name: "Kornpak Sittikool" })).toBeInTheDocument();
    expect(screen.getByText("Software Developer")).toBeInTheDocument();
  });

  it("renders core resume sections", () => {
    render(<AboutMePage />);

    expect(screen.getByRole("heading", { name: "EXPERIENCE" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "CONTACT" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Work experience" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "SKILLS" })).toBeInTheDocument();
  });

  it("renders contact details", () => {
    render(<AboutMePage />);

    expect(screen.getByText(/0640614237/)).toBeInTheDocument();
    expect(screen.getByText(/korapatsittkool@gmail.com/)).toBeInTheDocument();
    expect(
      screen.getByRole("link", {
        name: /kornpak-sittikool/i,
      }),
    ).toHaveAttribute(
      "href",
      "https://www.linkedin.com/in/kornpak-sittikool-528b39239/",
    );
  });

  it("renders mapped work experience entries from data", () => {
    render(<AboutMePage />);

    expect(
      screen.getByRole("heading", {
        name: "2022 - 2023 : Full Stack Developer",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        name: "2023 - Now : Full Stack Developer",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        /From 2022 to 2023, I worked on software development and deployment projects/i,
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        /From 2023 to Now, I worked as a Full Stack Developer in a Scrum-based team/i,
      ),
    ).toBeInTheDocument();
  });

  it("renders skills with logos and levels", () => {
    render(<AboutMePage />);

    expect(screen.getByText("Next.js")).toBeInTheDocument();
    expect(screen.getByText("TypeScript")).toBeInTheDocument();
    expect(screen.getByText("MongoDB")).toBeInTheDocument();
    expect(screen.getByAltText("Next.js logo")).toBeInTheDocument();
    expect(screen.getByAltText("Docker logo")).toBeInTheDocument();
    expect(screen.getAllByText("Normal")).toHaveLength(2);
  });
});
