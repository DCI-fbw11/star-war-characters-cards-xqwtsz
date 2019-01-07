"use strict";
var fetchedData;
const DOMContainer = document.getElementById("cardContainer");
let buttonNext = document.getElementById("buttonNext");
let buttonPrev = document.getElementById("buttonPrev");
let localArray = [];
let initialURL = "https://swapi.co/api/people/";
let nextURL = "";
let prevURL = "";

async function getData(url) {
  const raw = await fetch(url);
  fetchedData = await raw.json();

  nextURL = fetchedData.next;
  prevURL = fetchedData.previous;
  console.log(nextURL);

  const peopleArray = fetchedData.results;

  await generateLocalArray(peopleArray);
  generateCards(localArray, DOMContainer);
  nextURL
    ? (buttonNext.style.display = "flex")
    : console.log("next is not here");
  prevURL
    ? (buttonPrev.style.display = "flex")
    : console.log("prev is not here");
}

async function findHomeWorld(url) {
  const raw = await fetch(url);
  const homeWorld = await raw.json();
  return homeWorld.name;
}

async function generateLocalArray(peopleArray) {
  for (let character of peopleArray) {
    let tempObj = {
      name: character.name,
      birthday: character.birth_year,
      gender: character.gender,
      homeWorld: await findHomeWorld(character.homeworld)
    };
    localArray.push(tempObj);
  }
}

function generateCards(array, container) {
  for (let item of array) {
    let div = document.createElement("div");
    div.className = "card";
    let horizontalLine = document.createElement("hr");
    horizontalLine.className = "horizontalLine";
    let name = document.createElement("h1");
    name.className = "cardName";
    let gender = document.createElement("h2");
    gender.className = "cardAttr";
    let birthday = document.createElement("h2");
    birthday.className = "cardAttr";
    let homeWorld = document.createElement("h2");
    homeWorld.className = "cardAttr";
    name.innerHTML = item.name;
    gender.innerHTML = `Gender: ${item.gender}`;
    birthday.innerHTML = `Birthday: ${item.birthday}`;
    homeWorld.innerHTML = `Homeworld: ${item.homeWorld}`;
    div.appendChild(name);
    div.appendChild(horizontalLine);
    div.appendChild(birthday);
    div.appendChild(gender);
    div.appendChild(homeWorld);
    container.appendChild(div);
  }
}

getData(initialURL);

function clearDOMContainer() {
  while (DOMContainer.firstChild) {
    DOMContainer.removeChild(DOMContainer.firstChild);
  }
  localArray = [];
  buttonNext.style.display = "none";
  buttonPrev.style.display = "none";
}

function loadNextPage() {
  clearDOMContainer();
  getData(nextURL);
}

function loadPrevPage() {
  clearDOMContainer();
  getData(prevURL);
}
