# utsoree.github.io

Personal academic website of Utsoree Das — <https://utsoree.github.io>

Hand-written static HTML, CSS and JavaScript. No framework, no build step, no
dependencies to install. GitHub Pages serves the files as they are (`.nojekyll`
disables the Jekyll build).

## Structure

```
index.html              Landing page
research/               Working papers and work in progress
publications/           Peer-reviewed publications
policy-reports/         Policy reports
cv/                     CV page (embeds files/CV_Utsoree.pdf)
contact/                Contact details
404.html                Not-found page
about/, resume/         Redirect stubs preserving old URLs
assets/css/site.css     The entire stylesheet
assets/js/site.js       Navigation, filters, scroll reveal
files/CV_Utsoree.pdf    The CV
images/                 Portrait and favicons
```

## Working on it locally

The pages use root-absolute paths (`/assets/css/site.css`), so they need a
server rather than opening the files directly:

```sh
python -m http.server 8000
```

Then open <http://localhost:8000>.

## Updating content

- **Add a publication** — copy an existing `<li class="entry">` block in
  `publications/index.html` and edit it.
- **Add an update to the homepage** — add an `<li>` to the relevant `.timeline`
  list in `index.html`.
- **Replace the CV** — overwrite `files/CV_Utsoree.pdf`, keeping the filename.
- **Change colours or type** — every token lives in the `:root` block at the top
  of `assets/css/site.css`.

The header and footer markup is repeated in each page. If you change a
navigation link, change it in all six pages plus `404.html`.
