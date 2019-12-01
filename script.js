import Chroma from 'chroma-js';

// initate variables
let responseData = [];
const colors = [],
  columns = document.querySelectorAll('section'),
  containers = document.querySelectorAll('.container'),
  colorContainers = document.querySelectorAll('.color'),
  nameContainers = document.querySelectorAll('.name'),
  hexContainers = document.querySelectorAll('.hex'),
  noOfColumns = columns.length,
  noOfRows = containers.length / noOfColumns,
  reloadBtn = document.querySelector('#reload'),
  darkModeToggle = document.querySelector('#darkmodetoggle'),
  copyBtn = document.querySelector('#copy');

// initiate colors to work with
const colorInit = function () {
  const colorFunc = Chroma.scale([Chroma.random(), Chroma.random()]).mode(
    'lch',
  );
  // The function to generate the random color scale

  let startingColor = colorFunc(0);
  let endingColor = colorFunc(1);

  const getColors = function () {
    //get base hue for each column, then generate the color scale to black/white for each
    for (let i = 0; i < noOfColumns; i++) {
      let columnBaseColor = colorFunc(i / noOfColumns);
      let columnLightnessScale = Chroma.scale([
        'white',
        columnBaseColor,
        'black',
      ]).mode('lch');
      let columnColors = [];
      for (let j = 0; j < noOfRows; j++) {
        columnColors.push(columnLightnessScale(j / noOfRows + 0.05).hex());
      }
      colors[i] = columnColors;
    }
  };

  getColors();
};

const getColorNames = function () {
  // Get color names from API

  let flatColors = colors.join(',');
  let reqCol = flatColors.replace(/#/g, '');

  let request = new XMLHttpRequest();
  request.open('GET', 'https://api.color.pizza/v1/' + reqCol, true);
  request.onload = function () {
    responseData = JSON.parse(this.response).colors;
    if (request.status >= 200 && request.status < 400) {
      responseData.forEach(function (currentValue, index) {
        nameContainers[index].innerHTML = currentValue.name;
        hexContainers[index].innerHTML = currentValue.requestedHex;
      });
    } else {
      console.log(error);
    }
  };
  request.send();
};

// use colors on DOM
const colorDOM = function () {
  let counter = 0;
  for (let i = 0; i < colors.length; i++) {
    for (let j = 0; j < colors[i].length; j++) {
      colorContainers[counter].style.backgroundColor = colors[j][i];
      counter++;
    }
  }
};

// initate app
const init = function () {
  document.addEventListener('DOMContentLoaded', function () {
    colorInit();
    getColorNames();
    colorDOM();
  });
};

// make button behaviour and stuff
const toggleDarkMode = (function () {
  darkModeToggle.addEventListener('click', function (e) {
    if (darkModeToggle.checked == true) {
      document.querySelector('html').classList.toggle('dark');
    } else {
      document.querySelector('html').classList.toggle('dark');
    }
  });
})();

reloadBtn.addEventListener('click', function (e) {
  // init();
  colorInit();
  getColorNames();
  colorDOM();
});

const copyColor = function () {
  for (let i = 0; i < hexContainers.length; i++) {
    let hexContainer = hexContainers[i];
    hexContainer.addEventListener('click', function (e) {
      let hexCode = e.target.innerHTML;
      navigator.clipboard.writeText(hexCode).then(
        function () {
          e.target.innerHTML = 'Copied!';
          setTimeout(function () {
            e.target.innerHTML = hexCode;
          }, 1000);
        },
        function () {
          console.log('sry bro');
        },
      );
    });
  }
};
copyColor();

init();
