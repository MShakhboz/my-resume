import { describe, expect, it } from "vitest";
import { Application, isFollowUpDue, sortApplications, summarize, weekStart } from "./model";

const app = (over: Partial<Application>): Application => ({
  id: "x",
  company: "Acme",
  role: "Frontend",
  channel: "Email",
  contact: "",
  salary: "",
  status: "Sent",
  applied: "2026-11-04",
  followUp: "2026-11-10",
  followedUpOn: "",
  link: "",
  notes: "",
  ...over,
});

describe("job log model", () => {
  it("starts the week on Monday", () => {
    expect(weekStart(new Date(2026, 10, 8))).toBe("2026-11-02"); // Sunday
    expect(weekStart(new Date(2026, 10, 9))).toBe("2026-11-09"); // Monday
  });

  it("flags follow-ups only for unanswered applications on or after their date", () => {
    expect(isFollowUpDue(app({}), "2026-11-10")).toBe(true);
    expect(isFollowUpDue(app({}), "2026-11-09")).toBe(false);
    expect(isFollowUpDue(app({ status: "Screening" }), "2026-11-10")).toBe(false);
    expect(isFollowUpDue(app({ followedUpOn: "2026-11-10" }), "2026-11-11")).toBe(false);
  });

  it("counts the summary", () => {
    const apps = [
      app({ id: "a" }),
      app({ id: "b", applied: "2026-11-10", status: "Interview" }),
      app({ id: "c", status: "Rejected" }),
    ];
    expect(summarize(apps, new Date(2026, 10, 10))).toEqual({
      total: 3,
      thisWeek: 1,
      inProgress: 2,
      followUpsDue: 1,
    });
  });

  it("sorts newest first, then by company", () => {
    const sorted = sortApplications([
      app({ id: "1", company: "B", applied: "2026-11-03" }),
      app({ id: "2", company: "Z", applied: "2026-11-05" }),
      app({ id: "3", company: "A", applied: "2026-11-05" }),
    ]);
    expect(sorted.map((a) => a.id)).toEqual(["3", "2", "1"]);
  });
});
