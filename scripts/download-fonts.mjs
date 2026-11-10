import fs from "node:fs";
import path from "node:path";

const FONTS_DIR = path.resolve(process.cwd(), "public", "fonts");
const MIN_BYTES = 10 * 1024; // > 10 KB

/**
 * Validates that a buffer has valid WOFF2, WOFF, TTF, or OTF magic bytes and exceeds 10KB.
 */
function isValidFontBuffer(buf) {
  if (!buf || buf.length <= MIN_BYTES) {
    return false;
  }
  const magic4 = buf.subarray(0, 4).toString("ascii");
  if (magic4 === "wOF2" || magic4 === "wOFF" || magic4 === "OTTO" || magic4 === "true") {
    return true;
  }
  // TrueType 0x00010000
  if (buf[0] === 0x00 && buf[1] === 0x01 && buf[2] === 0x00 && buf[3] === 0x00) {
    return true;
  }
  return false;
}

async function fetchFirstValidUrl(urls, label) {
  for (const url of urls) {
    try {
      console.log(`[download-fonts] Trying ${label} from ${url} ...`);
      const res = await fetch(url, {
        headers: {
          "User-Agent": "Mozilla/5.0 (compatible; FontDownloader/1.0)"
        }
      });
      if (!res.ok) {
        console.warn(`[download-fonts] HTTP ${res.status} for ${url}`);
        continue;
      }
      const arrayBuf = await res.arrayBuffer();
      const buf = Buffer.from(arrayBuf);
      if (!isValidFontBuffer(buf)) {
        console.warn(
          `[download-fonts] Rejected ${url} (size=${buf.length} bytes or invalid font header)`
        );
        continue;
      }
      return { buf, url };
    } catch (err) {
      console.warn(`[download-fonts] Error fetching ${url}: ${err.message}`);
    }
  }
  return null;
}

