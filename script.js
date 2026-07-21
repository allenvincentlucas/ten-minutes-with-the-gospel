// Ten Minutes with the Gospel — home page
// Reads manifest.json (one entry per day, appended over time) and, once at
// least one entry with a date of today or earlier exists, features the
// most recent one in the hero. Future-dated entries are ignored until
// their date arrives (compared against the visitor's own device clock) —
// this hides them from navigation, but the files themselves are still
// publicly reachable at their direct URL the whole time.

function tmgTodayISO() {
  var d = new Date();
  var m = String(d.getMonth() + 1).padStart(2, "0");
  var day = String(d.getDate()).padStart(2, "0");
  return d.getFullYear() + "-" + m + "-" + day;
}

(function () {
  fetch("manifest.json")
    .then(function (res) { return res.json(); })
    .then(function (entries) {
      var today = tmgTodayISO();
      var visible = (entries || []).filter(function (e) { return e.date <= today; });
      if (visible.length === 0) return;

      var latest = visible.slice().sort(function (a, b) {
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
