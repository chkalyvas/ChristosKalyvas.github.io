# Christos Kalyvas-Kasopatidis: personal website

Two Hugo sites, built together by GitHub Actions and published to GitHub Pages:

| Path        | Folder      | Theme                                                                 | Purpose                         |
|-------------|-------------|-----------------------------------------------------------------------|---------------------------------|
| `/`         | `blog/`     | [Blowfish](https://blowfish.page/) (submodule) | Blog                            |
| `/profile/` | `profile/`  | [Hugo Blox Academic CV](https://hugoblox.com) (modules vendored in `_vendor/`) | Bio, experience, publications, CV |

Every push to `main` runs [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml), which builds both
sites into one `public/` folder and deploys it. Pull requests are built (as a check) but not deployed.

## Clone

```bash
git clone --recurse-submodules https://github.com/chkalyvas/ChristosKalyvas.github.io.git
```

On Windows run `git config core.longpaths true` first (the vendored Hugo Blox paths are long).

## Local development

Requires [Hugo extended](https://gohugo.io/installation/) 0.163–0.166 (CI uses 0.164.0) and Node.js 22+.

```bash
# Blog -> http://localhost:1313/
cd blog && hugo server

# Profile -> http://localhost:1313/profile/   (first time: npm ci)
cd profile && npm ci && hugo server
```

## Writing

- **New blog post:** `cd blog && hugo new content posts/my-post/index.md`, set `draft: false`, push.
- **Profile / bio / education / work / skills:** `profile/content/authors/admin/_index.md`
- **Profile homepage sections:** `profile/content/_index.md`
- **Publications:** add folders under `profile/content/publication/` (see the
  [Hugo Blox docs](https://docs.hugoblox.com/content/publications/)), or commit a `publications.bib`
  at the repo root and the *Import publications* workflow opens a PR converting it.
- **CV PDF:** generated from the profile content. After changing the profile, run `python tools/make_cv.py` (needs Python with PyYAML and Chrome or Edge) and commit `profile/static/uploads/resume.pdf`.

## Updating themes

```bash
git submodule update --remote blog/themes/blowfish   # Blowfish (check its required Hugo version first)
```
