
//take books in cart from local storage
var books = new Map(JSON.parse(localStorage.books));
var table = document.getElementById("tableOrder");
var selectCities = document.getElementById("citySelect");
var selectOffices = document.getElementById("officeSelect");
//get diliverer JSON
var citiesAndOffices;


function getOffices() {
  var xhttp = new XMLHttpRequest();
  xhttp.addEventListener("load", function () {
      citiesAndOffices = JSON.parse(xhttp.responseText);
      console.log(citiesAndOffices);
  });
  
  //false means we send a Synchronous request, so that we are sure we have the needed data before we try to work with it
  xhttp.open("GET", "../JSON-Files/delivererOffices.json", false); 
  xhttp.send();
}
getOffices();

function addCities(deliverer){
    
    //console.log(citiesAndOffices["Speedy"]["cities"]);
    for (const [key, value] of Object.entries(citiesAndOffices[deliverer]["cities"])) {
      //addOffices(deliverer, value.name)
      let option = document.createElement("option");
      option.text = value.name;
      selectCities.add(option);
    }
}

function clearSelectCities(){
  var length = selectCities.options.length;
  for (i = length-1; i > 0; i--) {
    selectCities.options[i] = null;
  }
}
function clearSelectOffices(){
  var length = selectOffices.options.length;
  for (i = length-1; i > 0; i--) {
    selectOffices.options[i] = null;
  }
}

function addOffices(deliverer, city){
  //console.log(citiesAndOffices[deliverer]["cities"][city]["offices"].length)
  citiesAndOffices[deliverer]["cities"][city]["offices"].forEach(element => {
    let option = document.createElement("option");
    option.text = element.address;
    selectOffices.add(option);
  });
}

selectCities.addEventListener("change",function (){
  clearSelectOffices();
  let selectedCity = selectCities.value;
  let deliverer = "";
  if (document.getElementById("speedyRadio").checked == true) deliverer = "Speedy";
  else deliverer = "Econt";
  addOffices(deliverer, selectedCity);
})


function renderBooks() {
  var sumTotal = 0;
  for (const [key, value] of books.entries()) {

    let genre = key.substring(0, key.length - 1);
    let bookRef = db.collection('Books').doc(genre).collection('Titles').doc(key);
    bookRef.get().then(doc => {
      let tr = document.createElement("tr");
      table.appendChild(tr);
      let linkToBook = document.createElement("a");
      let tdName = document.createElement("td");
      let tdCount = document.createElement("td");
      let tdPrice = document.createElement("td");

      linkToBook.setAttribute("href", "./" + transliterate(doc.data().name) + ".html");

      //tdName.innerHTML = doc.data().name;
      linkToBook.innerHTML = doc.data().name;
      tdCount.innerHTML = value;
      tdPrice.innerHTML = doc.data().priceStr;


      //tr.appendChild(linkToBook);
      tr.appendChild(tdName);
      tr.appendChild(tdCount);
      tr.appendChild(tdPrice);

      tdName.appendChild(linkToBook);
      sumTotal += value * doc.data().price;
      document.getElementById("totalPrice").innerHTML = "Цена общо: " + sumTotal.toFixed(2).toString() + " лв.";
    });
  }
}
renderBooks();

