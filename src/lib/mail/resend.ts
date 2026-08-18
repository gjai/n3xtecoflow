/**
 * Tout l’e-mail transactionnel (contact, digest ops, alerte tirage).
 * Coolify : RESEND_API_KEY + ALERTS_FROM_EMAIL (ou MAIL_FROM).
 */
export function mailFrom(): string {
  return (
    process.env.MAIL_FROM?.trim() ||
    process.env.ALERTS_FROM_EMAIL?.trim() ||
    ""
  );
}

export function mailConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY?.trim() && mailFrom());
}

export async function sendResendEmail(args: {
  to: string;
  subject: string;
  text: string;
  html?: string;
  replyTo?: string;
}): Promise<{ ok: boolean; error?: string }> {
  const key = process.env.RESEND_API_KEY?.trim();
  const from = mailFrom();
  if (!key || !from) {
    return { ok: false, error: "mail_unconfigured" };
  }
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [args.to],
        subject: args.subject,
        text: args.text,
        ...(args.html ? { html: args.html } : {}),
        ...(args.replyTo ? { reply_to: args.replyTo } : {}),
      }),
    });
    if (!res.ok) {
      const body = await res.text().catch(() => "");
      return { ok: false, error: `resend_${res.status}:${body.slice(0, 180)}` };
    }
    return { ok: true };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "resend_error",
    };
  }
}
