"""Build the CV PDF from the profile site's content.

Reads the same data the profile and Experience pages use, renders an A4 HTML
document and prints it to profile/static/uploads/resume.pdf with headless Chrome.

Usage (from the repo root):  python tools/make_cv.py
"""
import datetime as dt
import glob
import html
import os
import re
import subprocess
import sys

import yaml

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PROFILE = os.path.join(ROOT, "profile", "content")
OUT_PDF = os.path.join(ROOT, "profile", "static", "uploads", "resume.pdf")
OUT_HTML = os.path.join(ROOT, "tools", "cv.html")
FONTS = os.path.join(ROOT, "blog", "static", "fonts")
AVATAR = os.path.join(PROFILE, "authors", "admin", "avatar.jpg")
CHROME = [r"C:\Program Files\Google\Chrome\Application\chrome.exe",
          r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe",
          "google-chrome", "chromium"]


def front_matter(path):
    text = open(path, encoding="utf-8").read()
    _, fm, body = re.split(r"^---[ \t]*$", text, maxsplit=2, flags=re.M)
    return yaml.safe_load(fm), body.strip()


def inline(s):
    s = html.escape(str(s), quote=False)
    s = re.sub(r"\[([^\]]+)\]\(([^)]+)\)", r'<a href="\2">\1</a>', s)
    s = re.sub(r"\*\*(.+?)\*\*", r"<strong>\1</strong>", s)
    s = re.sub(r"(?<!\*)\*(?!\*)(.+?)\*", r"<em>\1</em>", s)
    s = re.sub(r"_(.+?)_", r"<em>\1</em>", s)
    return s


def md(text):
    """Small Markdown subset: paragraphs, '- ' lists, pipe tables, inline styles."""
    out, lines, i = [], [l.rstrip() for l in str(text).strip().splitlines()], 0
    while i < len(lines):
        l = lines[i]
        if not l.strip():
            i += 1
        elif l.lstrip().startswith("- "):
            items = []
            while i < len(lines) and lines[i].lstrip().startswith("- "):
                items.append(f"<li>{inline(lines[i].lstrip()[2:])}</li>")
                i += 1
            out.append("<ul>" + "".join(items) + "</ul>")
        elif l.startswith("|"):
            rows = []
            while i < len(lines) and lines[i].startswith("|"):
                if not re.match(r"^\|[-\s|]+\|$", lines[i]):
                    rows.append([c.strip() for c in lines[i].strip("|").split("|")])
                i += 1
            head, *body = rows
            t = "<table><tr>" + "".join(f"<th>{inline(c)}</th>" for c in head) + "</tr>"
            t += "".join("<tr>" + "".join(f"<td>{inline(c)}</td>" for c in r) + "</tr>" for r in body)
            out.append(t + "</table>")
        else:
            para = []
            while i < len(lines) and lines[i].strip() and not lines[i].lstrip().startswith(("- ", "|")):
                para.append(lines[i].strip())
                i += 1
            out.append(f"<p>{inline(' '.join(para))}</p>")
    return "\n".join(out)


def ym(v, fmt="%b %Y"):
    if not v:
        return "Present"
    if isinstance(v, str) and re.match(r"^\d{4}-\d{2}-\d{2}", v):
        v = dt.date.fromisoformat(v[:10])
    if isinstance(v, (dt.date, dt.datetime)):
        return v.strftime(fmt)
    return str(v)


def block(sections, title):
    for s in sections:
        if s.get("block") == "markdown" and title.lower() in str(s.get("content", {}).get("title", "")).lower():
            return s["content"].get("text", "")
    return ""


