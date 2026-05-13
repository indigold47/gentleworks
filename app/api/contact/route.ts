import { NextResponse } from "next/server";
import { Resend } from "resend";
import { contactEmailHtml, confirmationEmailHtml } from "./email-template";

// Lazy-init so the build doesn't blow up when the key isn't set yet.
let _resend: Resend | null = null;
function getResend() {
  if (!_resend) _resend = new Resend(process.env.RESEND_API_KEY);
  return _resend;
}

// Where contact form submissions land. Change to the studio's real inbox once
// a domain is verified.
// Comma-separated list of recipients, e.g. "alice@gentle.works,bob@gentle.works"
const TO_EMAILS = (process.env.CONTACT_TO_EMAIL ?? "delivered@resend.dev")
  .split(",")
  .map((e) => e.trim())
  .filter(Boolean);

// Sandbox "from" — works without domain verification. Replace with a verified
// domain address (e.g. hello@gentle.works) before launch.
const FROM_EMAIL = process.env.CONTACT_FROM_EMAIL ?? "onboarding@resend.dev";

type ContactPayload = {
  name?: string;
  email?: string;
  phone?: string;
  subject?: string;
  message?: string;
};

export async function POST(req: Request) {
  if (!process.env.RESEND_API_KEY) {
    console.error("[contact] Missing RESEND_API_KEY");
    return NextResponse.json(
      { error: "Email service not configured" },
      { status: 500 },
    );
  }

  let body: ContactPayload;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { name, email, phone, subject, message } = body;

  // Basic validation
  if (!name || !name.trim()) {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json(
      { error: "Valid email is required" },
      { status: 400 },
    );
  }

  const trimmedName = name.trim();
  const trimmedEmail = email.trim();
  const trimmedPhone = phone?.trim() || "";
  const trimmedSubject = subject?.trim() || "";
  const trimmedMessage = message?.trim() || "";

  const emailSubject = trimmedSubject
    ? `${trimmedSubject} — from ${trimmedName}`
    : `New inquiry from ${trimmedName}`;

  // Plain-text fallback
  const textLines = [`Name: ${trimmedName}`, `Email: ${trimmedEmail}`];
  if (trimmedPhone) textLines.push(`Phone: ${trimmedPhone}`);
  if (trimmedSubject) textLines.push(`Subject: ${trimmedSubject}`);
  textLines.push("", trimmedMessage || "(No message provided)");

  // Branded HTML email
  const html = contactEmailHtml({
    name: trimmedName,
    email: trimmedEmail,
    phone: trimmedPhone,
    subject: trimmedSubject,
    message: trimmedMessage,
  });

  const { error } = await getResend().emails.send({
    from: FROM_EMAIL,
    to: TO_EMAILS,
    replyTo: email,
    subject: emailSubject,
    text: textLines.join("\n"),
    html,
  });

  if (error) {
    console.error("[contact] Resend error:", error);
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 },
    );
  }

  // Send confirmation email to the person who reached out
  const firstName = trimmedName.split(" ")[0];
  const confirmHtml = confirmationEmailHtml({
    firstName,
    subject: trimmedSubject,
  });

  const { error: confirmError } = await getResend().emails.send({
    from: FROM_EMAIL,
    to: trimmedEmail,
    subject: `We received your message — Gentle Works`,
    text: `Thank you, ${firstName}. We received your message${trimmedSubject ? ` regarding "${trimmedSubject}"` : ""} and will get back to you within one to two business days.\n\nWarmly,\nThe Gentle Works Team`,
    html: confirmHtml,
  });

  if (confirmError) {
    // Log but don't fail the request — the inquiry was already delivered
    console.error("[contact] Confirmation email error:", confirmError);
  }

  return NextResponse.json({ success: true });
}
