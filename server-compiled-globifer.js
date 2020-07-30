const form = document.getElementById("submitFormPharmacyFinder");
const inputField = document.getElementById("lekarnafinder");
const pharmaList = document.getElementById("pharmaLists");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  pharmaList.innerHTML = "Malý moment, hledám lékárny!";
  let allDrugStores = [];
  let openingHours = [];
  fetch(
    "https://raw.githubusercontent.com/jaroslavhuss/escapellelekarny/master/lekarny-seznam.json"
  )
    .then((response) => response.json())
    .then((data) => {
      //Loop through pharmacies and make new obj property for fulltext

      let tempArr = [];
      for (let i = 0; i < data.length; i++) {
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
      if (pharma[i].fullText.match(regExp)) {
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
      "<p>Potřebuji, abyste zadali více jak 3 písmena... Díky!</p>";
  }
}
function writeTheFinalHTML(objects) {
  console.log(objects);
  let finalString = "";
  let dayNow = new Date().getDay();
  if (objects.length > 0) {
    for (let i = 0; i < objects.length; i++) {
      let adresa = objects[i].NAZEV + " - " + objects[i].ULICE;
      let www,
        telefon,
        email,
        objednat = "";
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
          '<a target="_blank" href="mailto:' + objects[i].EMAIL + '">@</a>';
      } else {
        email = "";
      }
      console.log(adresa.match(/pilulka/gi));
      console.log(adresa);
      if (adresa.match(/pilulka/gi)) {
        //Pilulka
        objednat =
          '<a class="objednat" target="blank" href="https://www.pilulka.cz/globifer-forte-40-tablet">Přejít na E-shop!</a>';
      } else if (adresa.match(/benu/gi)) {
        objednat =
          '<a class="objednat" target="blank" href="https://www.benu.cz/globifer-forte-40-tablet">Přejít na E-shop!</a>';
      } else {
        objednat = "";
      }
      finalString += `
      <h3 class="collapseThis">${adresa}</h3>
      <div class="theData">
      <span class="main-bar">
      <a target="_blank" href="${
        "http://maps.google.com/maps?q=" + adresa
      }">Map</a> ${www} ${email} tel: ${telefon} 
      </span>
      <div class='opening-hours'>
         <table>
       <tbody>
      `;
      //A zde bude nový for lopp s hodinama
      /*
    
      */
      let hoursString = "";
      for (let x = 0; x < objects[i].openingHours.length; x++) {
        let odDobyOtevreni = "";
        let doDobyOtevreni = "";

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
        let zvyraznit = "";
        console.log(dayNow);
        console.log(x);
        if (dayNow - 1 === x) {
          zvyraznit = 'class="thisIsTheDay"';
        } else {
          zvyraznit = "";
        }
        hoursString = `
         
                <tr ${zvyraznit}>
                    <td>${objects[i].openingHours[x].DEN}</td>
                    <td>${odDobyOtevreni}</td>
                    <td>${doDobyOtevreni}</td>
                   
                </tr>
      
         `;

        finalString += hoursString;
      }
      finalString += `
         </>
         </table>
         <br />
         <br />
         ${objednat}
         <br />
         <br />
         </div>
         </div>
         `;
    }

    pharmaList.innerHTML = finalString;
    collapseTheItem();
  } else {
    pharmaList.innerHTML = "Nemohl jsem najít žádné lékárny :-( !";
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
