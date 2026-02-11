import Navbar from "@/components/Navbar/Navbar";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
        <section className="rounded-3xl bg-gradient-to-r from-cyan-500 to-blue-500 p-8 text-white shadow-lg">
          <h1 className="text-3xl font-bold tracking-tight">Social Analytics Dashboard</h1>
          <p className="mt-2 text-sm text-cyan-50 sm:text-base">
            Track engagement, audience growth, and campaign performance in one place.
          </p>
        </section>

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
              Total Reach
            </p>
            <p className="mt-3 text-2xl font-bold text-slate-900">124,820</p>
          </article>
          <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
              Engagement Rate
            </p>
            <p className="mt-3 text-2xl font-bold text-slate-900">7.8%</p>
          </article>
          <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
              New Followers
            </p>
            <p className="mt-3 text-2xl font-bold text-slate-900">+2,430</p>
          </article>
        </section>
      </main>
    </div>
  );
}
