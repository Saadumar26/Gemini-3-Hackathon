Thumbnail conversion instructions

Files created:
- `thumbnail.svg` (1200x800, 3:2 aspect ratio)

Recommended conversions to JPG/PNG (local):

1) Using ImageMagick (most systems):

```bash
# Convert to high-quality JPG (800 KB - 2 MB depending on content)
magick convert thumbnail.svg -background white -flatten -quality 90 thumbnail.jpg

# Convert to PNG
magick convert thumbnail.svg -background transparent -flatten thumbnail.png
```

2) Using `rsvg-convert` (librsvg):

```bash
# Install on macOS: brew install librsvg
rsvg-convert -w 1200 -h 800 thumbnail.svg -o thumbnail.png
# Convert PNG → JPG if needed
magick convert thumbnail.png -quality 90 thumbnail.jpg
```

3) Using Node + sharp (programmatic):

```bash
# Install sharp once
npm install sharp

# Example script (save as convert.js)
const sharp = require('sharp');
const fs = require('fs');
const svg = fs.readFileSync('thumbnail.svg');
sharp(svg)
  .resize(1200, 800)
  .jpeg({ quality: 90 })
  .toFile('thumbnail.jpg')
  .then(() => console.log('thumbnail.jpg created'))
  .catch(err => console.error(err));

# Run:
node convert.js
```

Notes:
- Output JPG size depends on compression (`-quality` or `quality` option). Keep ≤5MB by reducing quality if needed.
- If you want me to produce the JPG inside the repo, I can attempt to install `sharp` and run the conversion here (requires agree to install dev dependency). Say the word and I'll proceed.
