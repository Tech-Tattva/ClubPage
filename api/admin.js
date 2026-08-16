/* ----------------------------------------------------
   TECH TATTVA - Vercel Serverless Function
   Handles Auth & Updates GitHub JSON files securely
   ---------------------------------------------------- */

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { action, passcode, events, announcements } = req.body || {};
  const ADMIN_PASSCODE = process.env.ADMIN_PASSCODE || 'techtattva2026';

  // Action: Verify Admin Passcode
  if (action === 'verifyAuth') {
    if (passcode === ADMIN_PASSCODE) {
      return res.status(200).json({ success: true, message: 'Authenticated successfully' });
    } else {
      return res.status(401).json({ success: false, message: 'Incorrect passcode' });
    }
  }

  // Action: Save Data to GitHub
  if (action === 'saveData') {
    const token = process.env.GITHUB_TOKEN;
    const repoOwner = process.env.GITHUB_OWNER || 'techtattva-kmce';
    const repoName = process.env.GITHUB_REPO || 'techtattva-website';
    const branch = process.env.GITHUB_BRANCH || 'main';

    if (!token) {
      return res.status(200).json({
        success: false,
        message: 'GITHUB_TOKEN environment variable is not configured on Vercel. Modifications were processed in local session.'
      });
    }

    try {
      const results = [];

      if (events) {
        const resEv = await updateGitHubFile(token, repoOwner, repoName, 'data/events.json', events, branch);
        results.push({ file: 'data/events.json', status: resEv });
      }

      if (announcements) {
        const resAnn = await updateGitHubFile(token, repoOwner, repoName, 'data/announcements.json', announcements, branch);
        results.push({ file: 'data/announcements.json', status: resAnn });
      }

      return res.status(200).json({
        success: true,
        message: 'Updated content successfully committed to GitHub repository!',
        details: results
      });

    } catch (error) {
      console.error('GitHub API Commit Error:', error);
      return res.status(500).json({
        success: false,
        error: error.message || 'Failed to update GitHub content'
      });
    }
  }

  return res.status(400).json({ error: 'Invalid action' });
}

async function updateGitHubFile(token, owner, repo, filePath, contentObj, branch) {
  const url = `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}?ref=${branch}`;
  const headers = {
    'Authorization': `token ${token}`,
    'Accept': 'application/vnd.github.v3+json',
    'User-Agent': 'TechTattva-Admin-App'
  };

  let currentSha = null;
  const getRes = await fetch(url, { headers });
  if (getRes.ok) {
    const getData = await getRes.json();
    currentSha = getData.sha;
  }

  const jsonString = JSON.stringify(contentObj, null, 2);
  const contentBase64 = Buffer.from(jsonString).toString('base64');

  const putUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`;
  const putBody = {
    message: `Admin Update: ${filePath} [skip ci]`,
    content: contentBase64,
    branch: branch
  };
  if (currentSha) {
    putBody.sha = currentSha;
  }

  const putRes = await fetch(putUrl, {
    method: 'PUT',
    headers: { ...headers, 'Content-Type': 'application/json' },
    body: JSON.stringify(putBody)
  });

  if (!putRes.ok) {
    const errorText = await putRes.text();
    throw new Error(`GitHub API error (${putRes.status}): ${errorText}`);
  }

  return await putRes.json();
}
