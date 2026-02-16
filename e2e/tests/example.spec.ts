import { test, expect, type Page } from '@playwright/test';

async function waitForBaseUrlReachable(page: Page, timeoutMs = 90_000) {
  const startedAt = Date.now();
  let latestError: unknown;

  while (Date.now() - startedAt < timeoutMs) {
    try {
      const response = await page.request.get('/', { timeout: 5_000 });
      if (response.ok() || response.status() < 500) {
        return;
      }
    } catch (error) {
      latestError = error;
    }

    await page.waitForTimeout(1_000);
  }

  throw latestError ?? new Error('Timed out waiting for base URL to become reachable');
}

async function gotoWithRetry(page: Page, url: string, retries = 8) {
  let latestError: unknown;
  await waitForBaseUrlReachable(page);

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60_000 });
      return;
    } catch (error) {
      latestError = error;
      const isConnectionRefused = String(error).includes('ERR_CONNECTION_REFUSED');
      if (!isConnectionRefused || attempt === retries) break;
      await page.waitForTimeout(1_000);
    }
  }

  throw latestError;
}

async function isUrlReachable(page: Page, url: string, timeoutMs = 5_000): Promise<boolean> {
  try {
    const response = await page.request.get(url, { timeout: timeoutMs });
    return response.ok() || response.status() < 500;
  } catch {
    return false;
  }
}

async function waitForHomePageDataLoaded(page: Page) {
  await expect(page.getByRole('link', { name: '@kornpakSittikool' })).toBeVisible({ timeout: 30_000 });
  await expect(page.locator('a[aria-label^="Preview "]').first()).toBeVisible({ timeout: 30_000 });
  await expect(page.locator('.animate-pulse')).toHaveCount(0, { timeout: 30_000 });
}

function escapeForRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

const seededGitHubSectionCacheKey = 'github-section-cache:v1:kornpakSittikool';

const seededGitHubSectionCache = {
  profile: {
    login: 'kornpakSittikool',
    name: 'kornpak sittikool',
    avatar_url: 'https://avatars.githubusercontent.com/u/9919?v=4',
    html_url: 'https://github.com/kornpakSittikool',
    bio: 'Seeded profile for deterministic e2e tests',
  },
  repos: [
    {
      id: 1,
      name: 'JsonCraft',
      description: 'JSON editor',
      html_url: 'https://github.com/kornpakSittikool/JsonCraft',
      stargazers_count: 100,
      forks_count: 10,
      language: 'TypeScript',
      fork: false,
    },
    {
      id: 2,
      name: 'NestJs-Microservice',
      description: 'Microservice sample',
      html_url: 'https://github.com/kornpakSittikool/NestJs-Microservice',
      stargazers_count: 80,
      forks_count: 8,
      language: 'TypeScript',
      fork: false,
    },
    {
      id: 3,
      name: 'react-social-analytics-dashboard',
      description: 'Portfolio dashboard',
      html_url: 'https://github.com/kornpakSittikool/react-social-analytics-dashboard',
      stargazers_count: 60,
      forks_count: 6,
      language: 'TypeScript',
      fork: false,
    },
  ],
};

async function seedGitHubSectionCache(page: Page) {
  await page.addInitScript(
    ({ key, value }) => {
      window.localStorage.setItem(key, JSON.stringify(value));
    },
    { key: seededGitHubSectionCacheKey, value: seededGitHubSectionCache },
  );
}

