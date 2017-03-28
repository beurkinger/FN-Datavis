import Inferno, { linkEvent } from 'inferno';
import Component from 'inferno-component';
import {geoMercator as d3geoMercator, geoPath as d3geoPath, max as d3max, json as d3json, scaleLinear as d3scaleLinear, select as d3select} from 'd3';
// import {json as d3json} from 'd3';
// import {geoMercator as d3geoMercator, geoPath as d3geoPath} from 'd3-geo';
// import {max as d3max} from 'd3-array';
// import {scaleLinear as d3scaleLinear} from 'd3-scale';
// import {select as d3select} from 'd3-selection';
import {cities, FACEBOOK_BLUE, TWITTER_BLUE, FACEBOOK_KEY, TWITTER_KEY} from '../constants';

const SCALE_VALUE = 16;
const CITY_DOT_RADIUS = 2;

class Map extends Component {

  constructor(props) {

		super(props);

    this.geopath = d3geoPath();
    this.elt = null;
    this.width = null;
    this.height = null;
    this.projection = null;
    this.mapNode = null;
    this.dataNode = null;

    this.props = {
      data : [],
      onDisplay : {facebook : true, twitter : true}
    };

    this.displayData = this.displayData.bind(this);
    // this.parseData = this.parseData.bind(this);
  }

  componentDidMount () {
    this.elt = d3select(document.getElementById('fn-map'));
    this.width = this.elt.node().getBoundingClientRect().width;
    this.height = this.elt.node().getBoundingClientRect().height;
    this.mapNode = this.elt.append('g');
    this.dataNode = this.elt.append('g');

    this.getMap(() => {
      this.displayData();
    });
  }

  componentDidUpdate () {
    this.displayData();
  }

  getMap (callback) {
    d3json("/build/data/departements2.json", (geoJSON) => {
        this.projection = d3geoMercator().fitSize([this.width, this.height], geoJSON);

        this.geopath.projection(this.projection);

        this.mapNode.selectAll("path").data(geoJSON.features).enter()
          .append("path")
            .attr("d", this.geopath)
            .style("fill","#FFF")
            .style("stroke","#e6e6e6")
            .style("stroke-width","0.8pt")
            .style("stroke-linecap", "round")
            .style('stroke-linejoin', "round");

        if (callback) callback();
    });
  }

  displayData () {
    let self = this;
    if (!self.projection || !self.props.data.networks) return;
    let data = self.props.data;
    console.log(self.props.data);
    // self.dataNode.selectAll('g').remove();
    //
    let scale = d3scaleLinear()
        .domain([0, data.getMax()])
        .range([0, self.width / SCALE_VALUE]);

    let circles = self.dataNode.selectAll('circles').data(data.networks);
    circles.enter()
        .append('circle')
      .merge(circles).each(function (d, i) {
        let division = data.divisions[d.divisionId];
        let city = cities[division.city];
        let xy = self.projection(city);
        let r = scale(d.value);
        let color = d.type === FACEBOOK_KEY ? FACEBOOK_BLUE : TWITTER_BLUE;
        d3select(this)
          .attr('cx', xy[0])
          .attr('cy', xy[1] - r)
          .attr('r', r)
          .style('fill', color);
      });
    circles.exit().remove();

    // .each(function(d, i) {
    //   let groupNode = d3select(this);
    //   let xy = self.projection(cities[d.cit  y]);
    //
    // let groups = self.dataNode.selectAll('g')
    // .data(data.groups, d => d.name).enter()
    //   .append('g').attr('id', d => d.name)
    // .each(function(d, i) {
    //   let groupNode = d3select(this);
    //   let xy = self.projection(cities[d.city]);
    //
    //   groupNode.append('circle')
    //     .attr('cx', xy[0])
    //     .attr('cy', xy[1])
    //     .attr('r', CITY_DOT_RADIUS)
    //     .style('fill', '#000');
    //
    //   groupNode.selectAll('circle')
    //   .data(d => d.socialData, e => e.type).enter()
    //   .append('circle')
    //     .attr('cx', xy[0])
    //     .attr('cy', e => xy[1] - scale(e.value))
    //     .attr('r', e => scale(e.value))
    //     .style('fill', e => e.color);
    // });
    //
    // groups.exit().remove();
  }




  // appendBubble (node, x, y, r, color) {
  //   node.append('circle')
  //     .attr('cx', x)
  //     .attr('cy', y)
  //     .attr('r', r)
  //     .style('fill', color);
  // }

  render () {
    return <svg id="fn-map"></svg>
  }
}

module.exports = Map;
