"use client";

import { Lock, LockOpen, Search } from "lucide-react";
import { FormEvent, useState } from "react";
import { tw } from "@/shared/lib/tw";
import { decryptJson, EncryptedPayload } from "./lib/crypto";
import {
  ACTIVE,
  Application,
  isFollowUpDue,
  isoDate,
  sortApplications,
  Status,
  STATUSES,
  summarize,
} from "./model";

type Filter = Status | "All";

const formatDate = (iso: string) => {
  if (!iso) return "—";
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("en-GB", { day: "numeric", month: "short" });
};

const label = "text-xs font-semibold tracking-wide text-muted uppercase";

function StatusPill({ status }: { status: Status }) {
  return (
    <span
      className={tw(
        "inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold whitespace-nowrap",
        status === "Interview" || status === "Offer"
          ? "bg-orange-500 text-neutral-950"
          : ACTIVE.has(status)
            ? "bg-accent-soft text-accent"
            : "bg-raised text-muted"
      )}
    >
      {status}
    </span>
  );
}

function Stats({ apps }: { apps: Application[] }) {
  const s = summarize(apps, new Date());
  const progress = s.target ? Math.min(100, (s.today / s.target) * 100) : 100;
  const card = "grid min-w-0 content-start gap-1 rounded-xl border border-line bg-surface px-4 py-3.5";
  const big = "text-3xl font-bold text-strong tabular-nums";

  return (
    <section aria-label="Summary" className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4">
      <div className={card}>
        <span className={label}>Today</span>
        <span className={big}>
          {s.today} <small className="text-base font-medium text-muted">/ {s.target || "rest day"}</small>
        </span>
        <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-raised" aria-hidden>
          <div className="h-full rounded-full bg-orange-500" style={{ width: `${progress}%` }} />
        </div>
      </div>
      <div className={card}>
        <span className={label}>This week</span>
        <span className={big}>{s.thisWeek}</span>
        <span className="text-sm text-muted">since Monday</span>
      </div>
      <div className={card}>
        <span className={label}>In progress</span>
        <span className={big}>{s.inProgress}</span>
        <span className="text-sm text-muted">sent, screening or interview</span>
      </div>
      <div className={card}>
        <span className={label}>Follow-ups due</span>
        <span className={big}>{s.followUpsDue}</span>
        <span className="text-sm text-muted">no reply after a week</span>
      </div>
    </section>
  );
}

