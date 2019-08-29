import nearestColor from 'nearest-color';
import namedColors from 'color-name-list';
import Chroma from 'chroma-js';

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
const colors = namedColors.colorNameList.reduce(
  (o, {name, hex}) => Object.assign(o, {[name]: hex}),
  {},
);
const nearest = nearestColor.from(colors); // do some stuff to prepare colorNameList entries to be used with nearestColor
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
      console.log(childNodeColor);
      // console.log(nearest(childNodeColor));
      div.innerHTML = nearest(childNodeColor).name;
      div.style = 'background-color: ' + childNodeColor;
    });
  });
};
colorInit();
colorDOM(sections);
