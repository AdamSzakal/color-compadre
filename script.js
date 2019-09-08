import nearestColor from 'nearest-color';
import namedColors from 'color-name-list';
import Chroma from 'chroma-js';

// initate variables
let hueScale,
    startingHue,
    endingHue,
    selectedColors = [];

const sections = document.querySelectorAll('section'),
    divs = document.querySelectorAll('div');

// ⚠️ Jag tänker här att man borde samla all data först, innan man börjar loopa igenom det. Frågan är bara hur man får en array för varje kolumn (section) så att man fortfarande får till ljushetsskiftningen

// initiate colors to work with
const colorInit = function () {
    hueScale = Chroma.scale([Chroma.random(), Chroma.random()]).mode('lch');
    // The change in hue, going from left to right 👆
    startingHue = hueScale(0);
    endingHue = hueScale(1);
    return hueScale, startingHue, endingHue;
};

// color dom elements
const colorDOM = function (el) {

    el.forEach(function (section, index) {
        // generate a "base color" 👇
        let currentColor = hueScale(index / el.length);
        // generate an array of colors going from white to black, via the "base color" 👇
        const lightnessScale = Chroma.scale(['white', currentColor, 'black']).mode(
            'lch',
        );

        // loop through all nodes for each section 👇
        section.childNodes.forEach(function (div, index) {

            let childNodeColor = Chroma(
                lightnessScale(index / section.childNodes.length)
            ).hex();

            let someColor = namedColors.colorNameList.find(
                color => color.hex === childNodeColor
            );

            // Get color names from API
            let request = new XMLHttpRequest();
            request.open('GET', 'https://api.color.pizza/v1/' + childNodeColor.replace(/[^0-9]/, ''), true);
            request.onload = function () {
                let data = JSON.parse(this.response);
                if (request.status >= 200 && request.status < 400) {
                    div.innerText = data.colors[0].name;
                    div.style.backgroundColor = childNodeColor;
                } else {
                    console.log('error');
                }
            };
            request.send();
        });
    });
};


document.addEventListener("DOMContentLoaded", function () {
    colorInit();
    colorDOM(sections);

    //interaction with UI


    // the function to be run on click
    const selectColor = function (e) {
        console.log("color selected");
        e.target.classList.toggle("selected");
        addToSelectedColors(e);
    }

    // highlight selected color and add to array
    const addToSelectedColors = function (e) {
        console.log("added");
        selectedColors.push(e.target);
        // get the markup for each of the DOM elements in the selectedColors array
        document.querySelector("#selected-colors").innerHTML = selectedColors.map(target => target.outerHTML).join(" ");
    }

    // Clear selection, both visually and data-wise
    const clear = function () {
        console.log("cleared");
        selectedColors.map(target => target.classList.remove("selected"));
        document.querySelector("#selected-colors").innerHTML = "No selected colors";
        selectedColors = [];
    }

    // clear selected colors, initate new colors and color dom again
    const reload = function () {
        clear;
        colorInit();
        colorDOM(sections);
    }

    //add event listener to all divs 
    divs.forEach(function (div) {
        div.addEventListener('click', selectColor);
    });

    // add event listener to buttons
    const copyButton = document.querySelector("#copy"),
        reloadButton = document.querySelector("#reload"),
        clearButton = document.querySelector("#clear");

    copyButton.addEventListener('click', copy);
    reloadButton.addEventListener('click', reload);
    clearButton.addEventListener('click', clear);


});