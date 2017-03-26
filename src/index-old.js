import {geoMercator as d3geoMercator, geoPath as d3geoPath, max as d3max, json as d3json, scaleLinear as d3scaleLinear, select as d3select} from 'd3';
// import {json as d3json} from 'd3';
// import {geoMercator as d3geoMercator, geoPath as d3geoPath} from 'd3-geo';
// import {max as d3max} from 'd3-array';
// import {scaleLinear as d3scaleLinear} from 'd3-scale';
// import {select as d3select} from 'd3-selection';


const FACEBOOK_BLUE = '#0066CC';
const TWITTER_BLUE = '#0099FF';
const SCALE_VALUE = 16;
const cityDotRadius = 4;



let geopath = d3geoPath();
let svgElt = null;
let svgWidth = null;
let svgHeight = null;
let projection = null;
let mapNode = null;
let dataNode = null;
// let viewboxWidth = null;
// let viewboxHeight = null;

let cities = {
  ajaccio : [8.738634999999931, 41.919229],
  albi : [2.148641, 43.925085],
  amiens : [2.295753, 49.894067],
  angers : [-0.563166, 47.478419],
  annecy : [6.129384, 45.899247],
  argenteuil : [2.246685, 48.94721],
  arras : [2.777535, 50.291002],
  aurillac : [2.444997, 44.930953],
  avignon : [4.805528, 43.949317],
  beauvais : [2.080712, 49.429539],
  blois : [1.335947, 47.586092],
  bobigny : [2.439712, 48.908612],
  bordeaux : [-0.57918, 44.837789],
  bourgenbresse : [5.225501, 46.205167],
  bourges : [2.398782, 47.081012],
  caen : [-0.370679, 49.182863],
  cahors : [1.441989, 44.447523],
  cambrai : [3.236633, 50.173538],
  castres : [2.241295, 43.606214],
  chalonsenchampagne : [4.363073, 48.956682],
  charlevilleemezieres : [4.726096, 49.762085],
  chartres : [1.489012, 48.443854],
  châteauroux : [1.686779, 46.811434],
  chaumont : [5.139256, 48.113748],
  clermontferrand : [3.087025, 45.777222],
  colmar : [7.358512, 48.079359],
  creteil : [2.455572, 48.790367],
  dijon : [5.04148, 47.322047],
  epernay : [3.956242, 49.043411],
  foix : [1.605232, 42.964127],
  gap : [6.079758, 44.559638],
  grenoble : [5.724524, 45.188529],
  gueret : [1.871452, 46.169599],
  guyancourt : [2.075323, 48.762895],
  heninbeaumont : [2.94728, 50.420087],
  larochelle : [-1.151139, 46.160329],
  larochesuryon : [-1.426442, 46.670511],
  laon : [3.61989, 49.564133],
  laval : [-73.712409, 45.606649],
  lemans : [0.199556, 48.00611],
  lepuyenvelay : [3.882936, 45.042768],
  lille : [3.057256, 50.62925],
  limoges : [1.261105, 45.833619],
  lonslesaunier : [5.550796, 46.671361],
  lyon : [4.835659, 45.764043],
  macon : [4.828731, 46.306884],
  marseille : [5.36978, 43.296482],
  melun : [2.6554, 48.542105],
  metz : [6.175716, 49.119309],
  montdemarsan : [-0.499782, 43.893485],
  montpellier : [3.876716, 43.610769],
  nanterre : [2.215331, 48.892423],
  nantes : [-1.553621, 47.218371],
  nice : [7.261953, 43.710173],
  nimes : [4.360054, 43.836699],
  orleans : [1.909251, 47.902964],
  paris : [2.352222, 48.856614],
  pau : [-0.370797, 43.2951],
  perigueux : [0.721115, 45.184029],
  perpignan : [2.894833, 42.688659],
  poitiers : [0.340375, 46.580224],
  rennes : [-1.677793, 48.117266],
  saintbrieuc : [-2.765835, 48.51418],
  saintetienne : [4.387178, 45.439695],
  sceaux : [2.295092, 48.778016],
  strasbourg : [7.752111, 48.573405],
  thaonlesvosges : [6.419186, 48.250554],
  toulon : [5.928, 43.124228],
  toulouse : [1.444209, 43.604652],
  tours : [0.68484, 47.394144],
  troyes : [4.074401, 48.297345],
  valence : [4.89236, 44.933393],
  vannes : [-2.760847, 47.658236],
  versailles : [2.120355, 48.804865],
  vesoul : [6.15428, 47.619788]
};

let data = [
  {
    name : 'Test 1',
    twitter : 1017,
    facebook : 674,
    city : 'lille'
  },
  // {
  //   name : 'Test 2',
  //   twitter : 178,
  //   facebook : 108,
  //   city : 'creteil'
  // },
  // {
  //   name : 'Test 2',
  //     twitter : 324,
  //   facebook : 118,
  //   city : 'toulouse'
  // },
];

getMap(() => {
  displayData();
});

function getMap (callback) {

  d3json("/build/data/departements2.json", function(geoJSON) {
      svgElt = d3select(document.getElementById('fn-map'));
      svgWidth = svgElt.node().getBoundingClientRect().width;
      svgHeight = svgElt.node().getBoundingClientRect().height;

      svgElt.style("width", svgWidth);
      svgElt.style("height", svgHeight);
      projection = d3geoMercator()
      .fitSize([svgWidth, svgHeight], geoJSON);
      geopath.projection(projection);

      mapNode = svgElt.append("g");
      dataNode = svgElt.append("g");

      mapNode.selectAll("path")
        .data(geoJSON.features)
          .enter()
        .append("path")
          .attr("d", geopath)
          .style("fill","#FFF")
          .style("stroke","#e6e6e6")
          .style("stroke-width","0.8pt")
          .style("stroke-linecap", "round")
          .style('stroke-linejoin', "round");

      callback();
  });

  // module.exports = d3.xml("/build/img/france.svg", (error, xml) => {
  //   if (error) throw error;
  //
  //   let htmlSvg = document.getElementById('map');
  //   htmlSvg.appendChild(xml.documentElement.getElementsByTagName('defs')[0]);
  //   htmlSvg.appendChild(xml.documentElement.getElementById('map'));
  //
  //   svgElt = d3.select(htmlSvg);
  //   mapNode = svgElt.select('#map');
  //   dataNode = svgElt.select('#data');
  //
  //   let viewbox = d3.select(xml.getElementsByTagName('svg')[0]).attr('viewBox');
  //   let viewboxArray = viewbox.split(" ");
  //   viewboxWidth = viewboxArray[2];
  //   viewboxHeight = viewboxArray[3];
  //   svgElt.attr('viewBox', viewbox);
  //
  //   if (callback) callback();
  // });
}

function displayData () {
  let max = d3max(data, (d) => d.facebook > d.twitter ? d.facebook : d.twitter);

  let scale = d3scaleLinear()
      .domain([0, max])
      .range([0, svgWidth / SCALE_VALUE]);

  dataNode.selectAll('circle')
      .data(data)
    .enter()
      .append('g').each(function (d, i) {
        let node = d3select(this);
        let scaledTwitter = scale(d.twitter);
        let scaledFacebook = scale(d.facebook);

        let xy = projection(cities[d.city]);
        let x = xy[0];
        let y = xy[1];

        appendBubble(node, x, y - scaledTwitter, scaledTwitter, TWITTER_BLUE);
        appendBubble(node, x, y - scaledFacebook, scaledFacebook, FACEBOOK_BLUE);
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
