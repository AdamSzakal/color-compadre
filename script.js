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
    sections = document.querySelectorAll('section'),
    divs = document.querySelectorAll('div'),
    swatches = document.querySelectorAll('.swatch'),
    colorNames = document.querySelectorAll('.color-name'),
    colorHexes = document.querySelectorAll('color-hex');
// ⚠️ Jag tänker här att man borde samla all data först, innan man börjar loopa igenom det. Frågan är bara hur man får en array för varje kolumn (section) så att man fortfarande får till ljushetsskiftningen

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

    el.forEach(function(section, index) {
        // generate a "base color" 👇
        let currentColor = hueScale(index / el.length);
        // generate an array of colors going from white to black, via the "base color" 👇
        const lightnessScale = Chroma.scale(['white', currentColor, 'black']).mode(
            'lch',
        );

        // loop through all nodes for each section 👇
        section.childNodes.forEach(function(div, index) {

            let childNodeColor = Chroma(
                lightnessScale(index / section.childNodes.length)
            ).hex();

            let someColor = namedColors.colorNameList.find(
                color => color.hex === childNodeColor
            );

            // Get color names from API
            let request = new XMLHttpRequest();
            request.open('GET', 'https://api.color.pizza/v1/' + childNodeColor.replace(/[^0-9]/, ''), true);
            request.onload = function() {
                let data = JSON.parse(this.response);
                if (request.status >= 200 && request.status < 400) {
                    div.innerHTML = "<p>" + data.colors[0].name + "</p>"
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