import * as d3 from 'd3';

const facebookBlue = '#0066CC';
const twitterBlue = '#0099FF';
const scaleValue = 10;
const cityDotRadius = 2;

let svgElt = null;
let mapNode = null;
let dataNode = null;
let viewboxWidth = null;
let viewboxHeight = null;

let cities = {
  paris : [100, 75],
  creteil : [250, 300],
  toulouse : [300, 100],
  nanterre : [300, 100],
  lyon : [300, 100],
  lille : [300, 100],
  troyes : [300, 100],
  saintetienne : [300, 100],
  pau : [300, 100],
  caen : [300, 100],
  toulon : [300, 100],
  ajaccio : [300, 100],
  chaumont : [300, 100]
}


let data = [
  {
    name : 'Test 1',
    twitter : 1017,
    facebook : 674,
    city : 'paris'
  },
  {
    name : 'Test 2',
    twitter : 178,
    facebook : 108,
    city : 'creteil'
  },
  {
    name : 'Test 2',
    twitter : 324,
    facebook : 118,
    city : 'toulouse'
  },
];

getMap(() => {
  displayData();
  // set projection
  var projection = d3.geoMercator();

  // create path variable
  var path = d3.geoPath()
    .projection(projection);
});

function getMap (callback) {
  module.exports = d3.xml("/build/img/france.svg", (error, xml) => {
    if (error) throw error;

    let htmlSvg = document.getElementById('map');
    htmlSvg.appendChild(xml.documentElement.getElementsByTagName('defs')[0]);
    htmlSvg.appendChild(xml.documentElement.getElementById('map'));

    svgElt = d3.select(htmlSvg);
    mapNode = svgElt.select('#map');
    dataNode = svgElt.select('#data');

    let viewbox = d3.select(xml.getElementsByTagName('svg')[0]).attr('viewBox');
    let viewboxArray = viewbox.split(" ");
    viewboxWidth = viewboxArray[2];
    viewboxHeight = viewboxArray[3];
    svgElt.attr('viewBox', viewbox);

    if (callback) callback();
  });
}

function displayData () {

  let max = d3.max(data, (d) => d.facebook > d.twitter ? d.facebook : d.twitter);

  let scale = d3.scaleLinear()
      .domain([0, max])
      .range([0, viewboxWidth / scaleValue]);

  let gs = dataNode.selectAll('circle')
      .data(data)
    .enter()
      .append('g').each(function (d, i) {
        let node = d3.select(this);
        let scaledTwitter = scale(d.twitter);
        let scaledFacebook = scale(d.facebook);

        let x = cities[d.city][0];
        let y = cities[d.city][1];

        appendBubble(node, x, y - scaledTwitter, scaledTwitter, twitterBlue);
        appendBubble(node, x, y - scaledFacebook, scaledFacebook, facebookBlue);
        appendBubble(node, x, y, cityDotRadius, '#000');
      });
}

function appendBubble (node, x, y, r, color) {
  node.append('circle')
    .attr('cx', x)
    .attr('cy', y)
    .attr('r', r)
    .style('fill', color);
}
