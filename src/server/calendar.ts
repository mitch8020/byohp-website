import { createServerFn } from '@tanstack/react-start'
import ICAL from 'ical.js'

const ICAL_URL =
  'https://calendar.google.com/calendar/ical/club.professionalz%40gmail.com/public/basic.ics'

// All BYOHP events are in Nashville Central Time.
const EVENT_TZ = 'America/Chicago'

// Anchor for installment numbering. The earliest BYOHP Silent Disco that
// the public Google Calendar surfaces (after RRULE expansion) is the
// June 20, 2026 occurrence — and that's installment IV. Every other
// silent-disco instance is anchor.number plus its chronological offset.
// (Earlier installments existed in real life but aren't in this calendar
// feed; advance the anchor when older instances become irrelevant.)
const SILENT_DISCO_ANCHOR = {
  startDateIso: '2026-06-20',
  number: 4,
}

const VENUE_URLS: Record<string, string> = {
  'PRIMITIVE COFFEE COMPANY': 'https://www.primitivecoffee.co/',
}

export type EventKind = 'silent-disco' | 'movie-night' | 'other'

export type UpcomingEvent = {
  uid: string
  kind: EventKind
  summary: string
  // ISO UTC strings.
  startIso: string
  endIso: string
  // Cleaned location data (null when the calendar entry has none).
  location: string | null
  venueName: string | null
  venueUrl: string | null
  // Silent disco only — null otherwise.
  installmentNumber: number | null
  installmentRoman: string | null
  // Parsed from the calendar event's description; falls back to the
  // site-wide default RSVP URL when null.
  rsvpUrl: string | null
  // Pre-formatted display strings, all in EVENT_TZ for SSR/CSR stability.
  dayOfWeek: string // SAT
  monthAbbr: string // JUN
  dayOfMonth: string // 20
  year: string // 2026
  startTimeDisplay: string // 1:45 PM
}

export type CalendarData = {
  nextSilentDisco: UpcomingEvent | null
  upcoming: UpcomingEvent[]
  fetchedAt: string
  status: 'ok' | 'fallback'
}

function classify(summary: string): EventKind {
  const s = summary.toLowerCase()
  if (s.includes('silent disco')) return 'silent-disco'
  if (s.includes('movie night')) return 'movie-night'
  return 'other'
}

function toRoman(n: number): string {
  if (n <= 0) return ''
  const map: ReadonlyArray<readonly [number, string]> = [
    [1000, 'M'], [900, 'CM'], [500, 'D'], [400, 'CD'], [100, 'C'],
    [90, 'XC'], [50, 'L'], [40, 'XL'], [10, 'X'], [9, 'IX'],
    [5, 'V'], [4, 'IV'], [1, 'I'],
  ]
  let out = ''
  let x = n
  for (const [v, r] of map) {
    while (x >= v) {
      out += r
      x -= v
    }
  }
  return out
}

function formatInTz(iso: string, tz: string) {
  const d = new Date(iso)
  const parts = (fmt: Intl.DateTimeFormat) =>
    Object.fromEntries(fmt.formatToParts(d).map((p) => [p.type, p.value]))
  const dp = parts(
    new Intl.DateTimeFormat('en-US', {
      timeZone: tz,
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: '2-digit',
    }),
  )
  const tp = parts(
    new Intl.DateTimeFormat('en-US', {
      timeZone: tz,
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    }),
  )
  const period = (tp.dayPeriod || '').toUpperCase()
  return {
    dayOfWeek: (dp.weekday || '').toUpperCase(),
    monthAbbr: (dp.month || '').toUpperCase(),
    dayOfMonth: dp.day || '',
    year: dp.year || '',
    startTimeDisplay: `${tp.hour}:${tp.minute}${period ? ' ' + period : ''}`,
  }
}

function venueNameFromLocation(loc: string | null): string | null {
  if (!loc) return null
  return loc.split(',')[0].trim().toUpperCase()
}

