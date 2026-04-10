"use client";

import { useState, type FormEvent } from "react";
import { Send } from "lucide-react";

type Status = "idle" | "sending" | "sent" | "error";

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    setErrorMsg("");

    const form = e.currentTarget;
    const data = {
      name: (form.elements.namedItem("name") as HTMLInputElement).value,
      email: (form.elements.namedItem("email") as HTMLInputElement).value,
      message: (form.elements.namedItem("message") as HTMLTextAreaElement)
        .value,
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? "Something went wrong");
      }

      setStatus("sent");
      form.reset();
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong");
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div className="flex flex-col items-start gap-4">
        <p className="text-lg">Thank you for reaching out.</p>
        <p className="text-sm text-muted">
          We'll get back to you as soon as we can.
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-4 text-sm uppercase tracking-[0.14em] border-b border-ink pb-1 transition-colors hover:text-sage hover:border-sage"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 max-w-lg">
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="contact-name"
          className="text-xs uppercase tracking-[0.14em] text-muted"
        >
          Name
        </label>
        <input
          id="contact-name"
          name="name"
          type="text"
          required
          autoComplete="name"
          className="border-b border-rule bg-transparent px-0 py-2 text-base text-ink outline-none transition-colors placeholder:text-muted/50 focus:border-ink"
          placeholder="Your name"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="contact-email"
          className="text-xs uppercase tracking-[0.14em] text-muted"
        >
          Email
        </label>
        <input
          id="contact-email"
          name="email"
          type="email"
          required
          autoComplete="email"
          className="border-b border-rule bg-transparent px-0 py-2 text-base text-ink outline-none transition-colors placeholder:text-muted/50 focus:border-ink"
          placeholder="your@email.com"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="contact-message"
          className="text-xs uppercase tracking-[0.14em] text-muted"
        >
          Request
        </label>
        <textarea
          id="contact-message"
          name="message"
          required
          rows={5}
          className="resize-y border-b border-rule bg-transparent px-0 py-2 text-base text-ink outline-none transition-colors placeholder:text-muted/50 focus:border-ink"
          placeholder="Tell us about your project..."
        />
      </div>

      {status === "error" && (
        <p className="text-sm text-red-600" role="alert">
          {errorMsg}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "sending"}
        className="mt-2 inline-flex w-fit items-center gap-2 border border-ink px-6 py-3 text-sm uppercase tracking-[0.14em] transition-colors hover:bg-ink hover:text-cream disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {status === "sending" ? "Sending..." : "Send message"}
        <Send size={14} strokeWidth={1.5} />
      </button>
    </form>
  );
}