def main():
    me, about = front_matter(os.path.join(PROFILE, "authors", "admin", "_index.md"))
    home, _ = front_matter(os.path.join(PROFILE, "_index.md"))
    exp, _ = front_matter(os.path.join(PROFILE, "experience.md"))
    about = re.sub(r"^## About Me\s*", "", about)
    about = re.sub(r"^\*Views expressed.*$", "", about, flags=re.M).strip()  # disclaimer is for the site, not the CV

    pubs = []
    for f in glob.glob(os.path.join(PROFILE, "publication", "*", "index.md")):
        p, _ = front_matter(f)
        authors = ["Kalyvas, C." if a == "admin" else a for a in p.get("authors", [])]
        doi = (p.get("hugoblox") or {}).get("ids", {}).get("doi")
        arxiv = (p.get("hugoblox") or {}).get("ids", {}).get("arxiv")
        pubs.append(dict(year=str(p["date"])[:4], title=p["title"], authors=", ".join(authors),
                         venue=p.get("publication", ""), kind=p.get("publication_types", [""])[0],
                         ref=f"doi:{doi}" if doi else (f"arXiv:{arxiv}" if arxiv else "")))
    pubs.sort(key=lambda x: x["year"], reverse=True)
    kinds = [("article-journal", "Journal articles"), ("paper-conference", "Conference papers"), ("article", "Preprints")]

    links = {pr["url"]: pr for pr in me.get("profiles", [])}
    email = next((u.replace("mailto:", "") for u in links if u.startswith("mailto:")), "")
    contact = [f'<a href="mailto:{email}">{email}</a>', '<a href="https://christoskalyvas.eu">christoskalyvas.eu</a>']
    for key, label in (("linkedin", "LinkedIn"), ("github", "GitHub"), ("scholar", "Google Scholar")):
        u = next((u for u in links if key in u), None)
        if u:
            contact.append(f'<a href="{u}">{label}</a>')
    contact.append(f'<a href="https://orcid.org/{me["orcid"]}">ORCID {me["orcid"]}</a>')

    H = []
    H.append(f'''<header><img class="photo" src="file:///{AVATAR.replace(os.sep, "/")}" alt="">
<div><h1>{inline(me["title"])}, PhD</h1><div class="role">{inline(me["role"])}</div>
<div class="contact">{" · ".join(contact)}</div></div></header>''')
    H.append(f'<section><h2>Profile</h2>{md(about)}</section>')
    H.append('<section class="two"><div><h2>Interests</h2><ul>' + "".join(f"<li>{inline(i)}</li>" for i in me["interests"]) + "</ul></div>")
    H.append("<div><h2>Education</h2>" + "".join(
        f'<div class="edu"><strong>{inline(e["area"])}</strong><span class="when">{ym(e["date_start"], "%Y")}–{ym(e["date_end"], "%Y")}</span><div class="org">{inline(e["institution"])}</div>{md(e.get("summary", ""))}</div>'
        for e in me["education"]) + "</div></section>")
    focus = block(home["sections"], "Focus")
    if focus:
        H.append(f'<section><h2>Focus areas</h2>{md(focus)}</section>')
    H.append("<section><h2>Experience</h2>" + "".join(
        f'<div class="job"><div class="jobhead"><strong>{inline(w["position"])}</strong><span class="when">{ym(w["date_start"])} – {ym(w.get("date_end"))}</span></div><div class="org">{inline(w["company_name"])}</div>{md(w.get("summary", ""))}</div>'
        for w in me["work"]) + "</section>")
    for title in ("Research Projects", "Talks & Recognition"):
        t = block(exp["sections"], title)
        if t:
            H.append(f"<section><h2>{html.escape(title)}</h2>{md(t)}</section>")
    H.append('<section><h2>Skills</h2><div class="skills">' + "".join(
        f'<div><h3>{inline(g["name"])}</h3>' + "".join(f'<p><strong>{inline(it["name"])}</strong><br><span class="muted">{inline(it.get("description", ""))}</span></p>' for it in g["items"]) + "</div>"
        for g in me["skills"]) + "</div></section>")
    fw = block(exp["sections"], "Frameworks")
    if fw:
        H.append(f"<section><h2>Frameworks &amp; Community</h2>{md(fw)}</section>")
    H.append('<section><h2>Certifications</h2><ul>' + "".join(
        f'<li>{inline(a["title"])} <span class="muted">· {inline(a["awarder"])}{" · " + ym(a["date"], "%Y") if a.get("date") else ""}</span></li>' for a in me["awards"]) + "</ul></section>")
    P = ["<section><h2>Publications</h2>"]
    for k, label in kinds:
        items = [p for p in pubs if p["kind"] == k]
        if items:
            P.append(f"<h3>{label}</h3><ol>" + "".join(
                f'<li>{inline(p["authors"])} ({p["year"]}). <strong>{inline(p["title"])}</strong>. {inline(p["venue"])}. <span class="muted">{p["ref"] if p["ref"].split(":")[-1] not in p["venue"] else ""}</span></li>' for p in items) + "</ol>")
    H.append("".join(P) + "</section>")

    font = lambda fam, f, style: f'@font-face{{font-family:"{fam}";src:url("file:///{os.path.join(FONTS, f).replace(os.sep, "/")}") format("woff2");font-weight:100 1000;font-style:{style}}}'
    css = "\n".join([font("DM Sans", "dm-sans-normal-latin.woff2", "normal"), font("DM Sans", "dm-sans-italic-latin.woff2", "italic"),
                     font("DM Sans", "dm-sans-normal-latin-ext.woff2", "normal")]) + '''
@page { size: A4; margin: 14mm 15mm 14mm 15mm; }
* { box-sizing: border-box; }
body { font-family: "DM Sans", "Segoe UI", sans-serif; font-size: 9.6pt; line-height: 1.45; color: #1e293b; margin: 0; }
a { color: #1d4ed8; text-decoration: none; }
header { display: flex; gap: 16px; align-items: center; padding-bottom: 10px; border-bottom: 2px solid #0f172a; margin-bottom: 8px; }
.photo { width: 78px; height: 78px; border-radius: 50%; object-fit: cover; }
h1 { font-size: 21pt; margin: 0; color: #0f172a; letter-spacing: -0.01em; }
.role { font-size: 11pt; font-weight: 600; color: #334155; margin: 2px 0 4px; }
.contact { font-size: 8.6pt; color: #475569; }
h2 { font-size: 11pt; text-transform: uppercase; letter-spacing: 0.06em; color: #0f172a; border-bottom: 1px solid #cbd5e1; padding-bottom: 2px; margin: 12px 0 6px; }
h3 { font-size: 9.8pt; margin: 6px 0 3px; color: #0f172a; }
p { margin: 0 0 5px; }
ul, ol { margin: 2px 0 6px; padding-left: 16px; }
li { margin-bottom: 2px; }
section { break-inside: auto; }
.two { display: grid; grid-template-columns: 1fr 1fr; gap: 0 22px; }
.edu, .job { margin-bottom: 7px; break-inside: avoid; }
.jobhead { display: flex; justify-content: space-between; gap: 10px; }
.when { float: right; color: #64748b; font-size: 8.8pt; white-space: nowrap; }
.jobhead .when { float: none; }
.org { color: #475569; font-style: italic; margin-bottom: 2px; }
.muted { color: #64748b; }
.skills { display: grid; grid-template-columns: repeat(3, 1fr); gap: 0 16px; }
.skills p { margin-bottom: 5px; font-size: 9pt; }
table { width: 100%; border-collapse: collapse; font-size: 9pt; }
th, td { text-align: left; vertical-align: top; padding: 3px 6px; border-bottom: 1px solid #e2e8f0; }
th { color: #0f172a; }
td:first-child { width: 30%; font-weight: 600; }
'''
    doc = f'<!doctype html><html lang="en"><head><meta charset="utf-8"><title>CV · {html.escape(me["title"])}</title><style>{css}</style></head><body>{"".join(H)}</body></html>'
    open(OUT_HTML, "w", encoding="utf-8").write(doc)

    chrome = next((c for c in CHROME if os.path.exists(c)), None) or CHROME[-2]
    subprocess.run([chrome, "--headless=new", "--disable-gpu", "--allow-file-access-from-files",
                    "--no-pdf-header-footer", f"--print-to-pdf={OUT_PDF}", "file:///" + OUT_HTML.replace(os.sep, "/")],
                   check=True, capture_output=True)
    print("written", OUT_PDF)


if __name__ == "__main__":
    sys.exit(main())
