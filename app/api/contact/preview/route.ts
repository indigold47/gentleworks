import { NextResponse } from "next/server";
import { contactEmailHtml, confirmationEmailHtml } from "../email-template";

/**
 * Dev-only preview of the contact email templates.
 * Visit: http://localhost:3000/api/contact/preview              — internal notification
 * Visit: http://localhost:3000/api/contact/preview?type=confirm  — sender confirmation
 */
export async function GET(req: Request) {
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type");

  const html =
    type === "confirm"
      ? confirmationEmailHtml({
          firstName: "Sarah",
          subject: "Residential project in Decatur",
        })
      : contactEmailHtml({
          name: "Sarah Mitchell",
          email: "sarah@mitchellarchitects.com",
          phone: "404-555-0192",
          subject: "Residential project in Decatur",
          message:
            "Hi there,\n\nWe've been following your work for a while — the Lodge at Moreland is stunning. We're planning a ground-up residential build on a wooded lot in Decatur and would love to explore working together.\n\nThe site is about 1.2 acres with a gentle slope and mature hardwoods we'd like to preserve. We're imagining something that feels rooted in the landscape — natural materials, deep overhangs, indoor-outdoor flow.\n\nWould you be open to a conversation?\n\nBest,\nSarah",
        });

  return new NextResponse(html, {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}
