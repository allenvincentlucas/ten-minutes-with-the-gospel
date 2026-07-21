// Ten Minutes with the Gospel — shared month page script.
// Every /YYYY/MM/index.html points to this ONE file. It figures out which
// year/month it's in from its own URL, then filters manifest.json down to
// that month. Copying the month-page template into a new /YYYY/MM/ folder
// never requires editing this file.

(function () {
  var MONTH_NAMES = ["January","February","March","April","May","June",
    "July","August","September","October","November","December"];

  var segs = window.location.pathname.split("/").filter(Boolean);
  if (segs.length && segs[segs.length - 1].indexOf(".") !== -1) segs.pop();
  var month = segs[segs.length - 1];
  var year = segs[segs.length - 2];
  var label = MONTH_NAMES[parseInt(month, 10) - 1] + " " + year;

  document.getElementById("month-eyebrow").textContent = label;
  document.getElementById("month-title").textContent = "Reflections from " + label;
  document.getElementById("crumb-month").textContent = label;
  document.title = label + " — Ten Minutes with the Gospel";

  fetch("../../manifest.json")
    .then(function (res) { return res.json(); })
    .then(function (entries) {
      var thisMonth = (entries || []).filter(function (e) {
        return e.date.slice(0, 7) === year + "-" + month;
      }).sort(function (a, b) { return a.date < b.date ? 1 : -1; });

      if (thisMonth.length === 0) return;

      var list = document.getElementById("day-list");
      list.innerHTML = "";

      thisMonth.forEach(function (e) {
        var day = e.date.slice(8, 10);
        var a = document.createElement("a");
        a.className = "day-card";
        a.href = day + "/index.html";

        var h2 = document.createElement("h2");
        h2.textContent = e.title;

        var meta = document.createElement("p");
        meta.className = "day-card__meta";
        meta.textContent = e.liturgicalDay + (e.citation ? " \u2014 " + e.citation : "");

        var lede = document.createElement("p");
        lede.className = "day-card__lede";
        lede.textContent = e.lede;

        a.appendChild(h2);
        a.appendChild(meta);
        a.appendChild(lede);
        list.appendChild(a);
      });
    })
    .catch(function () {
      // Empty-state markup already in the page covers this case.
    });
})();
