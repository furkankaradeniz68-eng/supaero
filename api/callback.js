/**
 * Decap CMS — GitHub OAuth callback
 * Route: GET /api/callback
 *
 * 1. Exchanges the GitHub `code` for an access token (server-side, secret never exposed).
 * 2. Returns an HTML page whose inline script postMessages the token back to the
 *    CMS opener window so Decap CMS can complete the login flow.
 */
export default async function handler(req, res) {
  const { code } = req.query;

  /* ── Guard: missing code ───────────────────────────────── */
  if (!code) {
    return res.status(400).send(errorPage('Kein OAuth-Code empfangen (Parameter fehlt).'));
  }

  const clientId     = process.env.GITHUB_CLIENT_ID;
  const clientSecret = process.env.GITHUB_CLIENT_SECRET;

  /* ── Guard: missing env vars ───────────────────────────── */
  if (!clientId || !clientSecret) {
    return res.status(500).send(
      errorPage('Umgebungsvariablen GITHUB_CLIENT_ID / GITHUB_CLIENT_SECRET fehlen in Vercel.')
    );
  }

  /* ── Exchange code → access token ─────────────────────── */
  let token;
  try {
    const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ client_id: clientId, client_secret: clientSecret, code }),
    });

    const data = await tokenRes.json();

    if (data.error) {
      return res.status(400).send(
        errorPage('GitHub OAuth Fehler: ' + (data.error_description || data.error))
      );
    }

    token = data.access_token;
  } catch (err) {
    return res.status(500).send(errorPage('Token-Austausch fehlgeschlagen: ' + err.message));
  }

  /* ── Return postMessage page ───────────────────────────── */
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  return res.status(200).send(successPage(token));
}

/* ── Helper: success HTML ──────────────────────────────────────────────── */
function successPage(token) {
  // Safely embed the token — it is alphanumeric so no escaping needed,
  // but we JSON-stringify the full payload to be safe.
  const payload = JSON.stringify({ token: token, provider: 'github' });

  return `<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="utf-8">
  <title>Anmeldung erfolgreich</title>
  <style>
    body{margin:0;display:flex;align-items:center;justify-content:center;
         min-height:100vh;font-family:system-ui,sans-serif;background:#f8fafc;color:#334155;}
    p{font-size:1rem;}
  </style>
</head>
<body>
  <p>✅ Anmeldung erfolgreich&nbsp;— Fenster schließt sich…</p>
  <script>
    (function () {
      // Decap CMS expects this exact message format.
      // We use the two-step handshake: announce ourselves, then wait for the
      // opener to reply with its origin, then send the token to that origin.
      var payload = 'authorization:github:success:' + ${JSON.stringify(payload)};

      function receiveMessage(e) {
        // CMS opener replies from its own origin — send token there.
        if (window.opener) {
          window.opener.postMessage(payload, e.origin);
        }
        setTimeout(function () { window.close(); }, 500);
      }

      window.addEventListener('message', receiveMessage, false);

      // Announce to the opener that we are authorizing.
      if (window.opener) {
        window.opener.postMessage('authorizing:github', '*');
      }

      // Fallback: if the opener never replies, close after 5 s.
      setTimeout(function () { window.close(); }, 5000);
    }());
  <\/script>
</body>
</html>`;
}

/* ── Helper: error HTML ────────────────────────────────────────────────── */
function errorPage(message) {
  return `<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="utf-8">
  <title>OAuth Fehler</title>
  <style>
    body{margin:0;padding:2rem;font-family:system-ui,sans-serif;background:#fef2f2;color:#7f1d1d;}
    h2{margin-top:0;}a{color:#1d4ed8;}
  </style>
</head>
<body>
  <h2>OAuth Fehler</h2>
  <p>${message}</p>
  <p><a href="/admin">&#8592; Zurück zum Admin-Panel</a></p>
<\/body>
</html>`;
}
