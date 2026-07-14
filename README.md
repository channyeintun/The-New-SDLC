# The New SDLC — Burmese Edition

This repository builds `The-New-SDLC.md` into HTML and PDF files.

## Requirements (macOS)

- macOS on Apple Silicon or Intel
- [Node.js](https://nodejs.org/) 22.17 or newer
- npm (included with Node.js)
- An internet connection for the first dependency installation

You can install Node.js with [Homebrew](https://brew.sh/):

```sh
brew install node@22
brew link --overwrite node@22
```

Confirm that Node.js and npm are available:

```sh
node --version
npm --version
```

## Install dependencies

Open Terminal, change to the repository directory, and install the exact versions recorded in `package-lock.json`:

```sh
cd /path/to/The-New-SDLC-Book-Burmese
npm ci
```

You normally only need to do this after cloning the repository or when `package-lock.json` changes.

## Build the book

After editing `The-New-SDLC.md`, run:

```sh
node scripts/build-book.mjs
```

The build creates these files in the repository root:

- `The-New-SDLC.html`
- `The-New-SDLC.pdf`

Existing output files with those names are replaced.

## Custom input and output names

The script optionally accepts a Markdown input path followed by a PDF output path:

```sh
node scripts/build-book.mjs path/to/book.md path/to/book.pdf
```

The HTML file is written beside the PDF with the same base name. The PDF output name should end in `.pdf`.

## Troubleshooting

### `ERR_MODULE_NOT_FOUND`

The dependencies are missing or out of date. Run:

```sh
npm ci
```

### Unsupported Node.js version

Check the installed version:

```sh
node --version
```

Use Node.js 22.17 or newer. If Homebrew still selects an older version, run:

```sh
brew link --overwrite node@22
```

Then open a new Terminal window and check the version again.

### Chromium installation or launch errors

Remove the installed dependencies and reinstall them:

```sh
rm -rf node_modules
npm ci
```

The first installation downloads the packages required to render the PDF, so ensure that the Mac has an internet connection and enough free disk space.
