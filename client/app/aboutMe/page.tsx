import Image from "next/image";

type ExperienceItem = {
    title: string;
    organization: string;
    summary: string;
    bullets: string[];
};


type SkillItem = {
    name: string;
    logo: string;
};

const experienceItems: ExperienceItem[] = [
    {
        title: "2022 - 2023 : Full Stack Developer",
        organization: "MetaverseXR",
        summary:
            "From 2022 to 2023, I worked on software development and deployment projects with a focus on improving system efficiency and organizational workflows.",
        bullets: [
            "Designed and maintained deployment pipelines using GitLab CI/CD on Huawei Cloud and AWS, deploying Dockerized applications for event-based production systems.",
            "Built a CMS for event management, including a scalable registration platform for large event systems.",
            "Developed and tested systems to ensure reliability, security, and data accuracy.",
            "Designed scalable project architectures for both frontend and backend systems.",
        ],
    },
    {
        title: "2023 - Now : Full Stack Developer",
        organization: "Aware (Outsource) - Assigned to AIS, Advanced Info Services Plc.",
        summary:
            "From 2023 to Now, I worked as a Full Stack Developer in a Scrum-based team and Agile, contributing to the development and delivery of business-critical systems.",
        bullets: [
            "Developed and maintained business systems to support organizational and operational needs.",
            "Managed and enhanced sales-related system workflows to align with business requirements.",
            "Integrated EDC-based payment systems to streamline transaction processes.",
            "Prepared systems for production deployment and ensured compatibility with existing infrastructure.",
            "Took ownership of assigned issues from requirement analysis through implementation.",
            "Analyzed root causes and implemented effective solutions for reported issues.",
            "Performed self-testing and validation before handoff to QA/Testers.",
            "Collaborated with QA/Testers to verify fixes and ensure system stability.",
            "Wrote unit tests to ensure system reliability and prevent regressions.",
        ],
    },
];

const skillColumns: SkillItem[][] = [
    [
        { name: "Next.js", logo: "/skills/nextjs.svg" },
        { name: "React.js", logo: "/skills/react.svg" },
        { name: "Angular", logo: "/skills/angular.svg" },
        { name: "Express.js", logo: "/skills/express.svg" },
    ],
    [
        { name: "TypeScript", logo: "/skills/typescript.svg" },
        { name: "JavaScript", logo: "/skills/javascript.svg" },
        { name: "Docker", logo: "/skills/docker.svg" },
    ],
    [
        { name: "Postgres", logo: "/skills/postgresql.svg" },
        { name: "MongoDB", logo: "/skills/mongodb.svg" },
        { name: "Tailwind", logo: "/skills/tailwindcss.svg" },
        { name: "Bootstrap", logo: "/skills/bootstrap.svg" },
    ],
];

export default function AboutMePage() {
    return (
        <main className="min-h-screen px-4 py-8 text-zinc-100 sm:py-10">
            <section className="mx-auto max-w-5xl overflow-hidden">
                <header className="px-6 py-7 text-white sm:px-9 sm:py-9">
                    <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:gap-8">
                        <div>
                            <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">Kornpak Sittikool</h1>
                            <p className="mt-2 text-lg font-medium text-white/90 sm:text-2xl">Software Developer</p>
                        </div>
                    </div>
                </header>

                <div className="space-y-8 px-6 pb-9 pt-7 sm:px-9 sm:pt-9">
                    <section className="grid gap-7 pb-8 md:grid-cols-[1.55fr_1fr]">
                        <article>
                            <h2 className="text-xl font-bold">EXPERIENCE</h2>
                            <p className="mt-3 text-[15px] leading-relaxed text-zinc-300">
                                Backend-focused full-stack developer experienced in designing and implementing reliable web
                                systems and business workflows. Proficient in building RESTful APIs with NestJS and
                                Express, integrating external services such as payment platforms, and deploying applications
                                using Docker and CI/CD pipelines. Strong understanding of system architecture, debugging
                                production issues, and maintaining software stability in real-world environments.
                                Comfortable working in Scrum teams and collaborating with QA and stakeholders to deliver
                                production-ready software.
                            </p>
                        </article>

                        <article>
                            <h2 className="text-xl font-bold">CONTACT</h2>
                            <ul className="mt-3 space-y-1.5 text-[15px] text-zinc-300">
                                <li>
                                    <span className="font-semibold">Phone:</span> 0640614237
                                </li>
                                <li>
                                    <span className="font-semibold">Email:</span> korapatsittkool@gmail.com
                                </li>
                                <li>
                                    <span className="font-semibold">Address:</span> Soi Chan 44, Bangkok, Thailand
                                </li>
                                <li>
                                    <span className="font-semibold">LinkedIn:</span>{" "}
                                    <a
                                        href="https://www.linkedin.com/in/kornpak-sittikool-528b39239/"
                                        target="_blank"
                                        rel="noreferrer"
                                        className="underline underline-offset-2 transition-colors hover:text-white"
                                    >
                                        kornpak-sittikool
                                    </a>
                                </li>
                            </ul>
                        </article>
                    </section>

                    <section className="pb-8">
                        <h2 className="text-xl font-bold">Work experience</h2>
                        <div className="mt-4 space-y-6">
                            {experienceItems.map((item) => (
                                <article key={item.title}>
                                    <h3 className="text-base font-bold">{item.title}</h3>
                                    <p className="mt-1 text-[15px] font-semibold text-zinc-300">{item.organization}</p>
                                    <p className="mt-3 text-[15px] font-semibold leading-relaxed text-zinc-100">
                                        {item.summary}
                                    </p>
                                    <ul className="mt-2 list-disc space-y-1.5 pl-5 text-[15px] leading-relaxed text-zinc-300">
                                        {item.bullets.map((bullet) => (
                                            <li key={bullet}>{bullet}</li>
                                        ))}
                                    </ul>
                                </article>
                            ))}
                        </div>
                    </section>

                    <section className="pb-8">
                        <h2 className="text-xl font-bold">SKILLS</h2>
                        <div className="mt-4 grid gap-4 rounded-xl bg-white/5 p-4 sm:grid-cols-2 md:grid-cols-3">
                            {skillColumns.map((column, columnIndex) => (
                                <div
                                    key={`skills-column-${columnIndex}`}
                                    className={`space-y-2 ${columnIndex > 0 ? "md:border-l md:border-sky-500/80 md:pl-4" : ""}`}
                                >
                                    {column.map((skill) => (
                                        <div key={skill.name} className="flex items-center justify-between gap-3">
                                            <div className="flex min-w-0 items-center gap-2">
                                                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-sm bg-white/95 p-0.5">
                                                    <Image
                                                        src={skill.logo}
                                                        alt={`${skill.name} logo`}
                                                        width={20}
                                                        height={20}
                                                        className="h-5 w-5 object-contain"
                                                    />
                                                </span>
                                                <span className="truncate text-[15px] text-zinc-200">{skill.name}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>
                    </section>
                </div>
            </section>
        </main>
    );
}
