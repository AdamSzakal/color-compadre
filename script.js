import nearestColor from 'nearest-color';
import namedColors from 'color-name-list';
import Chroma from 'chroma-js';

// initate variables
let hueScale,
  lightnessScale,
  startingHue,
  startingHueName,
  endingHue,
  endingHueName,
  sections = document.querySelectorAll('section');

// initiate colors to work with
const colorInit = function() {
  hueScale = Chroma.scale([Chroma.random(), Chroma.random()]).mode('lch');
  // The change in hue, going from left to right 👆
  startingHue = hueScale(0);
  endingHue = hueScale(1);
  return hueScale, startingHue, endingHue;
};

// color dom elements
const colorDOM = function(el) {

  document.querySelector('.first').innerHTML = ' 💄 ';
  document.querySelector('.last').innerHTML = ' 💅 ';

  el.forEach(function(section, index) {
    let currentColor = hueScale(index / el.length);
    const lightnessScale = Chroma.scale(['white', currentColor, 'black']).mode(
      'lch',
    );
    // The change in lightness, going vertically 👆

    section.childNodes.forEach(function(div, index) {
      let childNodeColor = Chroma(
        lightnessScale(index / section.childNodes.length),
      ).hex();

      let someColor = namedColors.colorNameList.find(
        color => color.hex === childNodeColor,
      );

			// Get color names from API
			let request = new XMLHttpRequest();
			request.open('GET', 'https://api.color.pizza/v1/' + childNodeColor.replace(/[^0-9]/, ''), true);
			request.onload = function() {
				let data = JSON.parse(this.response);
				if (request.status >= 200 && request.status < 400) {
					div.innerHTML = data.colors[0].name;
				} else {
					console.log('error');
				}
			};
			request.send();

      div.style = 'background-color: ' + childNodeColor;
    });
  });
};
colorInit();
colorDOM(sections);
