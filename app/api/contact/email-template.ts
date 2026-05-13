/* ------------------------------------------------------------------ */
/*  Branded HTML email template for contact form submissions           */
/* ------------------------------------------------------------------ */

export type ContactEmailFields = {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
};

export function contactEmailHtml(fields: ContactEmailFields) {
  const { name, email, phone, subject, message } = fields;

  const detailRow = (label: string, value: string, href?: string) => {
    if (!value) return "";
    const display = href
      ? `<a href="${href}" style="color:#4f6b4a;text-decoration:none;">${value}</a>`
      : `<span style="color:#141414;">${value}</span>`;
    return `
      <tr>
        <td style="padding:10px 0;vertical-align:top;width:100px;">
          <span style="font-size:11px;letter-spacing:0.08em;text-transform:uppercase;color:#6b6b6b;">${label}</span>
        </td>
        <td style="padding:10px 0;vertical-align:top;">
          <span style="font-size:15px;line-height:1.5;">${display}</span>
        </td>
      </tr>`;
  };

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background-color:#f5f1ea;font-family:Georgia,'Times New Roman',serif;">

<!-- Outer wrapper -->
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f5f1ea;padding:40px 20px;">
<tr><td align="center">

<!-- Card -->
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background-color:#ffffff;border-radius:2px;">

  <!-- Header band -->
  <tr>
    <td style="background-color:#2f3e2c;padding:32px 40px 28px;">
      <p style="margin:0 0 4px;font-size:11px;letter-spacing:0.14em;text-transform:uppercase;color:rgba(245,241,234,0.5);">New Inquiry</p>
      <h1 style="margin:0;font-size:26px;font-weight:400;font-style:italic;color:#f5f1ea;line-height:1.3;">${name}</h1>
    </td>
  </tr>

  <!-- Thin accent line -->
  <tr><td style="height:3px;background-color:#4f6b4a;font-size:0;line-height:0;">&nbsp;</td></tr>

  <!-- Subject callout (if provided) -->
  ${subject ? `
  <tr>
    <td style="padding:28px 40px 0;">
      <p style="margin:0;font-size:11px;letter-spacing:0.08em;text-transform:uppercase;color:#6b6b6b;">Regarding</p>
      <p style="margin:6px 0 0;font-size:20px;font-weight:400;font-style:italic;color:#141414;line-height:1.4;">${subject}</p>
    </td>
  </tr>` : ""}

  <!-- Message -->
  <tr>
    <td style="padding:${subject ? "24px" : "32px"} 40px 0;">
      ${message
        ? `<p style="margin:0;font-size:15px;line-height:1.7;color:#141414;white-space:pre-wrap;">${message}</p>`
        : `<p style="margin:0;font-size:15px;line-height:1.7;color:#6b6b6b;font-style:italic;">No message provided.</p>`}
    </td>
  </tr>

  <!-- Divider -->
  <tr><td style="padding:28px 40px 0;"><hr style="border:none;border-top:1px solid #e5dfd3;margin:0;"></td></tr>

  <!-- Contact details table -->
  <tr>
    <td style="padding:20px 40px 32px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-family:Georgia,'Times New Roman',serif;">
        ${detailRow("Name", name)}
        ${detailRow("Email", email, `mailto:${email}`)}
        ${detailRow("Phone", phone, `tel:${phone}`)}
      </table>
    </td>
  </tr>

  <!-- Reply prompt -->
  <tr>
    <td style="padding:0 40px 36px;">
      <a href="mailto:${email}" style="display:inline-block;padding:12px 32px;background-color:#2f3e2c;color:#f5f1ea;font-size:13px;letter-spacing:0.1em;text-transform:uppercase;text-decoration:none;border-radius:30px;">Reply to ${name.split(" ")[0]}</a>
    </td>
  </tr>

</table>
<!-- /Card -->

<!-- Footer -->
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;">
  <tr>
    <td style="padding:24px 40px 0;text-align:center;">
      <p style="margin:0;font-size:11px;letter-spacing:0.08em;color:#6b6b6b;">GENTLE WORKS</p>
      <p style="margin:6px 0 0;font-size:11px;color:#6b6b6b;">Architecture &amp; Design Studio &middot; Atlanta, Georgia</p>
    </td>
  </tr>
</table>

</td></tr>
</table>
<!-- /Outer wrapper -->

</body>
</html>`;
}

/* ------------------------------------------------------------------ */
/*  Confirmation email sent back to the person who reached out         */
/* ------------------------------------------------------------------ */

export function confirmationEmailHtml(fields: { firstName: string; subject: string }) {
  const { firstName, subject } = fields;

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background-color:#f5f1ea;font-family:Georgia,'Times New Roman',serif;">

<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f5f1ea;padding:40px 20px;">
<tr><td align="center">

<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background-color:#ffffff;border-radius:2px;">

  <!-- Header band -->
  <tr>
    <td style="background-color:#2f3e2c;padding:32px 40px 28px;">
      <p style="margin:0 0 4px;font-size:11px;letter-spacing:0.14em;text-transform:uppercase;color:rgba(245,241,234,0.5);">Gentle Works</p>
      <h1 style="margin:0;font-size:26px;font-weight:400;font-style:italic;color:#f5f1ea;line-height:1.3;">Thank you, ${firstName}.</h1>
    </td>
  </tr>

  <!-- Accent line -->
  <tr><td style="height:3px;background-color:#4f6b4a;font-size:0;line-height:0;">&nbsp;</td></tr>

  <!-- Body -->
  <tr>
    <td style="padding:32px 40px 0;">
      <p style="margin:0;font-size:15px;line-height:1.7;color:#141414;">We received your message${subject ? ` regarding <em>${subject}</em>` : ""} and appreciate you reaching out.</p>
      <p style="margin:20px 0 0;font-size:15px;line-height:1.7;color:#141414;">A member of our team will review your inquiry and get back to you shortly. We typically respond within one to two business days.</p>
      <p style="margin:20px 0 0;font-size:15px;line-height:1.7;color:#141414;">In the meantime, feel free to explore our recent work at <a href="https://gentle.works/projects" style="color:#4f6b4a;text-decoration:none;">gentle.works</a>.</p>
    </td>
  </tr>

  <!-- Sign-off -->
  <tr>
    <td style="padding:28px 40px 0;">
      <p style="margin:0;font-size:15px;line-height:1.7;color:#141414;">Warmly,</p>
      <p style="margin:4px 0 0;font-size:15px;font-style:italic;color:#141414;">The Gentle Works Team</p>
    </td>
  </tr>

  <!-- Divider -->
  <tr><td style="padding:28px 40px 0;"><hr style="border:none;border-top:1px solid #e5dfd3;margin:0;"></td></tr>

  <!-- Contact info -->
  <tr>
    <td style="padding:20px 40px 36px;">
      <p style="margin:0;font-size:12px;line-height:1.6;color:#6b6b6b;">
        <a href="https://gentle.works" style="color:#4f6b4a;text-decoration:none;">gentle.works</a><br>
        Atlanta, Georgia
      </p>
    </td>
  </tr>

</table>

<!-- Footer -->
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;">
  <tr>
    <td style="padding:24px 40px 0;text-align:center;">
      <p style="margin:0;font-size:11px;color:#6b6b6b;">You received this email because you submitted an inquiry through our website.</p>
    </td>
  </tr>
</table>

</td></tr>
</table>

</body>
</html>`;
}
