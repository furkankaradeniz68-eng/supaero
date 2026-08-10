const MAX_LENGTHS = {
  firstName: 100,
  lastName:  100,
  email:     254,
  phone:     30,
  company:   200,
  subject:   50,
  message:   5000,
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function truncate(val, max) {
  if (typeof val !== 'string') return '';
  return val.trim().slice(0, max);
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const body = req.body || {};

  // Sanitise & length-limit every field
  const firstName = truncate(body.firstName, MAX_LENGTHS.firstName);
  const lastName  = truncate(body.lastName,  MAX_LENGTHS.lastName);
  const email     = truncate(body.email,     MAX_LENGTHS.email);
  const phone     = truncate(body.phone,     MAX_LENGTHS.phone);
  const company   = truncate(body.company,   MAX_LENGTHS.company);
  const subject   = truncate(body.subject,   MAX_LENGTHS.subject);
  const message   = truncate(body.message,   MAX_LENGTHS.message);
  const recaptchaToken = truncate(body.recaptchaToken, 2048);

  // Validate required fields
  if (!email || !message) {
    return res.status(400).json({ error: 'E-Mail und Nachricht sind Pflichtfelder.' });
  }

  // Validate email format
  if (!EMAIL_RE.test(email)) {
    return res.status(400).json({ error: 'Ungültige E-Mail-Adresse.' });
  }

  // Verify reCAPTCHA Enterprise token — blocking: never skip on error
  if (process.env.RECAPTCHA_GCP_KEY) {
    if (!recaptchaToken) {
      return res.status(400).json({ error: 'Spam-Schutz fehlgeschlagen. Bitte versuchen Sie es erneut.' });
    }
    try {
      const projectId = process.env.RECAPTCHA_PROJECT_ID || 'my-project-4828-1785608529061';
      const verify = await fetch(
        `https://recaptchaenterprise.googleapis.com/v1/projects/${projectId}/assessments?key=${process.env.RECAPTCHA_GCP_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            event: {
              token: recaptchaToken,
              siteKey: '6LfnyX4tAAAAANHTYnfTKBD_Igwjr7r9-q89DseG',
              expectedAction: truncate(body.subject, 50) || 'contact',
            },
          }),
        }
      );
      const result = await verify.json();
      const tp = result?.tokenProperties ?? {};
      console.log('[reCAPTCHA] valid:', tp.valid, '| reason:', tp.invalidReason, '| hostname:', tp.hostname, '| action:', tp.action, '| score:', result?.riskAnalysis?.score);
      const score = result?.riskAnalysis?.score ?? 0;
      const valid = tp.valid ?? false;
      if (!valid || score < 0.5) {
        console.log('[reCAPTCHA] blocked — valid:', valid, 'reason:', tp.invalidReason, 'score:', score);
        return res.status(400).json({ error: 'Spam-Schutz fehlgeschlagen. Bitte versuchen Sie es erneut.' });
      }
    } catch (err) {
      console.error('[reCAPTCHA] exception:', err);
      return res.status(503).json({ error: 'Spam-Schutz vorübergehend nicht verfügbar. Bitte versuchen Sie es später erneut.' });
    }
  }

  const subjectLabels = {
    quote:    'Angebotsanfrage',
    product:  'Produktinformation',
    custom:   'Sonderfertigung',
    support:  'Technischer Support',
    catalog:  'Katalog-Anfrage',
    other:    'Sonstiges',
  };

  const subjectLabel = subjectLabels[subject] || 'Kontaktanfrage';
  const fullName = [firstName, lastName].filter(Boolean).join(' ') || 'Unbekannt';

  const html = `
<!DOCTYPE html>
<html lang="de">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:Inter,-apple-system,Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f1f5f9;padding:40px 16px;">
  <tr><td align="center">
    <table width="580" cellpadding="0" cellspacing="0" style="max-width:580px;width:100%;">

      <!-- Logo Header -->
      <tr>
        <td style="padding:0 0 24px 0;" align="center">
          <table cellpadding="0" cellspacing="0">
            <tr>
              <td style="background:#0a1628;border-radius:12px;padding:16px 28px;">
                <span style="font-size:26px;font-weight:900;color:#ffffff;letter-spacing:-0.5px;font-family:Inter,Arial,sans-serif;">sup<span style="color:#3B7FE8;">A</span>ero</span>
                <span style="display:block;font-size:11px;color:#64748b;letter-spacing:0.12em;text-transform:uppercase;margin-top:2px;">Superb Hydraulics</span>
              </td>
            </tr>
          </table>
        </td>
      </tr>

      <!-- Card -->
      <tr>
        <td style="background:#ffffff;border-radius:16px;box-shadow:0 4px 24px rgba(0,0,0,0.08);overflow:hidden;">

          <!-- Blue accent bar -->
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td style="background:linear-gradient(90deg,#1B4F9B 0%,#3B7FE8 100%);height:4px;"></td>
            </tr>
          </table>

          <!-- Title -->
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td style="padding:32px 36px 24px;">
                <span style="display:inline-block;font-size:11px;font-weight:700;letter-spacing:0.14em;color:#3B7FE8;text-transform:uppercase;margin-bottom:8px;">Neue Anfrage über supaero.de</span>
                <h1 style="margin:0;font-size:24px;font-weight:800;color:#0f172a;letter-spacing:-0.3px;">${subjectLabel}</h1>
              </td>
            </tr>
          </table>

          <!-- Divider -->
          <table width="100%" cellpadding="0" cellspacing="0"><tr><td style="padding:0 36px;"><div style="height:1px;background:#e2e8f0;"></div></td></tr></table>

          <!-- Contact Details -->
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td style="padding:24px 36px;">
                <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e2e8f0;border-radius:10px;overflow:hidden;">
                  <tr>
                    <td style="padding:14px 18px;border-bottom:1px solid #e2e8f0;background:#f8fafc;">
                      <span style="font-size:10px;font-weight:700;letter-spacing:0.1em;color:#94a3b8;text-transform:uppercase;display:block;margin-bottom:3px;">Name</span>
                      <span style="font-size:15px;font-weight:600;color:#0f172a;">${fullName.replace(/</g,'&lt;').replace(/>/g,'&gt;')}</span>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:14px 18px;border-bottom:1px solid #e2e8f0;background:#ffffff;">
                      <span style="font-size:10px;font-weight:700;letter-spacing:0.1em;color:#94a3b8;text-transform:uppercase;display:block;margin-bottom:3px;">E-Mail</span>
                      <a href="mailto:${email.replace(/</g,'&lt;').replace(/>/g,'&gt;')}" style="font-size:15px;font-weight:600;color:#3B7FE8;text-decoration:none;">${email.replace(/</g,'&lt;').replace(/>/g,'&gt;')}</a>
                    </td>
                  </tr>
                  ${phone ? `<tr>
                    <td style="padding:14px 18px;border-bottom:1px solid #e2e8f0;background:#f8fafc;">
                      <span style="font-size:10px;font-weight:700;letter-spacing:0.1em;color:#94a3b8;text-transform:uppercase;display:block;margin-bottom:3px;">Telefon</span>
                      <span style="font-size:15px;font-weight:600;color:#0f172a;">${phone.replace(/</g,'&lt;').replace(/>/g,'&gt;')}</span>
                    </td>
                  </tr>` : ''}
                  ${company ? `<tr>
                    <td style="padding:14px 18px;background:${phone ? '#ffffff' : '#f8fafc'};">
                      <span style="font-size:10px;font-weight:700;letter-spacing:0.1em;color:#94a3b8;text-transform:uppercase;display:block;margin-bottom:3px;">Firma</span>
                      <span style="font-size:15px;font-weight:600;color:#0f172a;">${company.replace(/</g,'&lt;').replace(/>/g,'&gt;')}</span>
                    </td>
                  </tr>` : ''}
                </table>
              </td>
            </tr>
          </table>

          <!-- Message -->
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td style="padding:0 36px 32px;">
                <span style="font-size:10px;font-weight:700;letter-spacing:0.1em;color:#94a3b8;text-transform:uppercase;display:block;margin-bottom:10px;">Nachricht</span>
                <div style="background:#f8fafc;border:1px solid #e2e8f0;border-left:3px solid #3B7FE8;border-radius:8px;padding:18px;font-size:15px;color:#334155;line-height:1.75;white-space:pre-wrap;">${message.replace(/</g,'&lt;').replace(/>/g,'&gt;')}</div>
              </td>
            </tr>
          </table>

          <!-- Reply CTA -->
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td style="padding:0 36px 32px;" align="center">
                <a href="mailto:${email.replace(/</g,'&lt;').replace(/>/g,'&gt;')}" style="display:inline-block;background:#3B7FE8;color:#ffffff;font-size:14px;font-weight:700;text-decoration:none;padding:12px 28px;border-radius:8px;letter-spacing:0.02em;">Direkt antworten →</a>
              </td>
            </tr>
          </table>

        </td>
      </tr>

      <!-- Footer -->
      <tr>
        <td style="padding:20px 0 0;" align="center">
          <span style="font-size:12px;color:#94a3b8;">Gesendet über das Kontaktformular auf <a href="https://supaero.de" style="color:#3B7FE8;text-decoration:none;">supaero.de</a></span>
        </td>
      </tr>

    </table>
  </td></tr>
</table>
</body>
</html>`;

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'supAero Kontakt <noreply@supaero.de>',
        to: ['web@supaero.de'],
        reply_to: email,
        subject: `[supAero] ${subjectLabel} — ${fullName}`,
        html,
      }),
    });

    if (!response.ok) {
      const err = await response.json();
      console.error('Resend error:', err);
      return res.status(500).json({ error: 'E-Mail konnte nicht gesendet werden.' });
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('Contact handler error:', err);
    return res.status(500).json({ error: 'Serverfehler.' });
  }
}
