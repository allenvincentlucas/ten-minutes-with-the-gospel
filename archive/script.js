// Ten Minutes with the Gospel — archive page
// Groups every manifest.json entry by year-month and lists them newest
// first. Each card links to that month's page (e.g. 2026/07/index.html).

(function () {
  var MONTH_NAMES = ["January","February","March","April","May","June",
    "July","August","September","October","November","December"];

  fetch("../manifest.json")
    .then(function (res) { return res.json(); })
    .then(function (entries) {
      if (!Array.isArray(entries) || entries.length === 0) return;

      var byMonth = {};
      entries.forEach(function (e) {
        var ym = e.date.slice(0, 7); // "YYYY-MM"
        byMonth[ym] = byMonth[ym] || [];
        byMonth[ym].push(e);
      });

      var months = Object.keys(byMonth).sort().reverse();
      var list = document.getElementById("archive-list");
      list.innerHTML = "";

      months.forEach(function (ym) {
        var parts = ym.split("-");
        var year = parts[0], monthNum = parseInt(parts[1], 10);
        var count = byMonth[ym].length;

        var a = document.createElement("a");
        a.className = "month-card";
        a.href = year + "/" + parts[1] + "/index.html";

        var h2 = document.createElement("h2");
        h2.textContent = MONTH_NAMES[monthNum - 1] + " " + year;

        var p = document.createElement("p");
        p.textContent = count + (count === 1 ? " reflection" : " reflections");

        a.appendChild(h2);
        a.appendChild(p);
        list.appendChild(a);
      });
    })
    .catch(function () {
      // Empty-state markup already in the page covers this case.
    });
})();
