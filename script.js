// Ten Minutes with the Gospel — home page
// Reads manifest.json (one entry per day, appended over time) and, once at
// least one entry exists, features the most recent one in the hero. Until
// then, the empty-state markup already in index.html stays as-is.

(function () {
  fetch("manifest.json")
    .then(function (res) { return res.json(); })
    .then(function (entries) {
      if (!Array.isArray(entries) || entries.length === 0) return;

      var latest = entries.slice().sort(function (a, b) {
        return a.date < b.date ? 1 : -1;
      })[0];

      var eyebrow = document.getElementById("hero-eyebrow");
      var title = document.getElementById("hero-title");
      var lede = document.getElementById("hero-lede");
      var citation = document.getElementById("hero-citation");
      var cta = document.getElementById("hero-cta");

      eyebrow.textContent = latest.liturgicalDay || "Today's ten minutes";
      title.textContent = latest.title;
      lede.textContent = latest.lede;

      if (latest.citation) {
        citation.textContent = latest.citation;
        citation.hidden = false;
      }

      cta.textContent = "Read the reflection \u2192";
      cta.href = latest.slug.replace(/\/?$/, "/") + "index.html";
    })
    .catch(function () {
      // If manifest.json can't be read (e.g. opened via file:// locally),
      // the static empty-state content already in the page is fine as-is.
    });
})();
