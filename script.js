import Chroma from "chroma-js";

// initate variables
let responseData = [];
const colors = [],
  columns = document.querySelectorAll("section"),
  containers = document.querySelectorAll(".container"),
  colorContainers = document.querySelectorAll(".color"),
  nameContainers = document.querySelectorAll(".name"),
  hexContainers = document.querySelectorAll(".hex"),
  noOfColumns = columns.length,
  noOfRows = containers.length / noOfColumns,
  reloadBtn = document.querySelector("#reload"),
  darkModeToggle = document.querySelector("#darkmodetoggle");



const colorInit = function () {
  let color1 = "";
  let color2 = "";
  let colorFunc = "";

  //check if url contains color params
  if (window.location.pathname == "/") {
    color1 = Chroma.random();
    color2 = Chroma.random();
    colorFunc = Chroma.scale([color1, color2]);
  }
  else {
    let urlColorVariables = window.location.pathname.substr(1).split("/");
    color1 = urlColorVariables[0];
    color2 = urlColorVariables[1];
    colorFunc = Chroma.scale([color1, color2]);
  };

  // after getting base colors and a scale between them, generate lightness scales for each
  for (let i = 0; i < noOfColumns; i++) {
    let columnBaseColor = colorFunc(i / noOfColumns);
    let columnLightnessScale = Chroma.scale([
      "white",
      columnBaseColor,
      "black"
    ]).mode("lch");
    let columnColors = [];
    for (let j = 0; j < noOfRows; j++) {
      columnColors.push(columnLightnessScale(j / noOfRows + 0.05).hex());
    }
    colors[i] = columnColors;
  }

  // if pathname is empty, update url with it
  if (window.location.pathname == "/") {
    let urlSafeColor1 = color1.toString().substr(1);
    let urlSafeColor2 = color2.toString().substr(1);
    // window.history.replaceState("", "", "https://color-compadre.netlify.com/" + urlSafeColor1 + "/" + urlSafeColor2);
    window.location.pathname = urlSafeColor1 + "/" + urlSafeColor2
  }
}


const getColorNames = function () {
  let flatColors = colors.join(",");
  let reqCol = flatColors.replace(/#/g, "");

  let request = new XMLHttpRequest();
  request.open("GET", "https://api.color.pizza/v1/" + reqCol, true);
  request.onload = function () {
    responseData = JSON.parse(this.response).colors;
    if (request.status >= 200 && request.status < 400) {
      responseData.forEach(function (currentValue, index) {
        nameContainers[index].innerHTML = currentValue.name;
      });
    } else {
      console.log(error);
    }
  };
  request.send();
};

const colorDOM = function () {
  let counter = 0;
  for (let i = 0; i < colors.length; i++) {
    for (let j = 0; j < colors[i].length; j++) {
      colorContainers[counter].style.backgroundColor = colors[j][i];
      hexContainers[counter].innerHTML = colors[j][i];
      counter++;
    }
  }
};

const init = function () {
  document.addEventListener("DOMContentLoaded", function () {
    colorInit();
    getColorNames();
    colorDOM();
  });
};

darkModeToggle.addEventListener("click", function (e) {
  if (darkModeToggle.checked == true) {
    document.querySelector("html").classList.toggle("dark");
  } else {
    document.querySelector("html").classList.toggle("dark");
  }
});

reloadBtn.addEventListener("click", function (e) {
  window.location.pathname = "";
  colorInit();
  getColorNames();
  colorDOM();
});

const copyColor = function () {
  for (let i = 0; i < hexContainers.length; i++) {
    let hexContainer = hexContainers[i];
    hexContainer.addEventListener("click", function (e) {
      let hexCode = e.target.innerHTML;
      navigator.clipboard.writeText(hexCode).then(
        function () {
          e.target.innerHTML = "Copied!";
          setTimeout(function () {
            e.target.innerHTML = hexCode;
          }, 1000);
        },
        function () {
          console.log("sry bro");
        }
      );
    });
  }
};
copyColor();

init();
