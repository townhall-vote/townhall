import { Show, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs"
import { Newsreader, IBM_Plex_Sans, IBM_Plex_Mono } from "next/font/google"
import {
  ArrowRight,
  Bell,
  Bookmark,
  Clock,
  Code2,
  Landmark,
  Mail,
  MapPin,
  Megaphone,
  MessageCircle,
  MessageSquare,
  ScrollText,
  Search,
  Send,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react"

import "./landing.css"

const newsreader = Newsreader({
  subsets: ["latin"],
  variable: "--font-newsreader",
  style: ["normal", "italic"],
})

const plexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-plex-sans",
})

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-plex-mono",
})

const tenets = [
  {
    letter: "a",
    title: "Plain language",
    body: "Any bill, rewritten so it reads like something a friend explained to you over coffee.",
  },
  {
    letter: "b",
    title: "Shown sources",
    body: "Every AI summary lists what it read, what it's unsure about, and how confident it is.",
  },
  {
    letter: "c",
    title: "A next step",
    body: "Every bill page ends with a way to act — message your rep, sign on, or share it.",
  },
  {
    letter: "d",
    title: "No side to take",
    body: "No ads, no party line. We publish the data and the sourcing, and let it speak for itself.",
  },
  {
    letter: "e",
    title: "Built in the open",
    body: "The code is public. Anyone can read it, question it, or help build the next part.",
  },
]

const capabilities = [
  {
    icon: Search,
    title: "Understand bills",
    items: [
      { icon: Search, text: "Search federal, state, and local bills" },
      { icon: MessageSquare, text: "Ask follow-up questions in plain language" },
      { icon: Clock, text: "Watch a bill's timeline and current status" },
      { icon: Bell, text: "Get notified the moment something moves" },
    ],
  },
  {
    icon: Megaphone,
    title: "Take action",
    items: [
      { icon: Mail, text: "Message your representative directly" },
      { icon: Megaphone, text: "Sign on to a position, verified as you" },
      { icon: Bookmark, text: "Bookmark bills to keep following them" },
      { icon: MessageCircle, text: "Add your voice in the comments" },
    ],
  },
  {
    icon: MapPin,
    title: "Your block",
    items: [
      { icon: MapPin, text: "Verify your address, join your neighborhood" },
      { icon: MessageCircle, text: "Open a discussion on a local issue" },
      { icon: Clock, text: "Track city policy from proposal to vote" },
      { icon: Send, text: "Send a monthly digest straight to your reps" },
    ],
  },
  {
    icon: Landmark,
    title: "Know your reps",
    items: [
      { icon: Landmark, text: "Profiles from city council to the Senate" },
      { icon: ScrollText, text: "See how they've actually voted" },
      { icon: Users, text: "Read what other constituents are saying" },
      { icon: Mail, text: "Reach them directly, one verified message" },
    ],
  },
]

