import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({ component: Home })

const LINKS = {
  about: 'https://jpmitra.netlify.app/blog/byohp',
  instagram: 'https://www.instagram.com/byohp/',
  discord: 'https://discord.gg/JpEKy5hkS',
}

const NEXT_EVENT = {
  title: 'BYOHP SILENT DISCO',
  installment: 'III', // third installment
  dayOfWeek: 'SAT',
  monthAbbr: 'MAY',
  dayOfMonth: '16',
  year: '2026',
  startTime: '1:45 PM',
  venue: 'PRIMITIVE COFFEE CO',
  venueUrl: 'https://www.primitivecoffee.co/',
  // Calendar payload — Nashville, TN. CDT (UTC-5) on 2026-05-16.
  // 1:45 PM CDT → 18:45 UTC, 6:00 PM CDT → 23:00 UTC.
  isoStart: '20260516T184500Z',
  isoEnd: '20260516T230000Z',
  summary: 'BYOHP Silent Disco — Installment III',
  calendarDescription:
    'Free silent-disco transmission. Bring your headphones, tips split three ways.',
  going: 5,
  capacity: 40,
  rsvpUrl: 'https://partiful.com/e/1xRCpjbcKQPkxkjNFTZ9?c=WxeYVy5w',
}

// Schedule of upcoming-or-current events. Add a new entry each time an
// event gets scheduled; the corner-stamp transmission number derives
// from this list. Once an event's end time passes, the stamp auto-
// advances to the next entry (or one beyond the last if no future
// event has been added yet).
const EVENT_SCHEDULE: ReadonlyArray<{ number: number; endsAtIso: string }> = [
  { number: 3, endsAtIso: '20260516T230000Z' }, // May 16, 2026, 6:00 PM CDT
]

function Home() {
  return (
    <main className="relative w-full overflow-x-hidden bg-ink text-paper">
      <HeroSection />
      <EventSection />
      <StatusFooter />
    </main>
  )
}

/* -------------------------------------------------------------------------- */
/*  Sections                                                                  */
/* -------------------------------------------------------------------------- */