// Pull the first https://partiful.com/... URL out of a free-text
// description. Stops at whitespace, quotes, or closing brackets so we
// don't capture trailing punctuation that the user may have written
// right after the link.
function extractPartifulUrl(text: string | null): string | null {
  if (!text) return null
  const m = text.match(/https:\/\/partiful\.com\/[^\s<>"')]+/i)
  if (!m) return null
  // Strip trailing sentence punctuation that the user likely didn't
  // mean to include in the URL ("…rsvp here: <url>.").
  return m[0].replace(/[.,;!?]+$/, '')
}

type RawInstance = {
  uid: string
  summary: string
  location: string | null
  description: string | null
  startUtc: Date
  endUtc: Date
}

function expandInstances(icsText: string, now: Date): RawInstance[] {
  const jcal = ICAL.parse(icsText)
  const comp = new ICAL.Component(jcal)

  // Register VTIMEZONEs so TZID-tagged dates resolve correctly.
  for (const v of comp.getAllSubcomponents('vtimezone')) {
    const tzid = v.getFirstPropertyValue('tzid') as string | null
    if (tzid) {
      const tz = new ICAL.Timezone({ component: v, tzid })
      ICAL.TimezoneService.register(tz)
    }
  }

  const masters: ICAL.Event[] = []
  const overrides = new Map<string, ICAL.Event[]>()
  for (const v of comp.getAllSubcomponents('vevent')) {
    const event = new ICAL.Event(v)
    if (event.isRecurrenceException()) {
      const arr = overrides.get(event.uid) ?? []
      arr.push(event)
      overrides.set(event.uid, arr)
    } else {
      masters.push(event)
    }
  }

  // Window: 1 year back (needed so the anchor silent disco is visible for
  // installment numbering) and 1 year forward (calendar section horizon).
  const earliest = new Date(now.getTime() - 365 * 24 * 3600 * 1000)
  const horizon = new Date(now.getTime() + 365 * 24 * 3600 * 1000)

  const out: RawInstance[] = []
  const push = (uid: string, ev: ICAL.Event, startTime: ICAL.Time) => {
    const startJs = startTime.toJSDate()
    if (startJs < earliest || startJs > horizon) return
    const endTime = ev.endDate
    out.push({
      uid,
      summary: ev.summary || '',
      location: ev.location,
      description: ev.description,
      startUtc: startJs,
      endUtc: endTime.toJSDate(),
    })
  }

  for (const mst of masters) {
    if (!mst.isRecurring()) {
      push(mst.uid, mst, mst.startDate)
      continue
    }
    const it = mst.iterator()
    for (let safety = 0; safety < 500; safety++) {
      // ical.js typings claim iterator.next() always returns ICAL.Time,
      // but at the end of an UNTIL-bounded series it actually yields
      // null. Widen the type so the null-check survives linting.
      const cur = it.next() as ICAL.Time | null
      if (!cur) break
      if (cur.toJSDate() > horizon) break
      const ovs = overrides.get(mst.uid) ?? []
      const ov = ovs.find((o) => o.recurrenceId.compare(cur) === 0)
      if (ov) {
        push(mst.uid, ov, ov.startDate)
      } else {
        push(mst.uid, mst, cur)
      }
    }
  }

  // Overrides whose recurrence-id falls outside the master's expansion
  // window (rare but legal) should also count once.
  for (const arr of overrides.values()) {
    for (const ov of arr) {
      const startJs = ov.startDate.toJSDate()
      const already = out.some(
        (i) => i.uid === ov.uid && i.startUtc.getTime() === startJs.getTime(),
      )
      if (!already) push(ov.uid, ov, ov.startDate)
    }
  }

  out.sort((a, b) => a.startUtc.getTime() - b.startUtc.getTime())
  return out
}

function parseUpcoming(icsText: string, now: Date): UpcomingEvent[] {
  const instances = expandInstances(icsText, now)

  // Pre-compute silent-disco installment indices.
  const silentDiscos = instances.filter(
    (i) => classify(i.summary) === 'silent-disco',
  )
  const anchorIdx = silentDiscos.findIndex(
    (i) => i.startUtc.toISOString().slice(0, 10) === SILENT_DISCO_ANCHOR.startDateIso,
  )

  const events: UpcomingEvent[] = []
  for (const inst of instances) {
    if (inst.startUtc <= now) continue
    const kind = classify(inst.summary)

    let installmentNumber: number | null = null
    if (kind === 'silent-disco' && anchorIdx !== -1) {
      const myIdx = silentDiscos.findIndex(
        (s) =>
          s.uid === inst.uid &&
          s.startUtc.getTime() === inst.startUtc.getTime(),
      )
      if (myIdx !== -1) {
        installmentNumber =
          SILENT_DISCO_ANCHOR.number + (myIdx - anchorIdx)
      }
    }

    const startIso = inst.startUtc.toISOString()
    const formatted = formatInTz(startIso, EVENT_TZ)
    const venueName = venueNameFromLocation(inst.location)
    events.push({
      uid: `${inst.uid}-${inst.startUtc.getTime()}`,
      kind,
      summary: inst.summary,
      startIso,
      endIso: inst.endUtc.toISOString(),
      location: inst.location,
      venueName,
      venueUrl: venueName ? (VENUE_URLS[venueName] ?? null) : null,
      installmentNumber,
      installmentRoman:
        installmentNumber != null ? toRoman(installmentNumber) : null,
      rsvpUrl: extractPartifulUrl(inst.description),
      ...formatted,
    })
  }

  return events
}

const FALLBACK: CalendarData = {
  nextSilentDisco: {
    uid: 'fallback-2026-06-20',
    kind: 'silent-disco',
    summary: 'BYOHP Silent Disco',
    startIso: '2026-06-20T18:45:00.000Z',
    endIso: '2026-06-20T23:00:00.000Z',
    location:
      'Primitive Coffee Company, 2601 Nolensville Pk, Nashville, TN 37211, USA',
    venueName: 'PRIMITIVE COFFEE COMPANY',
    venueUrl: 'https://www.primitivecoffee.co/',
    installmentNumber: 4,
    installmentRoman: 'IV',
    rsvpUrl: null,
    dayOfWeek: 'SAT',
    monthAbbr: 'JUN',
    dayOfMonth: '20',
    year: '2026',
    startTimeDisplay: '1:45 PM',
  },
  upcoming: [],
  fetchedAt: new Date().toISOString(),
  status: 'fallback',
}

export const fetchCalendarData = createServerFn({ method: 'GET' }).handler(
  async (): Promise<CalendarData> => {
    try {
      const ctrl = new AbortController()
      const timeout = setTimeout(() => ctrl.abort(), 5000)
      const res = await fetch(ICAL_URL, {
        headers: { Accept: 'text/calendar' },
        signal: ctrl.signal,
      })
      clearTimeout(timeout)
      if (!res.ok) throw new Error(`status ${res.status}`)
      const text = await res.text()
      const upcoming = parseUpcoming(text, new Date())
      const nextSilentDisco =
        upcoming.find((e) => e.kind === 'silent-disco') ?? null
      return {
        nextSilentDisco,
        upcoming,
        fetchedAt: new Date().toISOString(),
        status: 'ok',
      }
    } catch (err) {
      console.error('[calendar] fetch failed, returning fallback:', err)
      return FALLBACK
    }
  },
)
