import * as d3 from 'd3';

const darkBlue = '#0066CC';
const lightBlue = '#0099FF';

let svgElt = null;
let mapNode = null;
let dataNode = null;

let data = [
  {
    name : 'Test 1',
    twitter : '1017',
    facebook : '674',
    coord : [100, 75]
  },
  {
    name : 'Test 2',
    twitter : '178',
    facebook : '108',
    coord : [250, 300]
  },
  {
    name : 'Test 2',
    twitter : '324',
    facebook : '118',
    coord : [250, 300]
  },
];

module.exports = d3.xml("/build/img/france.svg", function(error, xml) {
  if (error) throw error;

  let htmlSvg = document.getElementById('map');
  htmlSvg.appendChild(xml.documentElement.getElementsByTagName('defs')[0]);
  htmlSvg.appendChild(xml.documentElement.getElementById('map'));

  // d3 objects for later use
  let svgElt = d3.select(htmlSvg);
  let mapNode = svgElt.select('#map');
  let dataNode = svgElt.select('#data');


  // get the svg-element from the original SVG file
  let xmlSVG = d3.select(xml.getElementsByTagName('svg')[0]);
  svgElt.attr('viewBox', xmlSVG.attr('viewBox'));

  console.log(svgElt);
  console.log(mapNode);
  console.log(dataNode);
  let gs = dataNode.selectAll('circle')
    .data(data).enter().append('g');

  gs.append('circle')
    .attr('cx', (d) => d.coord[0])
    .attr('cy', (d) => d.coord[1] - 50)
    .attr('r', 50)
    .style("fill", lightBlue);

  gs.append('circle')
    .attr('cx', (d) => d.coord[0])
    .attr('cy', (d) => d.coord[1] - 25)
    .attr('r', 25)
    .style("fill", darkBlue);

  gs.append('circle')
    .attr('cx', (d) => d.coord[0])
    .attr('cy', (d) => d.coord[1])
    .attr('r', 3.3)
    .style("fill", "#000");


});
