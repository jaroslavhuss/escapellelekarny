"use strict";
var form = document.getElementById("submitFormPharmacyFinder"),
  inputField = document.getElementById("lekarnafinder"),
  pharmaList = document.getElementById("pharmaLists");
function workAllDataWell(n, e) {
  if (inputField.value.length > 3) {
    for (
      var t = [], a = new RegExp(inputField.value, "i"), o = 0;
      o < n.length;
      o++
    )
      if (n[o].fullText.match(a)) {
        (n[o].openingHours = []), t.push(n[o]);
        for (var l = 0; l < e.length; l++)
          n[o].KOD_PRACOVISTE === e[l].KOD_PRACOVISTE &&
            n[o].openingHours.push(e[l]);
      }
    writeTheFinalHTML(t);
  } else
    pharmaList.innerHTML =
      "<p>I need you to be more specific! Put more than 3 characters!</p>";
}
function writeTheFinalHTML(n) {
  console.log(n);
  var e = "",
    t = new Date().getDay();
  if (n.length > 0) {
    for (var a = 0; a < n.length; a++) {
      var o = n[a].NAZEV + " - " + n[a].ULICE,
        l = void 0,
        s = void 0,
        i = "";
      (l = n[a].WWW
        ? '<a target="_blank" href="' + n[a].WWW + '">www</a>'
        : ""),
        (s = n[a].TELEFON ? n[a].TELEFON : ""),
        (i = n[a].EMAIL
          ? '<a target="_blank" href="mailto:' + n[a].EMAIL + '">@</a>'
          : ""),
        (e += '\n      <h3 class="collapseThis">'
          .concat(
            o,
            '</h3>\n      <div class="theData">\n      <span class="main-bar">\n      <a target="_blank" href="'
          )
          .concat("http://maps.google.com/maps?q=" + o, '">Map</a> ')
          .concat(l, " ")
          .concat(i, " tel: ")
          .concat(
            s,
            "\n      </span>\n      <div class='opening-hours'>\n         <table>\n       <tbody>\n      "
          ));
      for (var r = 0; r < n[a].openingHours.length; r++) {
        var c = "",
          h = "";
        (c =
          n[a].openingHours[r].OD.length > 0
            ? n[a].openingHours[r].OD
            : "closed"),
          (h =
            n[a].openingHours[r].DO.length > 0
              ? n[a].openingHours[r].DO
              : "closed");
        console.log(t),
          console.log(r),
          (e += "\n         \n                <tr "
            .concat(
              t - 1 === r ? 'class="thisIsTheDay"' : "",
              ">\n                    <td>"
            )
            .concat(n[a].openingHours[r].DEN, "</td>\n                    <td>")
            .concat(c, "</td>\n                    <td>")
            .concat(
              h,
              "</td>\n                   \n                </tr>\n      \n         "
            ));
      }
      e +=
        "\n         </>\n         </table>\n         </div>\n         </div>\n         ";
    }
    (pharmaList.innerHTML = e), collapseTheItem();
  } else
    pharmaList.innerHTML = "I could not find any pharamacies in your city!";
}
function collapseTheItem() {
  var n,
    e = document.getElementsByClassName("collapseThis");
  for (n = 0; n < e.length; n++)
    e[n].addEventListener("click", function () {
      var n = this.nextElementSibling;
      this.nextElementSibling.classList.toggle("active"),
        "block" === n.style.display
          ? (n.style.display = "none")
          : (n.style.display = "block");
    });
}
form.addEventListener("submit", async function (n) {
  n.preventDefault(), (pharmaList.innerHTML = "Loading your data... Moment");
  var e = [],
    t = [];
  fetch(
    "https://raw.githubusercontent.com/jaroslavhuss/escapellelekarny/master/lekarny-seznam.json"
  )
    .then(function (n) {
      return n.json();
    })
    .then(function (n) {
      for (var t = [], a = 0; a < n.length; a++)
        (n[a].fullText =
          n[a].MESTO + " " + n[a].ULICE + " " + n[a].NAZEV + " " + n[a].PSC),
          t.push(n[a]);
      e = t;
    })
    .then(function () {
      fetch(
        "https://raw.githubusercontent.com/jaroslavhuss/escapellelekarny/master/kod-pracoviste.json"
      )
        .then(function (n) {
          return n.json();
        })
        .then(function (n) {
          t = n;
        })
        .then(function () {
          workAllDataWell(e, t);
        });
    });
});
