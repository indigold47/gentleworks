"use client";

import { useState, type FormEvent } from "react";

type Status = "idle" | "sending" | "sent" | "error";

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    setErrorMsg("");

    const form = e.currentTarget;
    const formData = new FormData(form);
    const data = {
      name: `${formData.get("firstName")} ${formData.get("lastName")}`.trim(),
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
      subject: formData.get("subject") as string,
      message: (formData.get("message") as string) || "",
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

  const inputClass =
    "w-full border-b border-rule bg-transparent pb-2 text-base text-ink outline-none transition-colors placeholder:text-transparent focus:border-ink";

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      {/* First Name / Last Name */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="relative">
          <input
            id="contact-firstName"
            name="firstName"
            type="text"
            required
            autoComplete="given-name"
            placeholder="First Name"
            className={`${inputClass} peer`}
          />
          <label
            htmlFor="contact-firstName"
            className="absolute left-0 bottom-2 text-base text-muted pointer-events-none transition-all peer-focus:-translate-y-5 peer-focus:text-xs peer-[:not(:placeholder-shown)]:-translate-y-5 peer-[:not(:placeholder-shown)]:text-xs"
          >
            First Name
          </label>
        </div>
        <div className="relative">
          <input
            id="contact-lastName"
            name="lastName"
            type="text"
            required
            autoComplete="family-name"
            placeholder="Last Name"
            className={`${inputClass} peer`}
          />
          <label
            htmlFor="contact-lastName"
            className="absolute left-0 bottom-2 text-base text-muted pointer-events-none transition-all peer-focus:-translate-y-5 peer-focus:text-xs peer-[:not(:placeholder-shown)]:-translate-y-5 peer-[:not(:placeholder-shown)]:text-xs"
          >
            Last Name
          </label>
        </div>
      </div>

      {/* Email / Phone */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="relative">
          <input
            id="contact-email"
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="Email"
            className={`${inputClass} peer`}
          />
          <label
            htmlFor="contact-email"
            className="absolute left-0 bottom-2 text-base text-muted pointer-events-none transition-all peer-focus:-translate-y-5 peer-focus:text-xs peer-[:not(:placeholder-shown)]:-translate-y-5 peer-[:not(:placeholder-shown)]:text-xs"
          >
            Email
          </label>
        </div>
        <div className="relative">
          <input
            id="contact-phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            placeholder="Phone Number"
            className={`${inputClass} peer`}
          />
          <label
            htmlFor="contact-phone"
            className="absolute left-0 bottom-2 text-base text-muted pointer-events-none transition-all peer-focus:-translate-y-5 peer-focus:text-xs peer-[:not(:placeholder-shown)]:-translate-y-5 peer-[:not(:placeholder-shown)]:text-xs"
          >
            Phone Number
          </label>
        </div>
      </div>

      {/* Subject */}
      <div className="relative">
        <input
          id="contact-subject"
          name="subject"
          type="text"
          placeholder="Subject"
          className={`${inputClass} peer`}
        />
        <label
          htmlFor="contact-subject"
          className="absolute left-0 bottom-2 text-base text-muted pointer-events-none transition-all peer-focus:-translate-y-5 peer-focus:text-xs peer-[:not(:placeholder-shown)]:-translate-y-5 peer-[:not(:placeholder-shown)]:text-xs"
        >
          Subject
        </label>
      </div>

      {/* Message textarea */}
      <div className="relative">
        <textarea
          id="contact-message"
          name="message"
          rows={10}
          placeholder="Message"
          className={`w-full resize-none border border-rule bg-transparent p-4 text-base text-ink outline-none transition-colors focus:border-ink peer placeholder:text-transparent`}
        />
        <label
          htmlFor="contact-message"
          className="absolute left-4 top-4 text-base text-muted pointer-events-none transition-all peer-focus:-translate-y-7 peer-focus:text-xs peer-[:not(:placeholder-shown)]:-translate-y-7 peer-[:not(:placeholder-shown)]:text-xs"
        >
          Message
        </label>
      </div>

      {status === "error" && (
        <p className="text-sm text-red-600" role="alert">
          {errorMsg}
        </p>
      )}

      {/* Submit button — pill shape, centered */}
      <div className="flex justify-center pt-4">
        <button
          type="submit"
          disabled={status === "sending"}
          className="rounded-full border border-rule px-12 py-3 text-sm tracking-[0.1em] transition-colors hover:border-ink hover:bg-ink hover:text-cream disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {status === "sending" ? "Sending..." : "Submit"}
        </button>
      </div>
    </form>
  );
}
