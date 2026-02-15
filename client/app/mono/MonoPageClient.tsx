"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

type AvailabilityState = "checking" | "ready" | "unavailable";

function normalizeDominUrl(rawDominUrl: string | null): string | null {
  if (!rawDominUrl) return null;

  try {
    const parsed = new URL(rawDominUrl);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") return null;
    return parsed.toString();
  } catch {
    return null;
  }
}

async function isDominUrlReachable(url: string, timeoutMs: number): Promise<boolean> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    await fetch(url, {
      method: "GET",
      mode: "no-cors",
      cache: "no-store",
      signal: controller.signal,
    });
    return true;
  } catch {
    return false;
  } finally {
    clearTimeout(timeoutId);
  }
}

export default function MonoPageClient() {
  const searchParams = useSearchParams();
  const normalizedDominUrl = useMemo(
    () => normalizeDominUrl(searchParams.get("domin_url")),
    [searchParams],
  );

  const [status, setStatus] = useState<AvailabilityState>("checking");

  useEffect(() => {
    let cancelled = false;

    async function checkDominAvailability() {
      if (!normalizedDominUrl) {
        setStatus("unavailable");
        return;
      }

      setStatus("checking");
      const isReachable = await isDominUrlReachable(normalizedDominUrl, 5000);
      if (!cancelled) {
        setStatus(isReachable ? "ready" : "unavailable");
      }
    }

    checkDominAvailability();
    return () => {
      cancelled = true;
    };
  }, [normalizedDominUrl]);

  if (status === "ready" && normalizedDominUrl) {

    return (
      <main className="flex h-screen w-screen flex-col overflow-hidden bg-gray-900">
        <div className="container mx-auto px-4">
          <nav className="bg-neutral-primary z-20 top-0 start-0 border-b border-b-black border-default">
            <div className="max-w-7xl flex flex-wrap items-center justify-between mx-auto p-4">
              <div className="flex items-center space-x-3 rtl:space-x-reverse">
                <span className="self-center text-xl font-medium whitespace-nowrap">Portfolio</span>
              </div>
            <Link
              href="/"
              className="inline-block origin-center text-base font-medium transition-transform duration-200 hover:scale-110 hover:text-white"
            >
              Back to Main Domain
            </Link>
            </div>

          </nav>
        </div>

        <div className="min-h-0 flex-1 overflow-hidden">
          <iframe
            src={normalizedDominUrl}
            title="Mono target content"
            className="block h-full w-full border-0"
          />
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#07090f] px-4">
      <section className="w-full max-w-lg rounded-2xl border border-white/12 bg-[#0d1421]/80 p-6 text-center shadow-[0_25px_70px_rgba(0,0,0,0.45)]">
        <h1 className="text-xl font-black tracking-tight text-white">Mono Gateway</h1>

        {status === "checking" ? (
          <p className="mt-3 text-sm text-zinc-300">กำลังตรวจสอบระบบปลายทาง...</p>
        ) : (
          <>
            <p className="mt-3 text-sm font-semibold text-red-300">ระบบไม่พร้อมใช้งาน</p>
            <p className="mt-2 text-xs text-zinc-400">
              {normalizedDominUrl
                ? `ไม่สามารถเชื่อมต่อ ${normalizedDominUrl}`
                : "ไม่พบค่า domin_url ที่ถูกต้อง"}
            </p>
          </>
        )}

        <Link
          href="/"
          className="mt-5 inline-flex rounded-lg border border-white/15 bg-white/5 px-4 py-2 text-sm font-medium text-zinc-100 transition-colors hover:bg-white/10"
        >
          กลับหน้าแรก
        </Link>
      </section>
    </main>
  );
}
