/**
 * GitHub OAuth callback — exchanges the code for a token, then
 * redirects the browser back to /admin/ with the token in the URL.
 * The admin page reads it from the URL, stores it in sessionStorage,
 * and clears it from the address bar — no postMessage needed.
 */
export default async function handler(req, res) {
  const { code, error } = req.query;

  if (error) {
    return redirect(res, `/admin/?error=${encodeURIComponent(error)}`);
  }
  if (!code) {
    return redirect(res, '/admin/?error=missing_code');
  }

  const clientId     = process.env.GITHUB_CLIENT_ID;
  const clientSecret = process.env.GITHUB_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return redirect(res, '/admin/?error=missing_env_vars');
  }

  try {
    const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
      method : 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body   : JSON.stringify({ client_id: clientId, client_secret: clientSecret, code }),
    });
    const data = await tokenRes.json();

    if (data.error || !data.access_token) {
      const msg = data.error_description || data.error || 'no_token';
      return redirect(res, `/admin/?error=${encodeURIComponent(msg)}`);
    }

    // Redirect to admin with token in URL; admin stores it in sessionStorage
    return redirect(res, `/admin/?auth=${data.access_token}`);
  } catch (err) {
    return redirect(res, `/admin/?error=${encodeURIComponent(err.message)}`);
  }
}

function redirect(res, url) {
  res.setHeader('Location', url);
  return res.status(302).send('');
}