function transliterate(text) {

  text = text
    .replace(/а/gi, 'a')
    .replace(/б/gi, 'b')
    .replace(/в/gi, 'v')
    .replace(/г/gi, 'g')
    .replace(/д/gi, 'd')
    .replace(/е/gi, 'e')
    .replace(/ж/gi, 'zh')
    .replace(/з/gi, 'z')
    .replace(/и/gi, 'i')
    .replace(/й/gi, 'y')
    .replace(/ѝ/gi, 'i')
    .replace(/к/gi, 'k')
    .replace(/л/gi, 'l')
    .replace(/м/gi, 'm')
    .replace(/н/gi, 'n')
    .replace(/о/gi, 'o')
    .replace(/п/gi, 'p')
    .replace(/р/gi, 'r')
    .replace(/с/gi, 's')
    .replace(/т/gi, 't')
    .replace(/у/gi, 'u')
    .replace(/ф/gi, 'f')
    .replace(/х/gi, 'h')
    .replace(/ц/gi, 'ts')
    .replace(/ч/gi, 'ch')
    .replace(/ш/gi, 'sh')
    .replace(/щ/gi, 'sht')
    .replace(/ъ/gi, 'a')
    .replace(/ь/gi, 'y')
    .replace(/ю/gi, 'yu')
    .replace(/я/gi, 'ya')

    .replace(/\u0020/gi, '-')
    .replace(',', '')
    .replace('.', '')

    .replace(/"/gi, '')
    .replace(':', '')

  return text;
};

/*let tr = document.createElement("tr");
table.appendChild(tr);
let td = document.createElement("td");
tr.appendChild(td);
td.innerHTML = "";*/

//by default Speedy is checked
if (document.getElementById("speedyRadio").checked == true) {
  clearSelectCities()
  addCities("Speedy");
  document.getElementById("officeSpeedyRadioID").checked = true;
  document.getElementById("officeSpeedyID").style.display = "flex";
  document.getElementById("officeEcontID").style.display = "none";
}

if (document.getElementById("econtRadio").checked == true) {
  clearSelectCities()
  addCities("Econt");
  document.getElementById("officeEcontRadioID").checked = true;
  document.getElementById("officeSpeedyID").style.display = "none";
  document.getElementById("officeEcontID").style.display = "flex";
}


//check uncheck Speedy of Econt
document.getElementById("speedyRadio").addEventListener("change", function () {
  if (document.getElementById("speedyRadio").checked == true) {
    clearSelectCities()
    addCities("Speedy");
    document.getElementById("officeSpeedyID").style.display = "flex";
    document.getElementById("officeEcontID").style.display = "none";
    if (document.getElementById("deliveryToAddressRadio").checked == false) {
      document.getElementById("officeSpeedyRadioID").checked = true;
    }
  }
})
document.getElementById("econtRadio").addEventListener("change", function () {
  if (document.getElementById("econtRadio").checked == true) {
    clearSelectCities()
    addCities("Econt");
    document.getElementById("officeEcontID").style.display = "flex";
    document.getElementById("officeSpeedyID").style.display = "none";

    if (document.getElementById("deliveryToAddressRadio").checked == false) {
      document.getElementById("officeEcontRadioID").checked = true;
    }
  }
})


//check Office or Address
document.getElementById("officeSpeedyRadioID").addEventListener("change", function () {

  if (document.getElementById("officeSpeedyRadioID").checked == true) {
    document.getElementById("deliveryToOffice").style.display = "flex";
    document.getElementById("deliveryToAddress").style.display = "none";
  }
})

document.getElementById("officeEcontRadioID").addEventListener("change", function () {

  if (document.getElementById("officeEcontRadioID").checked == true) {
    document.getElementById("deliveryToOffice").style.display = "flex";
    document.getElementById("deliveryToAddress").style.display = "none";
  }
})
document.getElementById("deliveryToAddressRadio").addEventListener("change", function () {

  if (document.getElementById("deliveryToAddressRadio").checked == true) {
    document.getElementById("deliveryToOffice").style.display = "none";
    document.getElementById("deliveryToAddress").style.display = "flex";
  }
})


function validateInput() {
  let name = document.getElementById("fname").value;
  let surname = document.getElementById("lname").value;
  let email = document.getElementById("emailCustomer").value;
  let phone = document.getElementById("phoneCustomer").value;
  let correct = true;

  //name
  if (name.length == 0) {
    alert("Въведете име.");
    return false;
  }
  for (let i = 0; i < name.length; i++) {
    if (!((name[i] >= 'А' && name[i] <= 'Я') || (name[i] >= 'а' && name[i] <= 'я'))) {
      alert("Името трябва да съдържа символите от а до я и от А до Я.");
      return false;
    }
  }

  //surname
  if (surname.length == 0) { alert("Въведете фамилия."); return false; }
  for (let i = 0; i < surname.length; i++) {
    if (!((surname[i] >= 'А' && surname[i] <= 'Я') || (surname[i] >= 'а' && surname[i] <= 'я'))) {
      alert("Фамилията трябва да съдържа символите от а до я и от А до Я.");
      return false;
    }
  }


  //email
  let indA = email.indexOf('@');
  if (indA > 0) { //we want to have some characters before @
    let afterA = email.substring(indA + 1, email.length);
    
    if (afterA.indexOf('.') == -1 || afterA.indexOf('.') == afterA.length - 1) {
      alert("Невалиден имейл адрес.");
      return false;
    }
  }
  else {
    alert("Невалиден имейл адрес.");
    return false;
  }


  //phone
  let indexPlus = phone.indexOf('+');
  if (indexPlus == 0) {
    if (phone.length != 13) {
      alert("Невалиден телефонен номер.");
      return false;
    }
    else {
      for (let i = 1; i < phone.length; i++) {
        if (!(phone[i] >= '0' && phone[i] <= '9')) {
          alert("Невалиден телефонен номер.");
          return false;
        }
      }
    }
  }
  else if (indexPlus < 0) {
    if (phone.length != 10) {
      alert("Невалиден телефонен номер.");
      return false;
    }
    else {
      for (let i = 0; i < phone.length; i++) {
        if (!(phone[i] >= '0' && phone[i] <= '9')) {
          alert("Невалиден телефонен номер.");
          return false;
        }
      }
    }
  }
  else {
    alert("Невалиден телефонен номер.");
    return false;
  }
  return true;
}

document.getElementById("submitButton").addEventListener("click", function () {
  console.log(validateInput());
})


//HTTP request for cities and offices
/*function reqListener () {
  console.log(14);
  console.log(this.responseText);
}

var oReq = new XMLHttpRequest();
oReq.addEventListener("load", reqListener);
oReq.open("GET", "./JSON-Files/delivererOffices.json");
oReq.send();*/



