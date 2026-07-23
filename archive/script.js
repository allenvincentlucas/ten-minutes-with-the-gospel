// Ten Minutes with the Gospel — archive page
// Reads manifest.json (one entry per day) and groups every entry whose
// date is today-or-earlier into its month, linking to that month's page.
// Future-dated entries are hidden from this list until their date arrives
// (compared against the visitor's own device clock) — this hides them
// from navigation only, not from the internet; the files themselves are
// still publicly reachable at their direct URL the whole time.
function tmgTodayISO() {
  var d = new Date();
  var m = String(d.getMonth() + 1).padStart(2, "0");
  var day = String(d.getDate()).padStart(2, "0");
  return d.getFullYear() + "-" + m + "-" + day;
}

var TMG_MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

(function () {
  var list = document.getElementById("archive-list");
  var empty = document.getElementById("archive-empty");

  fetch("../manifest.json")
    .then(function (res) { return res.json(); })
    .then(function (entries) {
      var today = tmgTodayISO();
      var visible = (entries || []).filter(function (e) { return e.date <= today; });

      if (visible.length === 0) return; // leave the static empty-state markup as-is

      // Group by YYYY-MM
      var months = {};
      visible.forEach(function (e) {
        var key = e.date.slice(0, 7); // "YYYY-MM"
        if (!months[key]) months[key] = [];
        months[key].push(e);
      });

      // Newest month first
      var monthKeys = Object.keys(months).sort(function (a, b) {
        return a < b ? 1 : -1;
      });

      if (!list) return;

      monthKeys.forEach(function (key) {
        var parts = key.split("-");
        var year = parts[0];
        var monthNum = parseInt(parts[1], 10);
        var monthName = TMG_MONTH_NAMES[monthNum - 1];

        var monthEntries = months[key].slice().sort(function (a, b) {
          return a.date < b.date ? 1 : -1;
        });

        var section = document.createElement("section");
        section.className = "archive-month";

        var heading = document.createElement("h2");
        var monthLink = document.createElement("a");
        monthLink.href = "../" + year + "/" + parts[1] + "/index.html";
        monthLink.textContent = monthName + " " + year;
        heading.appendChild(monthLink);
        section.appendChild(heading);

        var ul = document.createElement("ul");
        ul.className = "archive-entries";
        monthEntries.forEach(function (e) {
          var li = document.createElement("li");
          var a = document.createElement("a");
          a.href = "../" + e.slug.replace(/\/?$/, "/") + "index.html";
          a.textContent = e.title;
          li.appendChild(a);
          if (e.liturgicalDay) {
            var span = document.createElement("span");
            span.className = "archive-entry-day";
            span.textContent = " — " + e.liturgicalDay;
            li.appendChild(span);
          }
          ul.appendChild(li);
        });
        section.appendChild(ul);

        list.appendChild(section);
      });

      if (empty) empty.hidden = true;
      list.hidden = false;
    })
    .catch(function () {
      // If manifest.json can't be read (e.g. opened via file:// locally,
      // or the fetch genuinely fails), the static empty-state content
      // already in the page is fine as-is.
    });
})();
