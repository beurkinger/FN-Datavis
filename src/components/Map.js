import Inferno, { linkEvent } from 'inferno';
import Component from 'inferno-component';
import {geoMercator as d3geoMercator, geoPath as d3geoPath, max as d3max, json as d3json, scaleLinear as d3scaleLinear, select as d3select} from 'd3';
// import {json as d3json} from 'd3';
// import {geoMercator as d3geoMercator, geoPath as d3geoPath} from 'd3-geo';
// import {max as d3max} from 'd3-array';
// import {scaleLinear as d3scaleLinear} from 'd3-scale';
// import {select as d3select} from 'd3-selection';
import {cities, FACEBOOK_BLUE, TWITTER_BLUE} from '../constants';

const SCALE_VALUE = 16;
const cityDotRadius = 2;

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
    this.twitterNode = null;
    this.facebookNode = null;
    this.cityNode = null;

    this.props = {data : []};

    this.displayData = this.displayData.bind(this);
  }

  componentDidMount () {
    this.elt = d3select(document.getElementById('fn-map'));
    this.width = this.elt.node().getBoundingClientRect().width;
    this.height = this.elt.node().getBoundingClientRect().height;
    this.mapNode = this.elt.append('g');
    this.dataNode = this.elt.append('g');
    this.twitterNode = this.dataNode.append('g');
    this.facebookNode = this.dataNode.append('g');
    this.cityNode = this.dataNode.append('g');

    this.getMap(() => {
      this.displayData();
    });
  }

  componentDidUpdate () {
    this.displayData();
  }

  getMap (callback) {
    d3json("/build/data/departements2.json", (geoJSON) => {
        this.projection = d3geoMercator()
        .fitSize([this.width, this.height], geoJSON);

        this.geopath.projection(this.projection);

        this.mapNode.selectAll("path")
          .data(geoJSON.features)
            .enter()
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

    if (!self.projection || !self.props.data) return;

    let max = d3max(self.props.data, (d) => d.facebook > d.twitter ? d.facebook : d.twitter);

    let scale = d3scaleLinear()
        .domain([0, max])
        .range([0, self.width / SCALE_VALUE]);

    let twitterCircles = self.twitterNode.selectAll('circle').data(self.props.data);
    twitterCircles.enter()
        .append('circle')
        .style('fill', TWITTER_BLUE)
      .merge(twitterCircles).each(function (d, i) {
          let xy = self.projection(cities[d.city]);
          let scaledValue = scale(d.twitter);
          d3select(this)
            .attr('cx', xy[0])
            .attr('cy', xy[1] - scaledValue)
            .attr('r', scaledValue);
      });

    let facebookCircles = self.facebookNode.selectAll('circle').data(self.props.data);
    facebookCircles.enter()
        .append('circle')
        .style('fill', FACEBOOK_BLUE)
      .merge(facebookCircles).each(function (d, i) {
          let xy = self.projection(cities[d.city]);
          let scaledValue = scale(d.facebook);
          d3select(this)
            .attr('cx', xy[0])
            .attr('cy', xy[1] - scaledValue)
            .attr('r', scaledValue);
      });

    let cityCircles = self.cityNode.selectAll('circle').data(self.props.data);
    cityCircles.enter()
        .append('circle')
        .style('fill', '#000')
        .attr('r', d => cityDotRadius)
      .merge(cityCircles).each(function (d, i) {
        let xy = self.projection(cities[d.city]);
        d3select(this)
          .attr('cx', xy[0])
          .attr('cy', xy[1]);
      });
  }

  render () {
    return <svg id="fn-map"></svg>
  }
}

module.exports = Map;
