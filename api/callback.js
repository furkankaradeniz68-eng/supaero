/**
 * Decap CMS — GitHub OAuth callback
 * Route: GET /api/callback
 * Exchanges the GitHub `code` for an access token, then posts it back
 * to Decap CMS via a postMessage so the CMS can complete the login.
 */
export default async function handler(req, res) {
  const { code } = req.query;

  if (!code) {
    res.status(400).send('Missing OAuth code parameter.');
    return;
  }

  const clientId = process.env.GITHUB_CLIENT_ID;
  const clientSecret = process.env.GITHUB_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    res.status(500).send('GitHub OAuth environment variables are not configured.');
    return;
  }

  try {
    // Exchange code for access token
    const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        code,
      }),
    });

    const data = await tokenRes.json();

    if (data.error) {
      res.status(400).send(`GitHub OAuth error: ${data.error_description || data.error}`);
      return;
    }

    const token = data.access_token;
    const tokenType = data.token_type || 'bearer';

    // Decap CMS expects this exact postMessage format
    const script = `
<html>
<body>
<script>
  (function() {
    function receiveMessage(e) {
      console.log("Received message:", e);
      // Send token back to the CMS window
      window.opener.postMessage(
        'authorization:github:success:${JSON.stringify({ token, provider: 'github' })}',
        e.origin
      );
    }
    window.addEventListener("message", receiveMessage, false);
    window.opener.postMessage("authorizing:github", "*");
  })();
<\/script>
</body>
</html>`;

    res.setHeader('Content-Type', 'text/html');
    res.status(200).send(script);
  } catch (err) {
    console.error('OAuth callback error:', err);
    res.status(500).send('Internal server error during OAuth token exchange.');
  }
}
