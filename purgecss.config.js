const fs = require("fs");
const R = require("ramda");

const distFiles = fs.readdirSync("./dist");
const cssFileName = R.filter((f) => R.endsWith(".css", f), distFiles)[0];

module.exports = {
  content: ["src/**/*.js"],
  css: ["dist/*.css"],
  output: "dist/" + cssFileName,
  safelist: {
    standard: ["html", "body", "pre", "code", "p", "pre"],
    greedy: [
      /mt/,
      /br/,
      /shadow-/,
      /w-/,
      /vh-/,
      /slide-pane/,
      /ReactModal/,
      /mv/,
      /mr/,
      /mt/,
      /mb/,
      /mh/,
      /pa/,
      /nt/,
      /yt/,
      /w-auto/,
    ],
  },
  // got default extractor from Tailwind
  defaultExtractor: (content) => content.match(/[^<>"'`\s]*[^<>"'`\s:]/g) || [],
};
