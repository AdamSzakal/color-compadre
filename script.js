import Chroma from 'chroma-js';

// initate variables
let selectedColors = [],
    responseData = [];
const colors = [],
    colorNames = [],
    columns = document.querySelectorAll('section'),
    containers = document.querySelectorAll('.container'),
    colorContainers = document.querySelectorAll('.color'),
    nameContainers = document.querySelectorAll('.name'),
    hexContainers = document.querySelectorAll('.hex'),
    noOfColumns = columns.length,
    noOfRows = containers.length / noOfColumns;


// initiate colors to work with
const colorInit = function () {

    const colorFunc = Chroma.scale([Chroma.random(), Chroma.random()]).mode('lch');
    // The function to generate the random color scale

    let startingColor = colorFunc(0);
    let endingColor = colorFunc(1);

    const getColors = function () {

        //get base hue for each column, then generate the color scale to black/white for each
        for (let i = 0; i < noOfColumns; i++) {
            let columnBaseColor = colorFunc(i / noOfColumns);
            let columnLightnessScale = Chroma.scale(['white', columnBaseColor, 'black']).mode('lch')
            let columnColors = [];
            for (let j = 0; j < noOfRows; j++) {
                columnColors.push(columnLightnessScale(j / noOfRows + 0.05).hex());
            }
            colors[i] = columnColors;
        }
    }

    getColors();
};


const getColorNames = function () {

    // Get color names from API

    let flatColors = colors.join(",");
    console.log(flatColors)
    let reqCol = flatColors.replace(/#/g, '');

    let request = new XMLHttpRequest();
    request.open('GET', 'https://api.color.pizza/v1/' + reqCol, true);
    request.onload = function () {
        responseData = JSON.parse(this.response).colors;
        console.log(responseData);
        if (request.status >= 200 && request.status < 400) {} else {
            console.log('error');
        }
    };
    request.send();

}


// use colors on DOM
const colorDOM = function () {
    let counter = 0;
    for (let i = 0; i < colors.length; i++) {
        for (let j = 0; j < colors[i].length; j++) {
            colorContainers[counter].style.backgroundColor = colors[i][j];
            counter++;
        }
    }
}

document.addEventListener("DOMContentLoaded", function () {
    colorInit();
    getColorNames();
    colorDOM();
});