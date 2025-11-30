# Deploy to GitHub Pages

This project is a static ES modules web app. Below are step-by-step instructions to publish it on GitHub Pages using the `gh-pages` branch (via GitHub Actions).

1) Create a repository on GitHub (e.g. `your-user/adn1.2`).

2) From your project folder, run these PowerShell commands to push the code:

```powershell
# initialize local git (if not already a repo)
git init
git add --all
git commit -m "Initial commit"

# add remote (replace URL)
git remote add origin https://github.com/<your-user>/<your-repo>.git

# push to main (create main branch locally first if needed)
git branch -M main
git push -u origin main
```

3) The repository includes a GitHub Actions workflow at `.github/workflows/deploy-gh-pages.yml` that runs on pushes to `main`. The workflow will create/update the `gh-pages` branch with the repository content and publish it.

Notes & tips
- The action uses the automatically-provided `GITHUB_TOKEN`; no manual secret is required.
- By default the workflow publishes the repository root to the `gh-pages` branch. If you prefer to publish only `docs/`, change `publish_dir` in the workflow to `./docs` and move site files there.
- After the workflow completes, go to your repository's Settings → Pages and select branch `gh-pages` (if not auto-selected) and `/ (root)` as the folder. The site URL will be shown there.
- If your repo is private, Pages may require additional settings — consider making the repo public for simple hosting.

Troubleshooting
- If the workflow did not run: check Actions tab and the pushed commit on `main`.
- If the site shows 404: verify the `gh-pages` branch exists and contains the built files; ensure Pages is set to use `gh-pages` in repository settings.

If you want, I can also:
- Add a simple `CNAME` support helper if you plan to use a custom domain.
- Adjust the workflow to exclude files like `.github` or `README.md` from the published output.