async function main() {
  fs.mkdirSync(FONTS_DIR, { recursive: true });

  // 1. Poppins (600, 700, 800) & Inter (400, 500)
  const latinFonts = [
    {
      filename: "Poppins-SemiBold.woff2",
      urls: [
        "https://fonts.gstatic.com/s/poppins/v24/pxiByp8kv8JHgFVrLEj6V14.woff2",
        "https://cdn.jsdelivr.net/npm/@fontsource/poppins@5.1.0/files/poppins-devanagari-600-normal.woff2"
      ]
    },
    {
      filename: "Poppins-Bold.woff2",
      urls: [
        "https://fonts.gstatic.com/s/poppins/v24/pxiByp8kv8JHgFVrLCz7V14.woff2",
        "https://cdn.jsdelivr.net/npm/@fontsource/poppins@5.1.0/files/poppins-devanagari-700-normal.woff2"
      ]
    },
    {
      filename: "Poppins-ExtraBold.woff2",
      urls: [
        "https://fonts.gstatic.com/s/poppins/v24/pxiByp8kv8JHgFVrLDD4V14.woff2",
        "https://cdn.jsdelivr.net/npm/@fontsource/poppins@5.1.0/files/poppins-devanagari-800-normal.woff2"
      ]
    },
    {
      filename: "Inter-Regular.woff2",
      urls: [
        "https://cdn.jsdelivr.net/npm/@fontsource/inter@5.1.0/files/inter-latin-400-normal.woff2",
        "https://cdn.jsdelivr.net/npm/@fontsource/inter/files/inter-latin-400-normal.woff2"
      ]
    },
    {
      filename: "Inter-Medium.woff2",
      urls: [
        "https://cdn.jsdelivr.net/npm/@fontsource/inter@5.1.0/files/inter-latin-500-normal.woff2",
        "https://cdn.jsdelivr.net/npm/@fontsource/inter/files/inter-latin-500-normal.woff2"
      ]
    }
  ];

  for (const font of latinFonts) {
    const destPath = path.join(FONTS_DIR, font.filename);
    if (fs.existsSync(destPath)) {
      const existing = fs.readFileSync(destPath);
      if (isValidFontBuffer(existing)) {
        console.log(
          `[download-fonts] OK (already exists): ${font.filename} (${(existing.length / 1024).toFixed(1)} KB)`
        );
        continue;
      }
    }

    const downloaded = await fetchFirstValidUrl(font.urls, font.filename);
    if (!downloaded) {
      throw new Error(`Failed to download valid font file for ${font.filename}`);
    }
    fs.writeFileSync(destPath, downloaded.buf);
    console.log(
      `[download-fonts] Saved ${font.filename} (${(downloaded.buf.length / 1024).toFixed(1)} KB)`
    );
  }

  // 2. Jameel Noori Nastaleeq (.woff2 preferred, fallback to .ttf)
  const jameelWoff2Path = path.join(FONTS_DIR, "JameelNooriNastaleeq.woff2");
  const jameelTtfPath = path.join(FONTS_DIR, "JameelNooriNastaleeq.ttf");

  const jameelWoff2Urls = [
    "https://cdn.jsdelivr.net/npm/jameel-noori@1.1.2/fonts/jameel-noori-nastaleeq4.woff2",
    "https://unpkg.com/jameel-noori@1.1.2/fonts/jameel-noori-nastaleeq4.woff2",
    "https://cdn.jsdelivr.net/gh/typeface-pakistan/jameel-noori-nastaleeq@master/JameelNooriNastaleeq.woff2"
  ];

  const jameelTtfUrls = [
    "https://raw.githubusercontent.com/abid-mujtaba/ttf-jameel-noori-nastaleeq/master/Jameel%20Noori%20Nastaleeq.ttf",
    "https://raw.githubusercontent.com/hafizrahmat786/jameel-noori-nastaleeq-regular/main/Jameel%20Noori%20Nastaleeq%20Regular.ttf",
    "https://raw.githubusercontent.com/itx-ashir/Jameel-Noori-Nastaleeq-Font/main/Jameel%20Noori%20Nastaleeq.ttf"
  ];

  let jameelSavedFile = null;

  if (fs.existsSync(jameelWoff2Path) && isValidFontBuffer(fs.readFileSync(jameelWoff2Path))) {
    jameelSavedFile = "JameelNooriNastaleeq.woff2";
    console.log(`[download-fonts] OK (already exists): ${jameelSavedFile}`);
  } else if (fs.existsSync(jameelTtfPath) && isValidFontBuffer(fs.readFileSync(jameelTtfPath))) {
    jameelSavedFile = "JameelNooriNastaleeq.ttf";
    console.log(`[download-fonts] OK (already exists): ${jameelSavedFile}`);
  } else {
    const woff2Result = await fetchFirstValidUrl(jameelWoff2Urls, "JameelNooriNastaleeq.woff2");
    if (woff2Result) {
      fs.writeFileSync(jameelWoff2Path, woff2Result.buf);
      jameelSavedFile = "JameelNooriNastaleeq.woff2";
      console.log(
        `[download-fonts] Saved ${jameelSavedFile} (${(woff2Result.buf.length / 1024).toFixed(1)} KB)`
      );
    } else {
      const ttfResult = await fetchFirstValidUrl(jameelTtfUrls, "JameelNooriNastaleeq.ttf");
      if (!ttfResult) {
        throw new Error("Could not download JameelNooriNastaleeq from any WOFF2 or TTF mirror.");
      }
      fs.writeFileSync(jameelTtfPath, ttfResult.buf);
      jameelSavedFile = "JameelNooriNastaleeq.ttf";
      console.log(
        `[download-fonts] Saved ${jameelSavedFile} (${(ttfResult.buf.length / 1024).toFixed(1)} KB)`
      );
    }
  }

  console.log("\n[download-fonts] Verification Summary (all > 10 KB):");
  for (const entry of fs.readdirSync(FONTS_DIR)) {
    if (entry.endsWith(".woff2") || entry.endsWith(".ttf")) {
      const full = path.join(FONTS_DIR, entry);
      const stat = fs.statSync(full);
      if (stat.size <= MIN_BYTES) {
        throw new Error(`Font file ${entry} is too small (${stat.size} bytes <= 10KB)`);
      }
      console.log(`  ✔ ${entry} — ${(stat.size / 1024).toFixed(1)} KB`);
    }
  }
}

main().catch((err) => {
  console.error("[download-fonts] FATAL:", err);
  process.exit(1);
});
