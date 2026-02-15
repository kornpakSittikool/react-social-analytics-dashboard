"use client";

import { useEffect, useMemo, useState } from "react";
import {
  getContributionsSvgUrl,
  getGitHubProfile,
  getGitHubRepos,
  type GitHubProfile,
  type GitHubRepo,
} from "@/app/services/githubService/githubService";
import { pickTopRepos } from "@/app/utils/pickTopRepos/pickTopRepos";
import Image from "next/image";
import Link from "next/link";

type GitHubSectionProps = {
  username: string;
};

type RepoWithDominUrl = GitHubRepo & {
  domin_url?: string;
};

type DominRule = {
  name: string;
  domin_url: string;
};

const dominRules: DominRule[] = [
  {
    name: "JsonCraft",
    domin_url: "http://localhost:4000/",
  },
  {
    name: "NestJs-Microservice",
    domin_url: "http://localhost:3000/document",
  },
];

const formatCount = (value: number) => new Intl.NumberFormat("en-US").format(value ?? 0);

function getPrimaryLanguage(repos: GitHubRepo[]): string {
  const frequency = new Map<string, number>();

  repos.forEach((repo) => {
    if (!repo.language) return;
    frequency.set(repo.language, (frequency.get(repo.language) ?? 0) + 1);
  });

  const topLanguage = [...frequency.entries()].sort((a, b) => b[1] - a[1])[0]?.[0];
  return topLanguage ?? "Not specified";
}

function addDominUrlToMatchedRepos(repos: GitHubRepo[], rules: DominRule[]): RepoWithDominUrl[] {
  const rulesByName = new Map(rules.map((rule) => [rule.name, rule.domin_url]));

  return repos.map((repo) => {
    const domin_url = rulesByName.get(repo.name);
    return domin_url ? { ...repo, domin_url } : repo;
  });
}

function buildMonoUrl(dominUrl?: string): string {
  return `/mono?domin_url=${encodeURIComponent(dominUrl ?? "")}`;
}

