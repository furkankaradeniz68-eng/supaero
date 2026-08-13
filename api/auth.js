/**
 * Decap CMS — GitHub OAuth start
 * Route: GET /api/auth
 * Redirects the browser to GitHub's OAuth authorization page.
 */
export default function handler(req, res) {
  const clientId = process.env.GITHUB_CLIENT_ID;

  if (!clientId) {
    res.status(500).send('GITHUB_CLIENT_ID environment variable is not set.');
    return;
  }

  const params = new URLSearchParams({
    client_id: clientId,
    scope: 'repo,user',
    redirect_uri: `https://supaero.de/api/callback`,
  });

  res.redirect(`https://github.com/login/oauth/authorize?${params.toString()}`);
}
