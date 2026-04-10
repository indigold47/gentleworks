import { NextResponse } from "next/server";
import { Resend } from "resend";

// Lazy-init so the build doesn't blow up when the key isn't set yet.
let _resend: Resend | null = null;
function getResend() {
  if (!_resend) _resend = new Resend(process.env.RESEND_API_KEY);
  return _resend;
}

// Where contact form submissions land. Change to the studio's real inbox once
// a domain is verified.
const TO_EMAIL = process.env.CONTACT_TO_EMAIL ?? "delivered@resend.dev";

// Sandbox "from" — works without domain verification. Replace with a verified
// domain address (e.g. hello@gentle.works) before launch.
const FROM_EMAIL = process.env.CONTACT_FROM_EMAIL ?? "onboarding@resend.dev";

type ContactPayload = {
  name?: string;
  email?: string;
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

  const { name, email, message } = body;

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
  if (!message || !message.trim()) {
    return NextResponse.json(
      { error: "Message is required" },
      { status: 400 },
    );
  }

  const { error } = await getResend().emails.send({
    from: FROM_EMAIL,
    to: TO_EMAIL,
    replyTo: email,
    subject: `New inquiry from ${name.trim()}`,
    text: [
      `Name: ${name.trim()}`,
      `Email: ${email.trim()}`,
      "",
      message.trim(),
    ].join("\n"),
  });

  if (error) {
    console.error("[contact] Resend error:", error);
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 },
    );
  }

  return NextResponse.json({ success: true });
}
