/**
 * Decap / Netlify CMS — GitHub OAuth callback
 * Exchanges the GitHub `code` for an access token, then returns an HTML
 * page that postMessages the token back to the CMS opener window.
 */
export default async function handler(req, res) {
  const { code, error } = req.query;

  /* ── GitHub returned an error ──────────────────────────── */
  if (error) {
    return html(res, 400, errorPage(`GitHub: ${error}`));
  }

  /* ── Missing code ──────────────────────────────────────── */
  if (!code) {
    return html(res, 400, errorPage('Kein OAuth-Code empfangen.'));
  }

  /* ── Missing env vars ──────────────────────────────────── */
  const clientId     = process.env.GITHUB_CLIENT_ID;
  const clientSecret = process.env.GITHUB_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return html(res, 500, errorPage(
      'Umgebungsvariablen GITHUB_CLIENT_ID / GITHUB_CLIENT_SECRET ' +
      'fehlen in den Vercel-Projekteinstellungen.'
    ));
  }

  /* ── Exchange code → access token ─────────────────────── */
  let token;
  try {
    const r    = await fetch('https://github.com/login/oauth/access_token', {
      method : 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body   : JSON.stringify({ client_id: clientId, client_secret: clientSecret, code }),
    });
    const data = await r.json();

    if (data.error) {
      return html(res, 400, errorPage(
        `GitHub Token-Fehler: ${data.error}<br>${data.error_description || ''}`
      ));
    }
    if (!data.access_token) {
      return html(res, 400, errorPage(
        `Kein Access-Token erhalten.<br><pre>${JSON.stringify(data, null, 2)}</pre>`
      ));
    }
    token = data.access_token;
  } catch (err) {
    return html(res, 500, errorPage(`Netzwerk-Fehler: ${err.message}`));
  }

  /* ── Return success page with postMessage script ────────── */
  // GitHub tokens are alphanumeric + underscores — safe inside a JS string.
  const payload = `authorization:github:success:{"token":"${token}","provider":"github"}`;

  return html(res, 200, `<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="utf-8">
  <title>Anmeldung erfolgreich</title>
  <style>
    body { margin: 0; display: flex; align-items: center; justify-content: center;
           min-height: 100vh; font-family: system-ui, sans-serif;
           background: #f0fdf4; color: #166534; }
    p    { font-size: 1.1rem; }
  </style>
</head>
<body>
  <p>&#10003; Anmeldung erfolgreich&nbsp;— Fenster schließt sich…</p>
  <script>
    (function () {
      var msg  = '${payload}';
      var sent = false;

      /* Step 1 – two-step handshake (netlify-cms 2.x default).
         Announce we are authorizing; CMS replies with its origin.
         We then send the token to that exact origin.            */
      function onMessage(e) {
        if (sent) return;
        if (!window.opener) return;
        sent = true;
        window.opener.postMessage(msg, e.origin);
        setTimeout(close, 800);
      }
      window.addEventListener('message', onMessage, false);

      if (window.opener) {
        window.opener.postMessage('authorizing:github', '*');
      }

      /* Step 2 – fallback: if CMS never replies in 1.5 s, send
         the token directly to '*'.  Covers decap-cms 3.x and
         any CMS version that skips the handshake.              */
      setTimeout(function () {
        if (sent || !window.opener) return;
        sent = true;
        window.opener.postMessage(msg, '*');
        setTimeout(close, 800);
      }, 1500);

      /* Hard close after 8 s regardless */
      setTimeout(close, 8000);
    }());
  <\/script>
</body>
</html>`);
}

/* ── Helpers ─────────────────────────────────────────────── */
function html(res, status, body) {
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  return res.status(status).send(body);
}

function errorPage(msg) {
  return `<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="utf-8">
  <title>OAuth Fehler</title>
  <style>
    body { margin: 0; padding: 2rem; font-family: system-ui, sans-serif;
           background: #fef2f2; color: #7f1d1d; }
    h2   { margin-top: 0; }
    a    { color: #1d4ed8; }
    pre  { background: #fee2e2; padding: 1rem; border-radius: 6px; overflow: auto; }
  </style>
</head>
<body>
  <h2>&#9888; OAuth Fehler</h2>
  <p>${msg}</p>
  <p><a href="/admin">&#8592; Zurück zum Admin-Panel</a></p>
</body>
</html>`;
}