export default function Page() {
  return (
    <div
      className={`th-page th-sans ${newsreader.variable} ${plexSans.variable} ${plexMono.variable}`}
    >
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-[var(--th-rule)] bg-[var(--th-paper)]/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <a href="#top" className="flex items-baseline gap-1.5">
            <span className="th-serif text-xl font-medium tracking-tight text-[var(--th-ink)]">
              Townhall
            </span>
            <span className="th-mono text-xs text-[var(--th-verdigris)]">.vote</span>
          </a>

          <nav className="hidden items-center gap-8 md:flex">
            <a
              href="#mission"
              className="th-mono text-[0.7rem] tracking-widest text-[var(--th-ink-soft)] uppercase hover:text-[var(--th-ink)]"
            >
              Mission
            </a>
            <a
              href="#what-you-can-do"
              className="th-mono text-[0.7rem] tracking-widest text-[var(--th-ink-soft)] uppercase hover:text-[var(--th-ink)]"
            >
              What you can do
            </a>
            <a
              href="#representatives"
              className="th-mono text-[0.7rem] tracking-widest text-[var(--th-ink-soft)] uppercase hover:text-[var(--th-ink)]"
            >
              For representatives
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <Show when="signed-out">
              <SignInButton>
                <button className="th-mono rounded-sm px-3 py-2 text-xs tracking-wide text-[var(--th-ink-soft)] uppercase transition-colors hover:text-[var(--th-ink)] focus-visible:ring-2 focus-visible:ring-[var(--th-verdigris)] focus-visible:outline-none">
                  Sign in
                </button>
              </SignInButton>
              <SignUpButton>
                <button className="th-mono rounded-sm bg-[var(--th-verdigris)] px-4 py-2 text-xs tracking-wide text-[var(--th-paper)] uppercase transition-colors hover:bg-[var(--th-verdigris-deep)] focus-visible:ring-2 focus-visible:ring-[var(--th-verdigris)] focus-visible:ring-offset-2 focus-visible:outline-none">
                  Get early access
                </button>
              </SignUpButton>
            </Show>
            <Show when="signed-in">
              <UserButton />
            </Show>
          </div>
        </div>
      </header>

      <main id="top">
        {/* Hero */}
        <section className="mx-auto max-w-6xl px-6 pt-16 pb-12 md:pt-24">
          <p className="th-mono mb-5 text-[0.7rem] tracking-[0.2em] text-[var(--th-gold)] uppercase">
            Public benefit &middot; Open source &middot; No party line
          </p>
          <h1 className="th-serif max-w-3xl text-4xl leading-[1.08] font-medium tracking-tight text-[var(--th-ink)] sm:text-5xl md:text-6xl">
            Every bill, in words you already know.
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-[var(--th-ink-soft)] md:text-lg">
            Townhall turns federal, state, and local legislation into plain
            language, shows exactly where each read comes from, and gives you
            a direct line to the people who represent you.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Show when="signed-out">
              <SignUpButton>
                <button className="th-mono group inline-flex items-center gap-2 rounded-sm bg-[var(--th-ink)] px-5 py-3 text-xs tracking-wide text-[var(--th-paper)] uppercase transition-colors hover:bg-[var(--th-verdigris-deep)] focus-visible:ring-2 focus-visible:ring-[var(--th-verdigris)] focus-visible:ring-offset-2 focus-visible:outline-none">
                  Get early access
                  <ArrowRight
                    className="size-3.5 transition-transform group-hover:translate-x-0.5"
                    aria-hidden
                  />
                </button>
              </SignUpButton>
            </Show>
            <a
              href="#mission"
              className="th-mono rounded-sm border border-[var(--th-rule-strong)] px-5 py-3 text-xs tracking-wide text-[var(--th-ink)] uppercase transition-colors hover:border-[var(--th-ink)] focus-visible:ring-2 focus-visible:ring-[var(--th-verdigris)] focus-visible:outline-none"
            >
              Read the mission
            </a>
          </div>
          <p className="th-mono mt-4 text-[0.7rem] tracking-wide text-[var(--th-ink-faint)]">
            No spam. No ads. No party line.
          </p>
        </section>

        {/* Signature: bill markup demonstration */}
        <section className="mx-auto max-w-6xl px-6 pb-20 md:pb-28">
          <div className="th-paper-texture rounded-sm border border-[var(--th-rule)] bg-[var(--th-paper-card)] p-6 shadow-[0_1px_0_var(--th-rule)] md:p-10">
            <div className="th-mono mb-6 flex flex-wrap items-center justify-between gap-2 text-[0.65rem] tracking-widest text-[var(--th-ink-faint)] uppercase">
              <span>H.R. 4021 &middot; Sec. 3(b), excerpt</span>
              <span className="text-[var(--th-verdigris)]">As Townhall shows it</span>
            </div>

            <div className="grid gap-8 md:grid-cols-2 md:gap-12">
              <div>
                <p className="th-mono mb-3 text-[0.65rem] tracking-widest text-[var(--th-ink-faint)] uppercase">
                  As written
                </p>
                <p className="th-serif text-lg leading-relaxed text-[var(--th-ink-soft)] italic md:text-xl">
                  <span
                    className="th-anim-line th-strike"
                    style={{ animationDelay: "0.1s" }}
                  >
                    Notwithstanding subsection (a),
                  </span>{" "}
                  <span className="th-anim-line" style={{ animationDelay: "0.7s" }}>
                    an eligible entity shall not be precluded from receiving
                    an allocation under this section solely on the basis of
                    prior noncompliance,
                  </span>{" "}
                  <span
                    className="th-anim-line th-strike"
                    style={{ animationDelay: "1.3s" }}
                  >
                    provided that such noncompliance has been remedied not
                    later than 180 days after the date of enactment.
                  </span>
                </p>
              </div>

              <div>
                <p className="th-mono mb-3 text-[0.65rem] tracking-widest text-[var(--th-verdigris)] uppercase">
                  In plain language
                </p>
                <p
                  className="th-anim-line text-lg leading-relaxed text-[var(--th-ink)] md:text-xl"
                  style={{ animationDelay: "1.9s" }}
                >
                  If your organization missed a rule before, you can still
                  get funding — as long as you fix it within six months of
                  this bill becoming law.
                </p>
                <p
                  className="th-anim-line th-mono mt-5 text-[0.7rem] leading-relaxed text-[var(--th-ink-faint)]"
                  style={{ animationDelay: "2.3s" }}
                >
                  Sourced from the bill text and the committee report &middot;
                  confidence: high &middot; illustrative excerpt
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* SEC. 1 — Mission */}
        <section id="mission" className="border-t border-[var(--th-rule)]">
          <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
            <div className="grid gap-8 md:grid-cols-[auto_1fr] md:gap-14">
              <div className="th-serif text-5xl text-[var(--th-verdigris)] md:text-6xl">
                &sect;1
              </div>
              <div className="max-w-2xl">
                <p className="th-mono mb-4 text-[0.7rem] tracking-[0.2em] text-[var(--th-ink-faint)] uppercase">
                  Mission
                </p>
                <p className="th-serif text-2xl leading-snug text-[var(--th-ink)] md:text-3xl">
                  We built Townhall to close the distance between what
                  government does and what you actually understand.
                </p>
                <p className="mt-5 text-base leading-relaxed text-[var(--th-ink-soft)]">
                  Every bill gets a plain-language rewrite. Every AI claim
                  shows its sources and its limits. Every district gets
                  numbers people can point to — and a way to act on them.
                </p>
                <div className="mt-7 flex flex-wrap gap-2">
                  {["Federal", "State", "Local"].map((level) => (
                    <span
                      key={level}
                      className="th-mono rounded-full border border-[var(--th-rule-strong)] px-3 py-1 text-[0.65rem] tracking-widest text-[var(--th-ink-soft)] uppercase"
                    >
                      {level}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SEC. 2 — Tenets */}
        <section className="border-t border-[var(--th-rule)] bg-[var(--th-paper-deep)]">
          <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
            <div className="grid gap-8 md:grid-cols-[auto_1fr] md:gap-14">
              <div className="th-serif text-5xl text-[var(--th-verdigris)] md:text-6xl">
                &sect;2
              </div>
              <div>
                <p className="th-mono mb-4 text-[0.7rem] tracking-[0.2em] text-[var(--th-ink-faint)] uppercase">
                  What we stand for
                </p>
                <dl className="divide-y divide-[var(--th-rule)] border-y border-[var(--th-rule)]">
                  {tenets.map((tenet) => (
                    <div
                      key={tenet.letter}
                      className="grid gap-2 py-6 sm:grid-cols-[3rem_14rem_1fr] sm:items-baseline sm:gap-6"
                    >
                      <dt className="th-mono text-sm text-[var(--th-gold)]">
                        ({tenet.letter})
                      </dt>
                      <dt className="th-serif text-lg text-[var(--th-ink)]">
                        {tenet.title}
                      </dt>
                      <dd className="text-sm leading-relaxed text-[var(--th-ink-soft)] sm:text-base">
                        {tenet.body}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          </div>
        </section>

        {/* SEC. 3 — What you can do */}
        <section
          id="what-you-can-do"
          className="border-t border-[var(--th-rule)]"
        >
          <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
            <div className="grid gap-8 md:grid-cols-[auto_1fr] md:gap-14">
              <div className="th-serif text-5xl text-[var(--th-verdigris)] md:text-6xl">
                &sect;3
              </div>
              <div>
                <p className="th-mono mb-4 text-[0.7rem] tracking-[0.2em] text-[var(--th-ink-faint)] uppercase">
                  What you can do
                </p>
                <div className="grid gap-px overflow-hidden rounded-sm border border-[var(--th-rule)] bg-[var(--th-rule)] sm:grid-cols-2">
                  {capabilities.map((group) => {
                    const GroupIcon = group.icon
                    return (
                      <div key={group.title} className="bg-[var(--th-paper)] p-7">
                        <div className="mb-5 flex items-center gap-2.5">
                          <GroupIcon
                            className="size-4 text-[var(--th-verdigris)]"
                            aria-hidden
                          />
                          <h3 className="th-serif text-xl text-[var(--th-ink)]">
                            {group.title}
                          </h3>
                        </div>
                        <ul className="space-y-3">
                          {group.items.map((item) => {
                            const ItemIcon = item.icon
                            return (
                              <li
                                key={item.text}
                                className="flex items-start gap-2.5 text-sm leading-relaxed text-[var(--th-ink-soft)]"
                              >
                                <ItemIcon
                                  className="mt-0.5 size-3.5 shrink-0 text-[var(--th-ink-faint)]"
                                  aria-hidden
                                />
                                {item.text}
                              </li>
                            )
                          })}
                        </ul>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SEC. 4 — For representatives */}
        <section
          id="representatives"
          className="border-t border-[var(--th-rule)] bg-[var(--th-ink)]"
        >
          <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
            <div className="grid gap-8 md:grid-cols-[auto_1fr] md:gap-14">
              <div className="th-serif text-5xl text-[var(--th-gold)] md:text-6xl">
                &sect;4
              </div>
              <div className="max-w-2xl">
                <p className="th-mono mb-4 text-[0.7rem] tracking-[0.2em] text-[color-mix(in_oklab,var(--th-paper)_60%,transparent)] uppercase">
                  For representatives
                </p>
                <p className="th-serif text-2xl leading-snug text-[var(--th-paper)] md:text-3xl">
                  A direct line back to your district.
                </p>
                <p className="mt-5 text-base leading-relaxed text-[color-mix(in_oklab,var(--th-paper)_75%,transparent)]">
                  Verified offices get a dashboard showing where the district
                  stands on a bill, an AI-built summary of constituent
                  sentiment, and the messages and comments people actually
                  want you to see. We verify every office by hand.
                </p>
                <div className="mt-7 flex flex-wrap gap-6">
                  <div className="flex items-center gap-2 text-sm text-[color-mix(in_oklab,var(--th-paper)_85%,transparent)]">
                    <ShieldCheck className="size-4 text-[var(--th-gold)]" aria-hidden />
                    Manually verified offices
                  </div>
                  <div className="flex items-center gap-2 text-sm text-[color-mix(in_oklab,var(--th-paper)_85%,transparent)]">
                    <Sparkles className="size-4 text-[var(--th-gold)]" aria-hidden />
                    AI sentiment, sourced and scoped
                  </div>
                </div>
                <a
                  href="mailto:offices@townhall.vote"
                  className="th-mono mt-8 inline-flex items-center gap-2 rounded-sm border border-[color-mix(in_oklab,var(--th-paper)_35%,transparent)] px-5 py-3 text-xs tracking-wide text-[var(--th-paper)] uppercase transition-colors hover:border-[var(--th-paper)] focus-visible:ring-2 focus-visible:ring-[var(--th-gold)] focus-visible:outline-none"
                >
                  Register your office
                  <ArrowRight className="size-3.5" aria-hidden />
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="border-t border-[var(--th-rule)]">
          <div className="mx-auto max-w-6xl px-6 py-20 text-center md:py-28">
            <p className="th-serif mx-auto max-w-2xl text-3xl leading-snug text-[var(--th-ink)] md:text-4xl">
              Read the bill. Reach your rep. Repeat.
            </p>
            <div className="mt-8">
              <Show when="signed-out">
                <SignUpButton>
                  <button className="th-mono inline-flex items-center gap-2 rounded-sm bg-[var(--th-verdigris)] px-6 py-3 text-xs tracking-wide text-[var(--th-paper)] uppercase transition-colors hover:bg-[var(--th-verdigris-deep)] focus-visible:ring-2 focus-visible:ring-[var(--th-verdigris)] focus-visible:ring-offset-2 focus-visible:outline-none">
                    Get early access
                    <ArrowRight className="size-3.5" aria-hidden />
                  </button>
                </SignUpButton>
              </Show>
              <Show when="signed-in">
                <span className="th-mono text-xs tracking-wide text-[var(--th-ink-soft)] uppercase">
                  You&apos;re on the list — thanks for being early.
                </span>
              </Show>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-[var(--th-rule)]">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-6 py-10 md:flex-row">
          <div className="flex items-baseline gap-1.5">
            <span className="th-serif text-base text-[var(--th-ink)]">Townhall</span>
            <span className="th-mono text-xs text-[var(--th-verdigris)]">.vote</span>
          </div>
          <a
            href="https://github.com/townhall-vote/townhall"
            className="th-mono inline-flex items-center gap-2 text-[0.7rem] tracking-widest text-[var(--th-ink-soft)] uppercase hover:text-[var(--th-ink)]"
          >
            <Code2 className="size-3.5" aria-hidden />
            Open source on GitHub
          </a>
          <p className="th-mono text-[0.7rem] tracking-widest text-[var(--th-ink-faint)] uppercase">
            Public benefit &middot; No party line
          </p>
        </div>
      </footer>
    </div>
  )
}
