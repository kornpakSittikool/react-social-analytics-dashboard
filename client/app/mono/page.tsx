import { Suspense } from "react";
import MonoPageClient from "./MonoPageClient";

function MonoFallback() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#07090f] px-4">
      <section className="w-full max-w-lg rounded-2xl border border-white/12 bg-[#0d1421]/80 p-6 text-center shadow-[0_25px_70px_rgba(0,0,0,0.45)]">
        <h1 className="text-xl font-black tracking-tight text-white">Mono Gateway</h1>
        <p className="mt-3 text-sm text-zinc-300">กำลังโหลด...</p>
      </section>
    </main>
  );
}

export default function MonoPage() {
  return (
    <Suspense fallback={<MonoFallback />}>
      <MonoPageClient />
    </Suspense>
  );
}