function HeroSection() {
  return (
    <section className="bg-grain relative flex min-h-svh w-full flex-col overflow-hidden">
      {/* Top-edge hairline */}
      <div
        className="absolute top-0 right-0 left-0 z-30 h-px bg-paper/15"
        aria-hidden
      />

      {/* Ambient backdrop */}
      <BackgroundRings />
      <div className="bg-dotgrid absolute inset-0 opacity-60" aria-hidden />

      {/* Header */}
      <header className="relative z-20 flex items-center justify-between px-5 pt-5 sm:px-10 sm:pt-7">
        <a
          href="/"
          className="group flex items-center gap-3"
          aria-label="BYOHP home"
        >
          <span className="font-mono text-[11px] tracking-[0.32em] text-paper/80 transition-colors group-hover:text-paper sm:text-xs">
            BYOHP
            <span className="text-pink">.</span>
          </span>
        </a>

        <a
          href={LINKS.about}
          target="_blank"
          rel="noopener noreferrer"
          className="group relative flex items-center gap-2 font-mono text-[11px] tracking-[0.32em] text-paper/85 transition-colors hover:text-paper sm:text-xs"
        >
          <span className="relative">
            ABOUT
            <span className="absolute -bottom-1 left-0 h-px w-0 bg-pink transition-all duration-300 group-hover:w-full" />
          </span>
          <ArrowOut className="h-3 w-3 text-pink transition-transform duration-300 group-hover:-translate-y-px group-hover:translate-x-px" />
        </a>
      </header>

      <CornerStamp />

      {/* Hero content fills remaining vertical space */}
      <div className="relative z-10 flex flex-1 flex-col items-start justify-center px-5 pt-12 pb-20 sm:px-10 sm:pt-12 sm:pb-24">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 sm:gap-14">
          {/* Eyebrow */}
          <div
            className="anim-rise flex items-center gap-3"
            style={{ animationDelay: '60ms' }}
          >
            <span
              className="h-px w-8 bg-pink sm:w-12"
              aria-hidden
            />
            <span className="font-mono text-[10px] tracking-[0.32em] text-paper/70 sm:text-xs">
              EST. 2026
            </span>
          </div>

          {/* Type stack */}
          <div
            className="anim-rise flex items-stretch gap-5 sm:gap-8"
            style={{ animationDelay: '180ms' }}
          >
            <div className="pink-rule shrink-0" aria-hidden />
            <h1 className="tight font-display leading-[0.82] text-paper">
              <span className="block text-[clamp(3.4rem,11vw,9.5rem)]">
                BRING YOUR OWN
              </span>
              <span className="block text-[clamp(4.2rem,15vw,13rem)] text-pink">
                HEADPHONES<span className="text-paper">.</span>
              </span>
            </h1>
          </div>

          {/* Tagline + supporting line */}
          <div
            className="anim-rise flex flex-col gap-6 pl-7 sm:flex-row sm:items-end sm:justify-between sm:gap-12 sm:pl-12"
            style={{ animationDelay: '320ms' }}
          >
            <p className="font-display text-[clamp(1.6rem,3.4vw,2.4rem)] leading-[1] tracking-wide text-paper">
              FREE TO <span className="text-pink">SHOW UP.</span>
              <br className="hidden sm:block" />{' '}
              EASY TO <span className="text-pink">BELONG.</span>
            </p>
            <p className="max-w-sm text-sm leading-relaxed text-paper/65 sm:text-[15px]">
              A blueprint for free silent-disco events that build community
              while supporting artists, nonprofits, and the local businesses on
              the block.
            </p>
          </div>

          {/* Socials */}
          <div
            className="anim-rise mt-2 flex flex-col gap-5 pl-7 sm:pl-12"
            style={{ animationDelay: '460ms' }}
          >
            <div className="flex items-center gap-3">
              <span
                className="h-px w-6 bg-paper/40"
                aria-hidden
              />
              <span className="font-mono text-[10px] tracking-[0.32em] text-paper/55 sm:text-[11px]">
                TUNE IN
              </span>
            </div>

            <ul className="flex flex-wrap items-stretch gap-3 sm:gap-4">
              <li>
                <SocialLink
                  href={LINKS.instagram}
                  label="INSTAGRAM"
                  handle="@BYOHP"
                  icon={<InstagramGlyph />}
                />
              </li>
              <li>
                <SocialLink
                  href={LINKS.discord}
                  label="DISCORD"
                  handle="JOIN THE SERVER"
                  icon={<DiscordGlyph />}
                />
              </li>
            </ul>
          </div>

          {/* Scroll cue */}
          <div
            className="anim-rise mt-4 flex items-center gap-3 pl-7 sm:pl-12"
            style={{ animationDelay: '600ms' }}
          >
            <span className="h-px w-6 bg-pink" aria-hidden />
            <a
              href="#next-event"
              className="font-mono text-[10px] tracking-[0.32em] text-paper/55 transition-colors hover:text-paper sm:text-[11px]"
            >
              NEXT TRANSMISSION ↓
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

function EventSection() {
  const e = NEXT_EVENT
  const remaining = e.capacity - e.going

  return (
    <section
      id="next-event"
      className="relative w-full border-t border-paper/10 px-5 py-20 sm:px-10 sm:py-28"
    >
      {/* Subtle dot-grid drift to keep the canvas alive between sections */}
      <div className="bg-dotgrid absolute inset-0 opacity-30" aria-hidden />
      {/* Pink corner accent */}
      <div className="absolute top-8 right-5 z-0 hidden sm:right-10 sm:block" aria-hidden>
        <div className="flex flex-col items-end gap-1">
          <span className="h-px w-16 bg-pink/60" />
          <span className="h-px w-8 bg-pink/30" />
        </div>
      </div>

      <div className="relative z-10 mx-auto max-w-6xl">
        {/* Eyebrow */}
        <div className="flex items-center gap-3">
          <span className="h-px w-8 bg-pink sm:w-12" aria-hidden />
          <span className="font-mono text-[10px] tracking-[0.32em] text-paper/70 sm:text-xs">
            NEXT TRANSMISSION
            <span className="mx-2 text-pink">/</span>
            INSTALLMENT {e.installment}
          </span>
        </div>

        <div className="mt-12 grid gap-12 sm:mt-16 sm:grid-cols-[auto_1fr] sm:gap-x-16 sm:gap-y-12">
          {/* Date stamp */}
          <DateStamp
            dayOfWeek={e.dayOfWeek}
            monthAbbr={e.monthAbbr}
            dayOfMonth={e.dayOfMonth}
            year={e.year}
          />

          {/* Details */}
          <div className="flex flex-col gap-9">
            {/* Title */}
            <div>
              <h2 className="tight font-display leading-[0.85] text-paper">
                <span className="block text-[clamp(2.4rem,6.5vw,5rem)]">
                  BYOHP<span className="text-pink">.</span>
                </span>
                <span className="block text-[clamp(2.8rem,8vw,6.4rem)]">
                  SILENT <span className="text-pink">DISCO.</span>
                </span>
              </h2>
              <p className="mt-5 max-w-md text-sm leading-relaxed text-paper/65 sm:text-[15px]">
                Third installment. Headphones in. Speakers off. Tips split
                three ways. Show up, dance on the block, leave it warmer
                than you found it.
              </p>
            </div>

            {/* Meta grid */}
            <dl className="grid gap-6 sm:grid-cols-2 sm:gap-8">
              <Meta
                label="WHEN"
                value={
                  <span className="inline-flex items-center gap-3">
                    {e.startTime}
                    <CalendarTrigger />
                  </span>
                }
              />
              <Meta
                label="WHERE"
                value={
                  <a
                    href={e.venueUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group/venue relative inline-block transition-colors hover:text-pink"
                  >
                    {e.venue}
                    <span className="absolute -bottom-1 left-0 h-px w-0 bg-pink transition-all duration-300 group-hover/venue:w-full" />
                  </a>
                }
              />
            </dl>

            {/* Capacity */}
            <Capacity going={e.going} total={e.capacity} remaining={remaining} />

            {/* CTA */}
            <RsvpButton href={e.rsvpUrl} />
          </div>
        </div>
      </div>
    </section>
  )
}

function StatusFooter() {
  return (
    <footer className="relative z-10 w-full border-t border-paper/10 bg-ink/80 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-4 sm:px-10 sm:py-5">
        <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.28em] text-paper/55 sm:text-[11px]">
          <span
            className="anim-blink inline-block h-1.5 w-1.5 rounded-full bg-pink"
            aria-hidden
          />
          <span>BROADCASTING SOON</span>
        </div>
        <div className="hidden items-center gap-2 font-mono text-[10px] tracking-[0.28em] text-paper/45 sm:flex sm:text-[11px]">
          <span>
            BYOHP<span className="text-pink">.CO</span>
          </span>
          <span className="text-paper/25">/</span>
          <span>
            BY{' '}
            <a
              href="https://jpmitra.netlify.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="relative text-paper/70 transition-colors hover:text-pink"
            >
              JPM
              <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-pink transition-all duration-300 hover:w-full" />
            </a>
          </span>
        </div>
        <div className="font-mono text-[10px] tracking-[0.28em] text-paper/55 sm:text-[11px]">
          <span className="text-paper/35">©</span> MMXXVI
        </div>
      </div>
    </footer>
  )
}

/* -------------------------------------------------------------------------- */
/*  Event helpers                                                             */
/* -------------------------------------------------------------------------- */

function DateStamp({
  dayOfWeek,
  monthAbbr,
  dayOfMonth,
  year,
}: {
  dayOfWeek: string
  monthAbbr: string
  dayOfMonth: string
  year: string
}) {
  return (
    <div className="flex items-stretch gap-4 sm:gap-6">
      {/* Left rail: day-of-week + year */}
      <div className="flex flex-col justify-between py-1 font-mono text-[10px] tracking-[0.32em] text-paper/65 sm:text-xs">
        <span>{dayOfWeek}</span>
        <span className="text-paper/35">{year}</span>
      </div>

      <span className="w-px self-stretch bg-pink" aria-hidden />

      {/* Date */}
      <div className="flex flex-col leading-none">
        <span className="font-display text-[clamp(5.5rem,16vw,11rem)] leading-[0.82] text-pink">
          {dayOfMonth}
        </span>
        <span className="font-display text-[clamp(1.8rem,4.5vw,3rem)] leading-none tracking-wide text-paper/85">
          {monthAbbr}
        </span>
      </div>
    </div>
  )
}

function Meta({
  label,
  value,
}: {
  label: string
  value: React.ReactNode
}) {
  return (
    <div>
      <dt className="flex items-center gap-2 font-mono text-[9px] tracking-[0.32em] text-paper/45 sm:text-[10px]">
        <span className="h-px w-3 bg-pink" aria-hidden />
        {label}
      </dt>
      <dd className="mt-2 font-display text-2xl tracking-wide text-paper sm:text-[1.75rem]">
        {value}
      </dd>
    </div>
  )
}

function Capacity({
  going,
  total,
  remaining,
}: {
  going: number
  total: number
  remaining: number
}) {
  return (
    <div>
      <div className="flex items-center gap-2 font-mono text-[9px] tracking-[0.32em] text-paper/45 sm:text-[10px]">
        <span className="h-px w-3 bg-pink" aria-hidden />
        ROOM
      </div>
      <div className="mt-2 flex flex-wrap items-baseline gap-x-4 gap-y-1">
        <span className="font-display text-2xl tracking-wide text-paper sm:text-[1.75rem]">
          {going}
          <span className="text-paper/30"> / {total}</span>
        </span>
        <span className="font-mono text-[10px] tracking-[0.28em] text-paper/55 sm:text-[11px]">
          {remaining} SPOTS LEFT
        </span>
      </div>
      <div
        className="mt-3 flex gap-[3px]"
        role="meter"
        aria-valuemin={0}
        aria-valuemax={total}
        aria-valuenow={going}
        aria-label={`${going} of ${total} spots filled`}
      >
        {Array.from({ length: total }).map((_, i) => (
          <span
            key={i}
            aria-hidden
            className={`h-2 flex-1 ${i < going ? 'bg-pink' : 'bg-paper/12'}`}
          />
        ))}
      </div>
    </div>
  )
}

function CalendarTrigger() {
  const e = NEXT_EVENT
  const gcalUrl =
    'https://calendar.google.com/calendar/render?' +
    new URLSearchParams({
      action: 'TEMPLATE',
      text: e.summary,
      dates: `${e.isoStart}/${e.isoEnd}`,
      details: `${e.calendarDescription}\n\nRSVP: ${e.rsvpUrl}`,
      location: 'Primitive Coffee Co, Nashville, TN',
    }).toString()

  const ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//BYOHP//Site//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:byohp-silent-disco-${e.isoStart}@byohp.co`,
    `DTSTAMP:${e.isoStart}`,
    `DTSTART:${e.isoStart}`,
    `DTEND:${e.isoEnd}`,
    `SUMMARY:${e.summary}`,
    'LOCATION:Primitive Coffee Co\\, Nashville\\, TN',
    `DESCRIPTION:${e.calendarDescription} RSVP: ${e.rsvpUrl}`,
    `URL:${e.rsvpUrl}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n')

  const icsHref = `data:text/calendar;charset=utf-8,${encodeURIComponent(ics)}`

  // Close <details> after the user picks an option.
  const closeOnClick = (
    ev: React.MouseEvent<HTMLAnchorElement>,
  ) => {
    ev.currentTarget.closest('details')?.removeAttribute('open')
  }

  return (
    <details className="group/cal relative inline-block align-middle">
      <summary
        aria-label="Add to calendar"
        title="Add to calendar"
        className="flex h-9 w-9 cursor-pointer list-none items-center justify-center border border-paper/20 text-paper/70 transition-colors hover:border-pink hover:text-pink focus-visible:border-pink focus-visible:text-pink focus-visible:outline-none [&::-webkit-details-marker]:hidden"
      >
        <CalendarGlyph className="h-4 w-4" />
      </summary>
      <div className="absolute top-full left-0 z-30 mt-2 flex w-56 flex-col border border-paper/20 bg-ink/95 shadow-2xl backdrop-blur-md">
        <span
          aria-hidden
          className="border-b border-paper/10 px-4 py-2.5 font-mono text-[9px] tracking-[0.32em] text-paper/40"
        >
          ADD TO CALENDAR
        </span>
        <a
          href={gcalUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={closeOnClick}
          className="flex items-center gap-3 px-4 py-3 font-mono text-[10px] tracking-[0.28em] text-paper/85 transition-colors hover:bg-pink/10 hover:text-pink"
        >
          <span className="h-px w-3 bg-pink" aria-hidden />
          GOOGLE CALENDAR
          <ArrowOut className="ml-auto h-3 w-3" />
        </a>
        <a
          href={icsHref}
          download="byohp-silent-disco.ics"
          onClick={closeOnClick}
          className="flex items-center gap-3 border-t border-paper/10 px-4 py-3 font-mono text-[10px] tracking-[0.28em] text-paper/85 transition-colors hover:bg-pink/10 hover:text-pink"
        >
          <span className="h-px w-3 bg-pink" aria-hidden />
          APPLE / .ICS FILE
          <ArrowOut className="ml-auto h-3 w-3" />
        </a>
      </div>
    </details>
  )
}

function CalendarGlyph({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="5" width="18" height="16" rx="1.5" />
      <path d="M3 10 H21" />
      <path d="M8 3 V7" />
      <path d="M16 3 V7" />
      <circle cx="12" cy="15" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  )
}

function RsvpButton({ href }: { href: string }) {
  return (
    <div className="mt-2">
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative inline-flex w-fit items-center gap-3 bg-pink px-7 py-4 font-mono text-[11px] tracking-[0.32em] text-ink transition-transform duration-200 hover:-translate-x-0.5 hover:-translate-y-0.5 sm:px-9 sm:py-5 sm:text-xs"
      >
        {/* Offset shadow that locks into place on hover */}
        <span
          aria-hidden
          className="absolute inset-0 -z-10 translate-x-2 translate-y-2 border border-paper/40 transition-transform duration-200 group-hover:translate-x-0 group-hover:translate-y-0"
        />
        <span className="font-bold">RSVP ON PARTIFUL</span>
        <ArrowOut className="h-3.5 w-3.5" />
      </a>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*  Hero helpers                                                              */
/* -------------------------------------------------------------------------- */

function SocialLink({
  href,
  label,
  handle,
  icon,
}: {
  href: string
  label: string
  handle: string
  icon: React.ReactNode
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative flex items-center gap-4 border border-paper/15 bg-paper/[0.02] px-5 py-4 transition-all duration-300 hover:border-pink hover:bg-pink/5 sm:px-6 sm:py-5"
    >
      <Corner className="-top-px -left-px" />
      <Corner className="-top-px -right-px rotate-90" />
      <Corner className="-right-px -bottom-px rotate-180" />
      <Corner className="-bottom-px -left-px -rotate-90" />

      <span className="flex h-9 w-9 items-center justify-center text-paper transition-colors duration-300 group-hover:text-pink sm:h-10 sm:w-10">
        {icon}
      </span>
      <span className="flex flex-col">
        <span className="font-mono text-[9px] tracking-[0.32em] text-paper/50 transition-colors duration-300 group-hover:text-pink/80 sm:text-[10px]">
          {label}
        </span>
        <span className="font-display text-xl leading-none tracking-wide text-paper transition-colors duration-300 sm:text-2xl">
          {handle}
        </span>
      </span>
      <ArrowOut className="ml-2 h-3 w-3 text-paper/40 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-pink" />
    </a>
  )
}

function Corner({ className = '' }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={`pointer-events-none absolute h-2 w-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100 ${className}`}
    >
      <span className="absolute top-0 left-0 h-px w-2 bg-pink" />
      <span className="absolute top-0 left-0 h-2 w-px bg-pink" />
    </span>
  )
}

// Parse iCal-style UTC stamps like "20260516T230000Z" into a Date.
function parseIcalZulu(s: string): Date {
  const m = s.match(/^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})Z$/)
  if (!m) return new Date(NaN)
  return new Date(`${m[1]}-${m[2]}-${m[3]}T${m[4]}:${m[5]}:${m[6]}Z`)
}

// Corner-stamp transmission number = next-upcoming event's number.
// Once that event's end time passes, the stamp advances to the next
// schedule entry — or one beyond the last known entry if no future
// event has been added yet.
function currentTransmissionNumber(now: Date = new Date()): string {
  const upcoming = EVENT_SCHEDULE.find(
    (e) => parseIcalZulu(e.endsAtIso) > now,
  )
  const n = upcoming
    ? upcoming.number
    : EVENT_SCHEDULE.length > 0
      ? EVENT_SCHEDULE[EVENT_SCHEDULE.length - 1].number + 1
      : 1
  return String(n).padStart(3, '0')
}

function CornerStamp() {
  return (
    <div className="pointer-events-none absolute top-20 right-5 z-10 hidden flex-col items-end gap-1 sm:top-24 sm:right-10 sm:flex">
      <span className="font-mono text-[10px] tracking-[0.32em] text-paper/45">
        TRANSMISSION
      </span>
      <div className="flex items-stretch gap-2">
        <span className="font-display text-3xl leading-none text-paper/80">
          NO.
        </span>
        <span className="w-px bg-pink" aria-hidden />
        <span className="font-display text-3xl leading-none text-pink">
          {currentTransmissionNumber()}
        </span>
      </div>
    </div>
  )
}

function BackgroundRings() {
  return (
    <div
      className="pointer-events-none absolute inset-0 z-0 flex items-end justify-end overflow-hidden"
      aria-hidden
    >
      <svg
        viewBox="0 0 800 800"
        className="anim-pulse-ring absolute -right-[20%] -bottom-[28%] h-[110vmin] w-[110vmin] sm:-right-[8%] sm:-bottom-[20%]"
        fill="none"
      >
        <defs>
          <radialGradient id="ringFade" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FF1F6F" stopOpacity="0.0" />
            <stop offset="60%" stopColor="#FF1F6F" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#FF1F6F" stopOpacity="0.0" />
          </radialGradient>
        </defs>
        {[60, 130, 210, 300, 400].map((r) => (
          <circle
            key={r}
            cx="400"
            cy="400"
            r={r}
            stroke="#FF1F6F"
            strokeOpacity={0.18 + (400 - r) / 1600}
            strokeWidth="1"
          />
        ))}
        <circle cx="400" cy="400" r="40" fill="url(#ringFade)" opacity="0.5" />
      </svg>

      {/* Soft vignette to ground the type */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_45%,rgba(10,10,10,0)_0%,rgba(10,10,10,0.85)_70%)]" />
    </div>
  )
}

function InstagramGlyph() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-full w-full"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  )
}

function DiscordGlyph() {
  return (
    <svg viewBox="0 0 24 24" className="h-full w-full" fill="currentColor">
      <path d="M19.54 5.34A17.5 17.5 0 0 0 15.4 4.05a.07.07 0 0 0-.07.03c-.18.32-.38.74-.52 1.07a16.2 16.2 0 0 0-4.82 0 11.4 11.4 0 0 0-.53-1.07.07.07 0 0 0-.07-.03 17.5 17.5 0 0 0-4.14 1.29.06.06 0 0 0-.03.02C2.43 9.06 1.78 12.66 2.1 16.21a.07.07 0 0 0 .03.05 17.6 17.6 0 0 0 5.3 2.69.07.07 0 0 0 .08-.03c.41-.56.77-1.15 1.09-1.78a.07.07 0 0 0-.04-.1 11.6 11.6 0 0 1-1.66-.79.07.07 0 0 1-.01-.12c.11-.08.22-.17.33-.26a.07.07 0 0 1 .07-.01c3.48 1.59 7.25 1.59 10.69 0a.07.07 0 0 1 .07.01c.11.09.22.18.33.26a.07.07 0 0 1-.01.12c-.53.31-1.08.57-1.66.79a.07.07 0 0 0-.04.1c.33.62.69 1.21 1.09 1.78a.07.07 0 0 0 .08.03 17.55 17.55 0 0 0 5.31-2.69.07.07 0 0 0 .03-.05c.39-4.1-.65-7.66-2.74-10.85a.05.05 0 0 0-.03-.02ZM8.52 14.13c-1.04 0-1.9-.95-1.9-2.12s.84-2.12 1.9-2.12c1.07 0 1.92.96 1.9 2.12 0 1.17-.84 2.12-1.9 2.12Zm6.97 0c-1.04 0-1.9-.95-1.9-2.12s.84-2.12 1.9-2.12c1.07 0 1.92.96 1.9 2.12 0 1.17-.83 2.12-1.9 2.12Z" />
    </svg>
  )
}

function ArrowOut({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 12 12"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 9 L9 3" />
      <path d="M4 3 H9 V8" />
    </svg>
  )
}