test.describe('Portfolio pages', () => {
  test('home page shows core sections', async ({ page }) => {
    await seedGitHubSectionCache(page);
    await gotoWithRetry(page, '/');
    await waitForHomePageDataLoaded(page);

    await expect(page.getByRole('navigation').getByText('Portfolio')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Contribution Activity' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Top Repositories' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Kornpak Sittikool' }).first()).toBeVisible();
    await expect(page.getByRole('heading', { name: 'SKILLS' })).toBeVisible();
  });

  test('about me page renders profile and contact', async ({ page }) => {
    await gotoWithRetry(page, '/aboutMe');

    await expect(page.getByRole('heading', { name: 'Kornpak Sittikool' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'EXPERIENCE', exact: true })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'CONTACT' })).toBeVisible();
    await expect(page.getByText('korapatsittkool@gmail.com')).toBeVisible();
    await expect(page.getByRole('link', { name: 'kornpak-sittikool' })).toHaveAttribute(
      'href',
      'https://www.linkedin.com/in/kornpak-sittikool-528b39239/',
    );
  });

  test('preview button navigates to mono page with JsonCraft domin_url', async ({ page }) => {
    await seedGitHubSectionCache(page);
    await gotoWithRetry(page, '/');
    await waitForHomePageDataLoaded(page);

    const previewLink = page.getByRole('link', { name: 'Preview JsonCraft' });
    await expect(previewLink).toBeVisible({ timeout: 30_000 });
    const href = await previewLink.getAttribute('href');
    expect(href).toBeTruthy();
    if (!href) {
      throw new Error('Preview link does not have href');
    }

    expect(href).toBe('/mono?domin_url=http%3A%2F%2Flocalhost%3A4000%2F');
    const homeOrigin = new URL(page.url()).origin;
    await previewLink.click();
    await expect(page).toHaveURL(new RegExp(`^${escapeForRegex(homeOrigin + href)}$`));
    const currentUrl = new URL(page.url());
    expect(currentUrl.pathname).toBe('/mono');
    expect(currentUrl.searchParams.get('domin_url')).toBe('http://localhost:4000/');
  });

  test('JsonCraft accepts sample JSON after clicking Preview JsonCraft', async ({ page }) => {
    await seedGitHubSectionCache(page);
    await gotoWithRetry(page, '/');
    await waitForHomePageDataLoaded(page);

    const jsonCraftReachable = await isUrlReachable(page, 'http://localhost:4000/');

    await page.getByRole('link', { name: 'Preview JsonCraft' }).click();
    await expect(page).toHaveURL(/\/mono\?domin_url=/);

    if (!jsonCraftReachable) {
      await expect(page.getByRole('heading', { name: 'Mono Gateway' })).toBeVisible({ timeout: 30_000 });
      await expect(page.getByText('http://localhost:4000/')).toBeVisible({ timeout: 30_000 });
      await expect(page.locator('iframe[title="Mono target content"]')).toHaveCount(0);
      return;
    }

    const monoFrame = page.frameLocator('iframe[title="Mono target content"]');
    await expect(monoFrame.getByText(/Two JSON sources/i)).toBeVisible({ timeout: 30_000 });

    const sourceInputCandidate = monoFrame.getByPlaceholder(/first JSON payload/i);
    const sourceInput =
      (await sourceInputCandidate.count()) > 0
        ? sourceInputCandidate.first()
        : monoFrame.locator('textarea').first();

    const formattedInputCandidate = monoFrame.getByPlaceholder(/Formatted JSON/i);
    const formattedInput =
      (await formattedInputCandidate.count()) > 0
        ? formattedInputCandidate.first()
        : monoFrame.locator('textarea').nth(1);

    const sampleJson = JSON.stringify({
      project: 'JsonCraft',
      version: 1,
      preview: true,
      tags: ['e2e', 'playwright'],
    });

    await sourceInput.fill(sampleJson);
    await expect(sourceInput).toHaveValue(sampleJson);

    const changeToJsonButton = monoFrame.getByRole('button', { name: /Change to JSON/i });
    if (await changeToJsonButton.count()) {
      await changeToJsonButton.first().click();
    }

    await expect.poll(async () => formattedInput.inputValue(), { timeout: 15_000 }).toMatch(/JsonCraft/);
    await expect(formattedInput).toHaveValue(/"preview"\s*:\s*true/);
  });

  test('Preview JsonCraft shows error flow when http://localhost:4000/ is unavailable', async ({ page }) => {
    await seedGitHubSectionCache(page);
    await gotoWithRetry(page, '/');
    await waitForHomePageDataLoaded(page);

    await page.route('http://localhost:4000/**', async (route) => {
      await route.abort('failed');
    });

    await page.getByRole('link', { name: 'Preview JsonCraft' }).click();
    await expect(page).toHaveURL(/\/mono\?domin_url=http%3A%2F%2Flocalhost%3A4000%2F/);

    await expect(page.getByRole('heading', { name: 'Mono Gateway' })).toBeVisible({ timeout: 30_000 });
    await expect(page.getByText('http://localhost:4000/')).toBeVisible({ timeout: 30_000 });
    await expect(page.locator('iframe[title="Mono target content"]')).toHaveCount(0);
  });

  test('preview coding links point to external urls and redirect current page', async ({ page }) => {
    await seedGitHubSectionCache(page);
    await gotoWithRetry(page, '/');
    await waitForHomePageDataLoaded(page);

    const previewCodingLinks = page.locator('a[aria-label^="Preview Coding "]');
    const linkCount = await previewCodingLinks.count();
    expect(linkCount).toBeGreaterThan(0);

    for (let index = 0; index < linkCount; index++) {
      const link = previewCodingLinks.nth(index);
      await expect(link).not.toHaveAttribute('target');

      const href = await link.getAttribute('href');
      expect(href).toBeTruthy();
      if (!href) {
        throw new Error(`Preview Coding link #${index + 1} does not have href`);
      }

      const externalUrl = new URL(href);
      expect(externalUrl.protocol === 'http:' || externalUrl.protocol === 'https:').toBe(true);
      expect(externalUrl.hostname).not.toBe('127.0.0.1');
      expect(externalUrl.hostname).not.toBe('localhost');
    }

    const previewCodingLink = previewCodingLinks.first();
    const href = await previewCodingLink.getAttribute('href');
    expect(href).toBeTruthy();
    if (!href) {
      throw new Error('Preview Coding link does not have href');
    }

    const homeHost = new URL(page.url()).hostname;
    await Promise.all([
      page.waitForURL((url) => new URL(url.toString()).hostname !== homeHost, { timeout: 30_000 }),
      previewCodingLink.click(),
    ]);

    await expect.poll(() => page.url(), { timeout: 30_000 }).toMatch(new RegExp(`^${escapeForRegex(href)}`));
    await expect.poll(() => new URL(page.url()).hostname, { timeout: 30_000 }).not.toBe('127.0.0.1');
    await expect.poll(() => new URL(page.url()).hostname, { timeout: 30_000 }).not.toBe('localhost');
  });

});
