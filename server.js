const form = document.getElementById("submitFormPharmacyFinder");
const inputField = document.getElementById("lekarnafinder");
const pharmaList = document.getElementById("pharmaLists");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  pharmaList.innerHTML = "Loading your data... Moment";
  let allDrugStores = [];
  let openingHours = [];
  fetch(
    "https://raw.githubusercontent.com/jaroslavhuss/escapellelekarny/master/lekarny-seznam.json"
  )
    .then((response) => response.json())
    .then((data) => {
      allDrugStores = data;
    })
    .then(() => {
      fetch(
        "https://raw.githubusercontent.com/jaroslavhuss/escapellelekarny/master/kod-pracoviste.json"
      )
        .then((response) => response.json())
        .then((data) => {
          openingHours = data;
        })
        .then(() => {
          workAllDataWell(allDrugStores, openingHours);
        });
    });
});
function workAllDataWell(pharma, hours) {
  if (inputField.value.length > 3) {
    let finalArrayOfObjects = []; //Tenhle objekt předám
    let regExp = new RegExp(inputField.value, "i");
    for (let i = 0; i < pharma.length; i++) {
      if (pharma[i].MESTO.match(regExp)) {
        pharma[i].openingHours = [];
        finalArrayOfObjects.push(pharma[i]);
        for (let x = 0; x < hours.length; x++) {
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
  let finalString = "";
  if (objects.length > 0) {
    for (let i = 0; i < objects.length; i++) {
      let adresa = objects[i].NAZEV + " " + objects[i].ULICE;
      let www,
        telefon,
        email = "";
      //WWW
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
          '<a target="_blank" href="mailto:' + objects[i].EMAIL + '">mail</a>';
      } else {
        email = "";
      }
      finalString += `
      <h3>${adresa}</h3>
      <a target="_blank" href="${
        "http://maps.google.com/maps?q=" + adresa
      }">Map</a> ${www} ${telefon} ${email}

      `;
      //Email
    }
    pharmaList.innerHTML = finalString;
  } else {
    pharmaList.innerHTML = "I could not find any pharamacies in your city!";
  }
}
