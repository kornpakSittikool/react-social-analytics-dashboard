import { render, screen } from "@testing-library/react";
import { useSearchParams } from "next/navigation";
import MonoPageClient from "./MonoPageClient";

jest.mock("next/navigation", () => ({
  useSearchParams: jest.fn(),
}));

const mockUseSearchParams = useSearchParams as jest.MockedFunction<typeof useSearchParams>;
const originalFetch = global.fetch;

function setDominUrl(dominUrl: string | null) {
  mockUseSearchParams.mockReturnValue({
    get: (key: string) => (key === "domin_url" ? dominUrl : null),
  } as unknown as ReturnType<typeof useSearchParams>);
}

describe("MonoPageClient", () => {
  afterAll(() => {
    global.fetch = originalFetch;
  });

  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = jest.fn() as unknown as typeof fetch;
  });

  it("shows unavailable state when domin_url is missing", async () => {
    setDominUrl(null);

    render(<MonoPageClient />);

    expect(await screen.findByText(/domin_url/i)).toBeInTheDocument();
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it("shows unavailable state when domin_url has unsupported protocol", async () => {
    setDominUrl("ftp://localhost:4000");

    render(<MonoPageClient />);

    expect(await screen.findByText(/domin_url/i)).toBeInTheDocument();
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it("renders iframe and back link when domin_url is reachable", async () => {
    setDominUrl("http://localhost:4000");
    global.fetch = jest.fn().mockResolvedValue({ ok: true }) as unknown as typeof fetch;

    render(<MonoPageClient />);

    const iframe = await screen.findByTitle("Mono target content");
    expect(iframe).toHaveAttribute("src", "http://localhost:4000/");
    expect(screen.getByRole("link", { name: /back to main domain/i })).toHaveAttribute("href", "/");
    expect(global.fetch).toHaveBeenCalledWith(
      "http://localhost:4000/",
      expect.objectContaining({
        method: "GET",
        mode: "no-cors",
        cache: "no-store",
      }),
    );
  });

  it("shows unavailable state when domin_url is unreachable", async () => {
    setDominUrl("http://localhost:4000/");
    global.fetch = jest.fn().mockRejectedValue(new Error("network down")) as unknown as typeof fetch;

    render(<MonoPageClient />);

    expect(await screen.findByText(/http:\/\/localhost:4000\//i)).toBeInTheDocument();
    expect(screen.queryByTitle("Mono target content")).not.toBeInTheDocument();
  });
});
