"use client";

import { Lock, LockOpen } from "lucide-react";
import { FormEvent, useState } from "react";
import { tw } from "@/shared/lib/tw";
import { decryptJson, EncryptedPayload } from "./lib/crypto";
import { ACTIVE, Application, isFollowUpDue, isoDate, sortApplications, summarize } from "./model";

const formatDate = (iso: string) => {
  if (!iso) return "—";
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("en-GB", { day: "numeric", month: "short" });
};

function StatusPill({ status }: { status: Application["status"] }) {
  return (
    <span
      className={tw(
        "inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold whitespace-nowrap",
        ACTIVE.has(status) ? "bg-accent-soft text-accent" : "bg-raised text-muted"
      )}
    >
      {status}
    </span>
  );
}

function Stats({ apps }: { apps: Application[] }) {
  const s = summarize(apps, new Date());
  const items = [
    { label: "Applications", value: s.total },
    { label: "This week", value: s.thisWeek },
    { label: "In progress", value: s.inProgress },
    { label: "Follow-ups due", value: s.followUpsDue },
  ];
  return (
    <dl className="mt-10 grid grid-cols-2 gap-x-6 gap-y-6 border-y border-line py-6 sm:grid-cols-4">
      {items.map((item) => (
        <div key={item.label}>
          <dt className="text-xs font-semibold tracking-wide text-muted uppercase">{item.label}</dt>
          <dd className="mt-1 text-3xl font-bold text-strong tabular-nums">{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}

function ApplicationList({ apps }: { apps: Application[] }) {
  const today = isoDate(new Date());
  return (
    <ul aria-label="Applications, newest first" className="mt-8 divide-y divide-line">
      {sortApplications(apps).map((app) => {
        const due = isFollowUpDue(app, today);
        return (
          <li key={app.id} className="grid gap-3 py-5 sm:grid-cols-[7rem_1fr_auto] sm:gap-6">
            <p className="text-sm text-muted tabular-nums">{formatDate(app.applied)}</p>
            <div className="min-w-0">
              <p className="font-semibold text-strong">{app.company}</p>
              <p className="text-sm text-body">{app.role}</p>
              <p className="mt-1 text-sm break-words text-muted">
                {[app.channel, app.contact, app.salary].filter(Boolean).join(" · ")}
              </p>
              {app.notes && <p className="mt-2 text-sm leading-relaxed text-body">{app.notes}</p>}
              {app.link && (
                <a
                  href={app.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 inline-block text-sm text-accent underline underline-offset-4"
                >
                  Job posting
                </a>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-3 sm:flex-col sm:items-end">
              <StatusPill status={app.status} />
              {ACTIVE.has(app.status) && (
                <p className={tw("text-xs tabular-nums", due ? "font-semibold text-accent" : "text-muted")}>
                  {app.followedUpOn
                    ? `Followed up ${formatDate(app.followedUpOn)}`
                    : `${due ? "Follow up now" : "Follow up"} ${formatDate(app.followUp)}`}
                </p>
              )}
            </div>
          </li>
        );
      })}
    </ul>
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

  if (!apps) {
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

  return (
    <main id="main" className="pt-16 pb-24">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-strong">Job hunt log</h1>
          <p className="mt-2 text-body">Every job I applied to, newest first.</p>
        </div>
        <button
          type="button"
          onClick={() => setApps(null)}
          className="inline-flex items-center gap-2 rounded-lg border border-line px-3 py-1.5 text-sm font-semibold text-foreground hover:border-accent hover:text-accent"
        >
          <LockOpen aria-hidden size={16} />
          Lock
        </button>
      </div>
      <Stats apps={apps} />
      <ApplicationList apps={apps} />
    </main>
  );
}
