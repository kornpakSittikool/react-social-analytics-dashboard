type VideoCard = {
  id: string;
  title: string;
  artists: string;
  duration: string;
  thumbnail: string;
};

const categories = [
  "ทั้งหมด",
  "เพลง",
  "ไลฟ์สด",
  "มิกซ์",
  "ข่าวสาร",
  "เกม",
  "พอดแคสต์",
  "ฮิปฮอป",
  "เพลงแร็ป",
];

const videos: VideoCard[] = [
  {
    id: "mix-1",
    title: "มิกซ์ของวันนี้",
    artists: "Dj Samir, Itamar Mc, MXZI และอื่นๆ",
    duration: "34:20",
    thumbnail:
      "https://images.unsplash.com/photo-1571330735066-03aaa9429d89?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "mix-2",
    title: "มิกซ์ - GIVEON - Heartbreak Anniversary",
    artists: "Giveon, แซม สมิธ, คาลิด และอื่นๆ",
    duration: "41:09",
    thumbnail:
      "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "mix-3",
    title: "มิกซ์ - NAM DANG NAM SOM",
    artists: "Skai Isyourgod, ลิลนาเวอร์ก, สไปร์ท",
    duration: "28:46",
    thumbnail:
      "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "mix-4",
    title: "ไม่เอาแบดบีส - I don't need a girl like you",
    artists: "ILLSLICK, YoungTrip",
    duration: "3:16",
    thumbnail:
      "https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "mix-5",
    title: "E-HERO Presents RIM SILLY FOOLS x OAK",
    artists: "RIM SILLY FOOLS, OAK",
    duration: "4:55",
    thumbnail:
      "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "mix-6",
    title: "DM - ไม่ได้คุยนานแล้ว Feat. ILLSLICK",
    artists: "DM, ILLSLICK, Young",
    duration: "3:44",
    thumbnail:
      "https://images.unsplash.com/photo-1528164344705-47542687000d?auto=format&fit=crop&w=1200&q=80",
  },
];

export default function Content() {
  return (
    <main className="mx-auto w-full max-w-[1560px] px-4 pb-8 pt-5 sm:px-6 lg:px-8">
      <h1 className="sr-only">Music Feed</h1>

      <section className="mb-5 flex gap-2 overflow-x-auto pb-2">
        {categories.map((category, index) => (
          <button
            key={category}
            type="button"
            className={`whitespace-nowrap rounded-xl px-4 py-2 text-sm font-semibold transition-colors ${
              index === 0
                ? "bg-[#f1f1f1] text-[#0f0f0f]"
                : "bg-[#272727] text-[#f1f1f1] hover:bg-[#3a3a3a]"
            }`}
          >
            {category}
          </button>
        ))}
      </section>

      <section className="grid gap-x-5 gap-y-8 md:grid-cols-2 xl:grid-cols-3">
        {videos.map((video) => (
          <article key={video.id} className="group">
            <a href="#" className="block">
              <div className="relative overflow-hidden rounded-2xl bg-zinc-900">
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="aspect-video w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                />
                <span className="absolute bottom-2 right-2 rounded bg-black/75 px-2 py-1 text-xs font-semibold text-zinc-100">
                  {video.duration}
                </span>
                <span className="absolute bottom-2 left-2 rounded bg-black/75 px-2 py-1 text-xs font-semibold text-zinc-100">
                  มิกซ์
                </span>
              </div>
            </a>

            <div className="mt-3 flex gap-3">
              <div className="mt-1 h-9 w-9 shrink-0 rounded-full bg-gradient-to-br from-zinc-500 to-zinc-800" />
              <div className="min-w-0">
                <h2 className="line-clamp-2 text-[1.05rem] font-bold leading-7 text-zinc-100">
                  {video.title}
                </h2>
                <p className="mt-1 line-clamp-2 text-[1.05rem] text-zinc-400">{video.artists}</p>
              </div>
              <button
                type="button"
                aria-label={`More options for ${video.title}`}
                className="ml-auto -mr-1 rounded-full p-1.5 text-zinc-300 transition-colors hover:bg-zinc-800 hover:text-zinc-100"
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden="true">
                  <circle cx="12" cy="5" r="2" />
                  <circle cx="12" cy="12" r="2" />
                  <circle cx="12" cy="19" r="2" />
                </svg>
              </button>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}
