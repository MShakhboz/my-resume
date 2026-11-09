import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeAll, describe, expect, it } from "vitest";
import { EncryptedPayload, encryptJson } from "./lib/crypto";
import { Application } from "./model";
import { JobLog } from "./ui";

const apps: Application[] = [
  {
    id: "acme",
    company: "Acme",
    role: "Senior Frontend Developer",
    channel: "Telegram",
    contact: "@acme_hr",
    salary: "4,000 USD",
    status: "Screening",
    applied: "2026-11-04",
    followUp: "2026-11-10",
    followedUpOn: "",
    link: "",
    notes: "Asked about remote.",
  },
];

let payload: EncryptedPayload;
beforeAll(async () => {
  payload = await encryptJson(apps, "open sesame");
});

describe("JobLog", () => {
  it("shows nothing until the password is entered", () => {
    render(<JobLog payload={payload} />);
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
    expect(screen.queryByText("Acme")).not.toBeInTheDocument();
  });

  it("says so when the password is wrong", async () => {
    const user = userEvent.setup();
    render(<JobLog payload={payload} />);
    await user.type(screen.getByLabelText("Password"), "nope");
    await user.click(screen.getByRole("button", { name: "Unlock" }));
    expect(await screen.findByRole("alert")).toHaveTextContent("Wrong password.");
    expect(screen.queryByText("Acme")).not.toBeInTheDocument();
  });

  it("opens the log with the right password and locks again", async () => {
    const user = userEvent.setup();
    render(<JobLog payload={payload} />);
    await user.type(screen.getByLabelText("Password"), "open sesame");
    await user.click(screen.getByRole("button", { name: "Unlock" }));
    expect(await screen.findByText("Acme")).toBeInTheDocument();
    expect(screen.getByText("Telegram · @acme_hr · 4,000 USD")).toBeInTheDocument();
    expect(screen.getByText("Screening")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Lock" }));
    expect(screen.queryByText("Acme")).not.toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toHaveValue("");
  });
});
