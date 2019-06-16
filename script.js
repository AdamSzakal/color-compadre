let hueScale,
  lightnessScale,
  startingHue,
  startingHueName,
  endingHue,
  endingHueName,
  sections = document.querySelectorAll('section');

// initiate colors to work with
const colorInit = function() {
  hueScale = chroma.scale([chroma.random(), chroma.random()]);
  // The change in hue, going from left to right 👆
  startingHue = hueScale(0);
  endingHue = hueScale(1);
  return hueScale, startingHue, endingHue;
}; // colorNameList.find(color => color.hex === colorCode.toString(); // apply colors to DOM element
const colorDOM = function(el) {
  document.querySelector('.first').innerHTML = startingHue + ' 👉 ';
  document.querySelector('.last').innerHTML = ' 👈 ' + endingHue;
  el.forEach(function(section, index) {
    let currentColor = hueScale(index / el.length);
    const lightnessScale = chroma.scale(['white', currentColor, 'black']);
    // The change in lightness, going vertically 👆
    section.childNodes.forEach(function(div, index) {
      div.style =
        'background-color: ' +
        lightnessScale(index / section.childNodes.length);
    });
  });
}; // make a request to colorpizza-API to get the closest color name
const getColorName = function(color) {
  return fetch('https://api.color.pizza/v1/' + color)
    .then(response => response.json())
    .then(data => data.colors[0].name);
};
colorInit();
colorDOM(sections);
