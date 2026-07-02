export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { firstName, lastName, email, phone, company, subject, message } = req.body;

  if (!email || !message) {
    return res.status(400).json({ error: 'E-Mail und Nachricht sind Pflichtfelder.' });
  }

  const subjectLabels = {
    quote:    'Angebotsanfrage',
    product:  'Produktinformation',
    custom:   'Sonderfertigung',
    support:  'Technischer Support',
    other:    'Sonstiges',
  };

  const subjectLabel = subjectLabels[subject] || subject || 'Kontaktanfrage';
  const fullName = [firstName, lastName].filter(Boolean).join(' ') || 'Unbekannt';

  const html = `
<!DOCTYPE html>
<html lang="de">
<head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#0a1628;font-family:Inter,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a1628;padding:40px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#0F1B2D;border:1px solid #1e3a5f;border-radius:12px;overflow:hidden;">
        <!-- Header -->
        <tr>
          <td style="background:linear-gradient(135deg,#1B4F9B,#0d2d5e);padding:32px 40px;">
            <div style="font-size:22px;font-weight:900;color:#fff;letter-spacing:-0.5px;">
              sup<span style="color:#3B7FE8;">A</span>ero
            </div>
            <div style="color:#94a3b8;font-size:12px;margin-top:4px;">Superb Hydraulics</div>
          </td>
        </tr>
        <!-- Title -->
        <tr>
          <td style="padding:32px 40px 0;">
            <div style="font-size:11px;font-weight:700;letter-spacing:0.15em;color:#3B7FE8;text-transform:uppercase;margin-bottom:8px;">Neue Anfrage</div>
            <div style="font-size:22px;font-weight:700;color:#fff;">${subjectLabel}</div>
          </td>
        </tr>
        <!-- Contact Info -->
        <tr>
          <td style="padding:24px 40px;">
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a1628;border:1px solid #1e3a5f;border-radius:8px;overflow:hidden;">
              <tr>
                <td style="padding:14px 20px;border-bottom:1px solid #1e3a5f;">
                  <span style="font-size:11px;color:#64748b;display:block;margin-bottom:2px;">NAME</span>
                  <span style="font-size:15px;color:#e2e8f0;font-weight:600;">${fullName}</span>
                </td>
              </tr>
              <tr>
                <td style="padding:14px 20px;border-bottom:1px solid #1e3a5f;">
                  <span style="font-size:11px;color:#64748b;display:block;margin-bottom:2px;">E-MAIL</span>
                  <a href="mailto:${email}" style="font-size:15px;color:#3B7FE8;font-weight:600;text-decoration:none;">${email}</a>
                </td>
              </tr>
              ${phone ? `<tr>
                <td style="padding:14px 20px;border-bottom:1px solid #1e3a5f;">
                  <span style="font-size:11px;color:#64748b;display:block;margin-bottom:2px;">TELEFON</span>
                  <span style="font-size:15px;color:#e2e8f0;font-weight:600;">${phone}</span>
                </td>
              </tr>` : ''}
              ${company ? `<tr>
                <td style="padding:14px 20px;">
                  <span style="font-size:11px;color:#64748b;display:block;margin-bottom:2px;">FIRMA</span>
                  <span style="font-size:15px;color:#e2e8f0;font-weight:600;">${company}</span>
                </td>
              </tr>` : ''}
            </table>
          </td>
        </tr>
        <!-- Message -->
        <tr>
          <td style="padding:0 40px 32px;">
            <div style="font-size:11px;font-weight:700;letter-spacing:0.1em;color:#64748b;text-transform:uppercase;margin-bottom:12px;">Nachricht</div>
            <div style="background:#0a1628;border:1px solid #1e3a5f;border-radius:8px;padding:20px;font-size:15px;color:#cbd5e1;line-height:1.7;white-space:pre-wrap;">${message.replace(/</g,'&lt;').replace(/>/g,'&gt;')}</div>
          </td>
        </tr>
        <!-- Footer -->
        <tr>
          <td style="background:#060e1a;padding:20px 40px;border-top:1px solid #1e3a5f;">
            <div style="font-size:12px;color:#475569;">Diese Nachricht wurde über das Kontaktformular auf <strong style="color:#94a3b8;">supaero.vercel.app</strong> gesendet.</div>
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
        to: ['info@supaero.de'],
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
