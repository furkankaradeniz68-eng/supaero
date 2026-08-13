/**
 * Returns the public GitHub OAuth Client ID to the frontend.
 * The Client ID is not a secret (it appears in every OAuth URL),
 * so exposing it here is safe.  The Client Secret never leaves
 * the server-side environment variables.
 */
export default function handler(req, res) {
  const clientId = process.env.GITHUB_CLIENT_ID;

  if (!clientId) {
    return res.status(500).json({
      error: 'GITHUB_CLIENT_ID ist nicht als Vercel-Umgebungsvariable gesetzt.',
    });
  }

  res.setHeader('Cache-Control', 'public, max-age=3600');
  return res.status(200).json({ clientId });
}
