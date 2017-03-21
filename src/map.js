import * as d3 from 'd3';
// import request from 'superagent';


console.log(d3);

module.exports = d3.xml("/build/img/france.svg", function(error, xml) {
  if (error) throw error;
  console.log('coucou');

  // // "xml" is the XML DOM tree
  // var htmlSVG = document.getElementById('map');  // the svg-element in our HTML file
  // // append the "maproot" group to the svg-element in our HTML file
  // htmlSVG.appendChild(xml.documentElement.getElementById('maproot'));
  //
  // // d3 objects for later use
  // svg = d3.select(htmlSVG);
  // maproot = svg.select('#maproot');
  //
  // // get the svg-element from the original SVG file
  // var xmlSVG = d3.select(xml.getElementsByTagName('svg')[0]);
  // // copy its "viewBox" attribute to the svg element in our HTML file
  // svg.attr('viewBox', xmlSVG.attr('viewBox'));
});
