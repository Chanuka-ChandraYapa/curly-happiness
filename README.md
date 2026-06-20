
## Quick setup (15 minutes)

### 1. Create a GitHub repository

1. Go to [github.com/new](https://github.com/new)
2. Name it (e.g. `amara-silva-law` or just `amara`)
3. Set it to **Public** (required for free GitHub Pages)
4. Push this folder's contents:

```bash
cd lawyer-site
git init
git add .
git commit -m "Initial site"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git push -u origin main
```

### 2. Update config files

**`admin/config.yml`** — replace the two placeholders:
```yaml
repo: YOUR_GITHUB_USERNAME/YOUR_REPO_NAME
site_url: https://YOUR_GITHUB_USERNAME.github.io/YOUR_REPO_NAME
```

**`index.html`** — in the `handleSubmit` function, replace `YOUR_FORM_ID` with your [Formspree](https://formspree.io) ID (free tier handles up to 50 submissions/month). Or delete that section and just use the email link.

### 3. Enable GitHub Pages

1. Go to your repo → **Settings** → **Pages**
2. Set Source to **Deploy from a branch**, branch: `gh-pages`
3. Save

The GitHub Action (`.github/workflows/deploy.yml`) runs automatically on every push and deploys the site.

### 4. Set up Decap CMS authentication

Decap CMS needs a way to commit to your repo via a browser. The simplest approach for GitHub Pages is **Netlify Identity + Git Gateway**:

1. Create a free account at [netlify.com](https://netlify.com)
2. Import your GitHub repo as a new Netlify site (you won't use Netlify for hosting — just for auth)
3. Enable **Identity** under Site settings → Identity
4. Enable **Git Gateway** under Identity → Services → Git Gateway
5. Invite your friend as a user under Identity → Invite users

Once that's done, she visits `https://YOUR_USERNAME.github.io/YOUR_REPO/admin/` and logs in with her Netlify Identity email/password to access the CMS.

**Alternatively**, use [Sveltia CMS](https://github.com/sveltia/sveltia-cms) or [Tina CMS](https://tina.io) if you prefer a different auth flow.

---

## Customise the site

| What to change | Where |
|---|---|
| Name, bio, practice areas | `index.html` — search for "Amara Silva" |
| Contact details (email, phone, address) | `index.html` — contact section |
| Stats (years, cases, degree) | `index.html` — `.hero-credentials` |
| Profile photo | Replace `images/profile.jpg` with a portrait photo |
| Colour palette | `index.html` — `:root` CSS variables |
| Form submissions | `index.html` — replace `YOUR_FORM_ID` with Formspree ID |

---

## Publishing articles (for your friend)

1. Go to `https://YOUR_USERNAME.github.io/YOUR_REPO/admin/`
2. Log in with Netlify Identity credentials
3. Click **New Article** → fill in title, category, date, excerpt, body
4. Click **Publish** — Decap CMS commits the markdown file to GitHub
5. GitHub Actions runs `build.js`, generates JSON files, and deploys — live in ~1–2 minutes

---

## Local development

```bash
# Run locally (needs Node.js)
node build.js          # generate JSON from articles
npx serve .            # serve at http://localhost:3000
```

No build system, no npm install needed. Pure HTML/CSS/JS.
