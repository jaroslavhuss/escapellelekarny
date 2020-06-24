"use strict";

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }
  if (info.done) {
    resolve(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}

function _asyncToGenerator(fn) {
  return function () {
    var self = this,
      args = arguments;
    return new Promise(function (resolve, reject) {
      var gen = fn.apply(self, args);
      function _next(value) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
      }
      function _throw(err) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
      }
      _next(undefined);
    });
  };
}

var form = document.getElementById("submitFormPharmacyFinder");
var inputField = document.getElementById("lekarnafinder");
var pharmaList = document.getElementById("pharmaLists");
form.addEventListener(
  "submit",
  /*#__PURE__*/ (function () {
    var _ref = _asyncToGenerator(
      /*#__PURE__*/ regeneratorRuntime.mark(function _callee(e) {
        var allDrugStores, openingHours;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch ((_context.prev = _context.next)) {
              case 0:
                e.preventDefault();
                pharmaList.innerHTML = "Loading your data... Moment";
                allDrugStores = [];
                openingHours = [];
                fetch(
                  "https://raw.githubusercontent.com/jaroslavhuss/escapellelekarny/master/lekarny-seznam.json"
                )
                  .then(function (response) {
                    return response.json();
                  })
                  .then(function (data) {
                    //Loop through pharmacies and make new obj property for fulltext
                    var tempArr = [];

                    for (var i = 0; i < data.length; i++) {
                      data[i].fullText =
                        data[i].MESTO +
                        " " +
                        data[i].ULICE +
                        " " +
                        data[i].NAZEV +
                        " " +
                        data[i].PSC;
                      tempArr.push(data[i]);
                    }

                    allDrugStores = tempArr;
                  })
                  .then(function () {
                    fetch(
                      "https://raw.githubusercontent.com/jaroslavhuss/escapellelekarny/master/kod-pracoviste.json"
                    )
                      .then(function (response) {
                        return response.json();
                      })
                      .then(function (data) {
                        openingHours = data;
                      })
                      .then(function () {
                        workAllDataWell(allDrugStores, openingHours);
                      });
                  });

              case 5:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      })
    );

    return function (_x) {
      return _ref.apply(this, arguments);
    };
  })()
);

function workAllDataWell(pharma, hours) {
  if (inputField.value.length > 3) {
    var finalArrayOfObjects = []; //Tenhle objekt předám

    var regExp = new RegExp(inputField.value, "i");

    for (var i = 0; i < pharma.length; i++) {
      if (pharma[i].fullText.match(regExp)) {
        pharma[i].openingHours = [];
        finalArrayOfObjects.push(pharma[i]);

        for (var x = 0; x < hours.length; x++) {
          if (pharma[i].KOD_PRACOVISTE === hours[x].KOD_PRACOVISTE) {
            pharma[i].openingHours.push(hours[x]);
          }
        }
      }
    }

    writeTheFinalHTML(finalArrayOfObjects);
  } else {
    pharmaList.innerHTML =
      "<p>I need you to be more specific! Put more than 3 characters!</p>";
  }
}

function writeTheFinalHTML(objects) {
  console.log(objects);
  var finalString = "";
  var dayNow = new Date().getDay();

  if (objects.length > 0) {
    for (var i = 0; i < objects.length; i++) {
      var adresa = objects[i].NAZEV + " - " + objects[i].ULICE;
      var www = void 0,
        telefon = void 0,
        email = void 0,
        objednat = ""; //WWW

      if (objects[i].WWW) {
        www = '<a target="_blank" href="' + objects[i].WWW + '">www</a>';
      } else {
        www = "";
      }

      if (objects[i].TELEFON) {
        telefon = objects[i].TELEFON;
      } else {
        telefon = "";
      }

      if (objects[i].EMAIL) {
        email =
          '<a target="_blank" href="mailto:' + objects[i].EMAIL + '">@</a>';
      } else {
        email = "";
      }

      console.log(adresa.match(/pilulka/gi));
      console.log(adresa);

      if (adresa.match(/pilulka/gi)) {
        //Pilulka
        objednat =
          '<a class="objednat" target="blank" href="https://www.pilulka.cz/escapelle-por-tbl-nob-1x1-5mg">Go to E-shop now!</a>';
      } else if (adresa.match(/benu/gi)) {
        objednat =
          '<a class="objednat" target="blank" href="https://www.benu.cz/escapelle-peroralni-neobalene-tablety-1x1-5mg">Go to E-shop now!</a>';
      } else {
        objednat = "";
      }

      finalString += '\n      <h3 class="collapseThis">'
        .concat(
          adresa,
          '</h3>\n      <div class="theData">\n      <span class="main-bar">\n      <a target="_blank" href="'
        )
        .concat("http://maps.google.com/maps?q=" + adresa, '">Map</a> ')
        .concat(www, " ")
        .concat(email, " tel: ")
        .concat(
          telefon,
          " \n      </span>\n      <div class='opening-hours'>\n         <table>\n       <tbody>\n      "
        ); //A zde bude nový for lopp s hodinama

      /*
       */

      var hoursString = "";

      for (var x = 0; x < objects[i].openingHours.length; x++) {
        var odDobyOtevreni = "";
        var doDobyOtevreni = "";

        if (objects[i].openingHours[x].OD.length > 0) {
          odDobyOtevreni = objects[i].openingHours[x].OD;
        } else {
          odDobyOtevreni = "closed";
        }

        if (objects[i].openingHours[x].DO.length > 0) {
          doDobyOtevreni = objects[i].openingHours[x].DO;
        } else {
          doDobyOtevreni = "closed";
        }

        var zvyraznit = "";
        console.log(dayNow);
        console.log(x);

        if (dayNow - 1 === x) {
          zvyraznit = 'class="thisIsTheDay"';
        } else {
          zvyraznit = "";
        }

        hoursString = "\n         \n                <tr "
          .concat(zvyraznit, ">\n                    <td>")
          .concat(
            objects[i].openingHours[x].DEN,
            "</td>\n                    <td>"
          )
          .concat(odDobyOtevreni, "</td>\n                    <td>")
          .concat(
            doDobyOtevreni,
            "</td>\n                   \n                </tr>\n      \n         "
          );
        finalString += hoursString;
      }

      finalString += "\n         </>\n         </table>\n         <br />\n         <br />\n         ".concat(
        objednat,
        "\n         <br />\n         <br />\n         </div>\n         </div>\n         "
      );
    }

    pharmaList.innerHTML = finalString;
    collapseTheItem();
  } else {
    pharmaList.innerHTML = "I could not find any pharamacies in your city!";
  }
}

function collapseTheItem() {
  var coll = document.getElementsByClassName("collapseThis");
  var i;

  for (i = 0; i < coll.length; i++) {
    coll[i].addEventListener("click", function () {
      var content = this.nextElementSibling;
      this.nextElementSibling.classList.toggle("active");

      if (content.style.display === "block") {
        content.style.display = "none";
      } else {
        content.style.display = "block";
      }
    });
  }
}