export default function GitHubSection({ username }: GitHubSectionProps) {
  const [profile, setProfile] = useState<GitHubProfile | null>(null);
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!username) return;
    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        setError("");

        const [fetchedProfile, fetchedRepos] = await Promise.all([
          getGitHubProfile(username, { timeoutMs: 8000 }),
          getGitHubRepos(username, {
            perPage: 100,
            sort: "updated",
            timeoutMs: 8000,
          }),
        ]);

        if (cancelled) return;
        setProfile(fetchedProfile);
        setRepos(fetchedRepos);
      } catch (unknownError) {
        if (!cancelled) {
          setError(
            unknownError instanceof Error ? unknownError.message : "Failed to load GitHub data",
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [username]);

  const topRepos = useMemo(() => pickTopRepos(repos, 6), [repos]);
  const topReposWithDomin = useMemo(
    () => addDominUrlToMatchedRepos(topRepos, dominRules),
    [topRepos],
  );

  const contributionsSvg = useMemo(() => getContributionsSvgUrl(username), [username]);

  const stats = useMemo(() => {
    const nonForkRepos = repos.filter((repo) => !repo.fork);
    const totalStars = nonForkRepos.reduce((sum, repo) => sum + (repo.stargazers_count ?? 0), 0);
    const totalForks = nonForkRepos.reduce((sum, repo) => sum + (repo.forks_count ?? 0), 0);

    return {
      totalRepos: nonForkRepos.length,
      totalStars,
      totalForks,
      primaryLanguage: getPrimaryLanguage(nonForkRepos),
    };
  }, [repos]);

  if (!username) return null;

  return (

    <div className="container mx-auto px-3 sm:px-4">
      <section className="mt-6 space-y-6 sm:mt-8 sm:space-y-8">
        {error && (
          <div className="rounded-2xl border border-red-400/45 bg-red-500/12 p-3 text-sm text-red-100 sm:p-4">
            Failed to load GitHub data: {error}
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-[340px_minmax(0,1fr)]">
          <article className="fade-up fade-up-delay-1 rounded-3xl border border-white/10 bg-[#0d1421]/75 p-4 shadow-[0_20px_60px_rgba(0,0,0,0.35)] backdrop-blur-xl sm:p-6">
            {loading && !profile ? (
              <div className="animate-pulse space-y-4">
                <div className="h-20 w-20 rounded-2xl bg-zinc-800" />
                <div className="h-4 w-40 rounded bg-zinc-800" />
                <div className="h-3 w-56 rounded bg-zinc-800" />
              </div>
            ) : profile ? (
              <div>
                <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:items-start sm:text-left">
                  <div className="h-20 w-20 shrink-0 overflow-hidden rounded-2xl ring-2 ring-white/10">
                    <Image
                      src={profile.avatar_url}
                      alt={`${profile.login} avatar`}
                      width={80}
                      height={80}
                      sizes="80px"
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <div className="min-w-0">
                    <h2 className="truncate text-lg font-extrabold leading-tight text-white sm:text-xl">
                      {profile.name ?? profile.login}
                    </h2>
                    <a
                      href={profile.html_url}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-1 inline-block text-sm font-medium text-cyan-300 transition-colors hover:text-white"
                    >
                      @{profile.login}
                    </a>
                    <p className="mt-2 text-sm leading-relaxed text-zinc-300">{profile.bio ?? "-"}</p>
                  </div>
                </div>

                <dl className="mt-5 grid grid-cols-2 gap-2 sm:mt-6 sm:gap-3">
                  <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                    <dt className="text-[11px] uppercase tracking-[0.18em] text-zinc-400">Repos</dt>
                    <dd className="mt-1 text-lg font-black text-white sm:text-xl">
                      {formatCount(stats.totalRepos)}
                    </dd>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                    <dt className="text-[11px] uppercase tracking-[0.18em] text-zinc-400">Stars</dt>
                    <dd className="mt-1 text-lg font-black text-white sm:text-xl">
                      {formatCount(stats.totalStars)}
                    </dd>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                    <dt className="text-[11px] uppercase tracking-[0.18em] text-zinc-400">Forks</dt>
                    <dd className="mt-1 text-lg font-black text-white sm:text-xl">
                      {formatCount(stats.totalForks)}
                    </dd>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                    <dt className="text-[11px] uppercase tracking-[0.18em] text-zinc-400">Main Stack</dt>
                    <dd className="mt-1 truncate text-base font-bold text-white">
                      {stats.primaryLanguage}
                    </dd>
                  </div>
                </dl>
              </div>
            ) : (
              <div className="text-zinc-400">No profile data found.</div>
            )}
          </article>

          <article className="fade-up fade-up-delay-2 rounded-3xl border border-white/10 bg-[#0d1421]/75 p-4 shadow-[0_20px_60px_rgba(0,0,0,0.35)] backdrop-blur-xl sm:p-6">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <h3 className="text-base font-bold tracking-tight text-white sm:text-lg">
                Contribution Activity
              </h3>
              <span className="rounded-full border border-white/12 bg-white/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-300">
                Last 12 Months
              </span>
            </div>

            <div className="rounded-2xl border border-white/10 bg-[#080b12] p-2 sm:p-4">
              <div className="mx-auto w-full max-w-[930px] overflow-x-auto">
                <Image
                  src={contributionsSvg}
                  alt="GitHub contributions chart"
                  width={663}
                  height={104}
                  sizes="(max-width: 640px) 100vw, 930px"
                  className="mx-auto block h-auto w-full min-w-0"
                  loading="lazy"
                  unoptimized
                />
              </div>
              <p className="mt-3 text-xs text-zinc-400">
                Contribution chart source: external public rendering service.
              </p>
            </div>
          </article>
        </div>

        <section className="fade-up fade-up-delay-3">
          <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
            <h3 className="text-lg font-black tracking-tight text-white sm:text-xl">
              Top Repositories
            </h3>
            <p className="text-xs uppercase tracking-[0.18em] text-zinc-400">
              Ranked by stargazer count
            </p>
          </div>

          {loading && repos.length === 0 ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {[...Array.from({ length: 3 })].map((_, index) => (
                <div key={index} className="h-40 animate-pulse rounded-2xl bg-zinc-800/50" />
              ))}
            </div>
          ) : topReposWithDomin.length === 0 ? (
            <div className="rounded-2xl border border-white/10 bg-[#0d1421]/70 p-4 text-zinc-300 sm:p-6">
              No repositories available.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {topReposWithDomin.map((repo, index) => (
                <div
                  key={repo.id}
                  className="fade-up group relative overflow-hidden rounded-2xl border border-white/10 bg-[#0d1421]/75 p-4 shadow-[0_16px_35px_rgba(0,0,0,0.28)] transition-all duration-300 hover:-translate-y-1 hover:border-white/35 hover:bg-white/10 sm:p-5"
                  style={{ animationDelay: `${120 + index * 80}ms` }}
                >
                  <span className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  <div className="font-bold tracking-tight text-zinc-50 transition-colors group-hover:text-white">
                    {repo.name}
                  </div>
                  <div className="font-light tracking-tight text-zinc-50 transition-colors group-hover:text-white">
                    {repo.description ?? "No description"}
                  </div>
                  <div className="mt-4 flex items-center gap-3 text-xs font-semibold text-zinc-300">
                    <span className="rounded-full border border-white/12 bg-white/5 px-2.5 py-1">
                      STAR {formatCount(repo.stargazers_count)}
                    </span>
                    <span className="rounded-full border border-white/12 bg-white/5 px-2.5 py-1">
                      FORK {formatCount(repo.forks_count)}
                    </span>
                    <Link
                      href={buildMonoUrl(repo.domin_url)}
                      aria-label={`Preview ${repo.name}`}
                      className="rounded-full border border-white/12 bg-white/5 px-2.5 py-1 transition-colors hover:bg-white/10"
                    >
                      Preview
                    </Link>
                    <a
                      href={repo.html_url}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`Preview Coding ${repo.name}`}
                      className="rounded-full border border-white/12 bg-white/5 px-2.5 py-1 transition-colors hover:bg-white/10"
                    >
                      Preview Coding
                    </a>
                  </div>

                  <div className="mt-3 flex items-center gap-2 text-xs text-zinc-400">
                    <span className="h-2 w-2 rounded-full bg-cyan-400" />
                    {repo.language ?? "Not specified"}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </section>
    </div>
  );
}