function FollowUps({ apps }: { apps: Application[] }) {
  const today = isoDate(new Date());
  const due = apps.filter((a) => isFollowUpDue(a, today)).sort((a, b) => a.followUp.localeCompare(b.followUp));
  if (due.length === 0) return null;

  return (
    <section aria-labelledby="follow-ups" className="mt-8">
      <h2 id="follow-ups" className="text-lg font-bold text-strong">
        Follow up now
      </h2>
      <ul className="mt-3 grid gap-2">
        {due.map((a) => (
          <li
            key={a.id}
            className="flex flex-wrap items-baseline gap-x-3 gap-y-1 rounded-lg border-l-4 border-orange-500 bg-accent-soft px-4 py-2.5"
          >
            <span className="font-semibold text-strong">{a.company}</span>
            <span className="min-w-0 text-sm wrap-break-word text-body">
              {[a.role, [a.channel, a.contact].filter(Boolean).join(" "), `applied ${formatDate(a.applied)}`].join(
                " · "
              )}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}

function Toolbar({
  apps,
  filter,
  onFilter,
  query,
  onQuery,
}: {
  apps: Application[];
  filter: Filter;
  onFilter: (filter: Filter) => void;
  query: string;
  onQuery: (query: string) => void;
}) {
  const chips = (["All", ...STATUSES] as Filter[])
    .map((s) => ({ s, n: s === "All" ? apps.length : apps.filter((a) => a.status === s).length }))
    .filter(({ s, n }) => s === "All" || n > 0 || s === filter);

  return (
    <div className="mt-10 flex flex-wrap items-center justify-between gap-3">
      <div role="group" aria-label="Filter by status" className="flex flex-wrap gap-1.5">
        {chips.map(({ s, n }) => (
          <button
            key={s}
            type="button"
            aria-pressed={filter === s}
            onClick={() => onFilter(s)}
            className={tw(
              "rounded-full border px-3 py-1 text-sm",
              filter === s
                ? "border-strong bg-strong text-background"
                : "border-line bg-surface text-foreground hover:border-accent"
            )}
          >
            {s} <span className="tabular-nums opacity-70">{n}</span>
          </button>
        ))}
      </div>
      <label className="relative w-full sm:w-64">
        <span className="sr-only">Search</span>
        <Search aria-hidden size={16} className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-muted" />
        <input
          type="search"
          value={query}
          onChange={(event) => onQuery(event.target.value)}
          placeholder="Search company, role, contact"
          className="w-full rounded-lg border border-line bg-surface py-1.5 pr-3 pl-9 text-foreground placeholder:text-muted"
        />
      </label>
    </div>
  );
}

const columns = "md:grid-cols-[minmax(0,2.2fr)_minmax(0,1.6fr)_5.5rem_7rem_6.5rem]";

function Log({ apps }: { apps: Application[] }) {
  const today = isoDate(new Date());
  const cellLabel = tw(label, "mb-0.5 block md:hidden");

  return (
    <div className="mt-4 overflow-hidden rounded-xl border border-line bg-surface">
      <div aria-hidden className={tw("hidden gap-3 bg-raised px-4 py-2.5 md:grid", columns)}>
        <span className={label}>Company / role</span>
        <span className={label}>Channel</span>
        <span className={label}>Applied</span>
        <span className={label}>Status</span>
        <span className={label}>Follow up</span>
      </div>
      {apps.length === 0 ? (
        <p className="px-4 py-8 text-center text-muted">Nothing matches this filter.</p>
      ) : (
        <ul aria-label="Applications, newest first">
          {apps.map((a) => {
            const due = isFollowUpDue(a, today);
            return (
              <li
                key={a.id}
                className={tw("grid grid-cols-2 gap-x-3 gap-y-2 border-t border-line px-4 py-3 first:border-t-0", columns)}
              >
                <div className="col-span-2 min-w-0 md:col-span-1">
                  <p className="font-semibold wrap-break-word text-strong">{a.company}</p>
                  <p className="text-sm wrap-break-word text-muted">{a.role}</p>
                </div>
                <div className="col-span-2 min-w-0 text-sm md:col-span-1">
                  <span className={cellLabel}>Channel</span>
                  <p className="text-foreground">{a.channel || "—"}</p>
                  {a.contact && <p className="font-mono text-xs wrap-break-word text-muted">{a.contact}</p>}
                  {a.salary && <p className="text-xs text-muted">{a.salary}</p>}
                </div>
                <div>
                  <span className={cellLabel}>Applied</span>
                  <p className="text-sm text-foreground tabular-nums">{formatDate(a.applied)}</p>
                </div>
                <div>
                  <span className={cellLabel}>Status</span>
                  <StatusPill status={a.status} />
                </div>
                <div>
                  <span className={cellLabel}>Follow up</span>
                  <p className={tw("text-sm tabular-nums", due ? "font-semibold text-accent" : "text-foreground")}>
                    {a.followedUpOn
                      ? `done ${formatDate(a.followedUpOn)}`
                      : ACTIVE.has(a.status)
                        ? formatDate(a.followUp)
                        : "—"}
                  </p>
                </div>
                {(a.notes || a.link) && (
                  <p className="col-span-2 text-sm wrap-break-word text-muted md:col-span-5">
                    {a.notes}
                    {a.link && (
                      <a
                        href={a.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-accent underline underline-offset-4"
                      >
                        {a.notes ? " · posting" : "Posting"}
                      </a>
                    )}
                  </p>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

function Dashboard({ apps, onLock }: { apps: Application[]; onLock: () => void }) {
  const [filter, setFilter] = useState<Filter>("All");
  const [query, setQuery] = useState("");
  const q = query.trim().toLowerCase();
  const visible = sortApplications(apps)
    .filter((a) => filter === "All" || a.status === filter)
    .filter((a) => !q || [a.company, a.role, a.contact, a.notes, a.channel].join(" ").toLowerCase().includes(q));

  return (
    <main id="main" className="pt-12 pb-24 lg:pt-16">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-strong">Job hunt log</h1>
          <p className="mt-1 text-body">
            Target: 10 applications a day Mon–Fri, 5 on Saturday. Follow up 5–7 days after applying.
          </p>
        </div>
        <button
          type="button"
          onClick={onLock}
          className="inline-flex items-center gap-2 rounded-lg border border-line bg-surface px-3 py-1.5 text-sm font-semibold text-foreground hover:border-accent hover:text-accent"
        >
          <LockOpen aria-hidden size={16} />
          Lock
        </button>
      </header>
      <Stats apps={apps} />
      <FollowUps apps={apps} />
      <Toolbar apps={apps} filter={filter} onFilter={setFilter} query={query} onQuery={setQuery} />
      <Log apps={visible} />
    </main>
  );
}

/**
 * The private job-application log. The list ships encrypted; the password decrypts it here in
 * the browser and is never stored, so closing or locking the page forgets everything.
 */
export function JobLog({ payload }: { payload: EncryptedPayload }) {
  const [apps, setApps] = useState<Application[] | null>(null);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function unlock(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      setApps(await decryptJson<Application[]>(payload, password));
      setPassword("");
    } catch {
      setError("Wrong password.");
    } finally {
      setBusy(false);
    }
  }

  if (apps) return <Dashboard apps={apps} onLock={() => setApps(null)} />;

  return (
    <main id="main" className="mx-auto max-w-sm pt-24 pb-24 sm:pt-32">
      <Lock aria-hidden className="text-accent" size={28} />
      <h1 className="mt-4 text-3xl font-bold tracking-tight text-strong">Job hunt log</h1>
      <p className="mt-2 text-body">Private. Enter the password to open it.</p>
      <form onSubmit={unlock} className="mt-8 space-y-3">
        <label htmlFor="log-password" className="block text-sm font-semibold text-strong">
          Password
        </label>
        <input
          id="log-password"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? "log-error" : undefined}
          className="w-full rounded-lg border border-line bg-surface px-3 py-2 text-foreground focus-visible:outline-2 focus-visible:outline-accent"
        />
        {error && (
          <p id="log-error" role="alert" className="text-sm font-semibold text-accent">
            {error}
          </p>
        )}
        <button
          type="submit"
          disabled={busy}
          className="w-full rounded-lg bg-orange-500 px-4 py-2 font-semibold text-neutral-950 transition hover:bg-orange-400 disabled:opacity-60 motion-reduce:transition-none"
        >
          {busy ? "Unlocking…" : "Unlock"}
        </button>
      </form>
    </main>
  );
}
