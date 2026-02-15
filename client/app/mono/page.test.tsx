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

describe("MonoPage", () => {
  afterAll(() => {
    global.fetch = originalFetch;
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("shows unavailable when domin_url is missing", async () => {
    setDominUrl(null);
    render(<MonoPageClient />);

    expect(await screen.findByText("ระบบไม่พร้อมใช้งาน")).toBeInTheDocument();
    expect(screen.getByText("ไม่พบค่า domin_url ที่ถูกต้อง")).toBeInTheDocument();
  });

  it("renders iframe when domin_url is reachable", async () => {
    setDominUrl("http://localhost:4000/");
    global.fetch = jest.fn().mockResolvedValue({ ok: true }) as unknown as typeof fetch;

    render(<MonoPageClient />);

    expect(await screen.findByTitle("Mono target content")).toHaveAttribute(
      "src",
      "http://localhost:4000/",
    );
  });

  it("shows unavailable when domin_url is unreachable", async () => {
    setDominUrl("http://localhost:4000/");
    global.fetch = jest.fn().mockRejectedValue(new Error("network down")) as unknown as typeof fetch;

    render(<MonoPageClient />);

    expect(await screen.findByText("ระบบไม่พร้อมใช้งาน")).toBeInTheDocument();
    expect(screen.getByText("ไม่สามารถเชื่อมต่อ http://localhost:4000/")).toBeInTheDocument();
  });
});
