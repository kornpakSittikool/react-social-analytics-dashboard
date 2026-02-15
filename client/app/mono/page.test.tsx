import { render, screen } from "@testing-library/react";

type MockMonoPageClient = () => JSX.Element;

async function loadMonoPageWithClient(mockMonoPageClient: MockMonoPageClient) {
  jest.resetModules();
  jest.doMock("./MonoPageClient", () => ({
    __esModule: true,
    default: mockMonoPageClient,
  }));

  const module = await import("./page");
  return module.default;
}

describe("MonoPage", () => {
  afterEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
  });

  it("renders MonoPageClient content when client does not suspend", async () => {
    const MonoPage = await loadMonoPageWithClient(() => <div data-testid="mono-page-client">ready</div>);

    render(<MonoPage />);

    expect(screen.getByTestId("mono-page-client")).toBeInTheDocument();
  });

  it("renders fallback when MonoPageClient is suspended", async () => {
    const neverResolvingPromise = new Promise(() => {});
    const MonoPage = await loadMonoPageWithClient(() => {
      throw neverResolvingPromise;
    });

    render(<MonoPage />);

    expect(screen.getByText("Mono Gateway")).toBeInTheDocument();
    expect(screen.queryByTestId("mono-page-client")).not.toBeInTheDocument();
  });
});
