import Inferno, { linkEvent } from 'inferno';
import Component from 'inferno-component';
import {easeLinear as d3easeLinear, geoMercator as d3geoMercator, geoPath as d3geoPath, max as d3max, json as d3json, scaleLinear as d3scaleLinear, select as d3select, transition as d3transition} from 'd3';
import {BUBBLES_TRANSITION_DELAY, CITIES, FACEBOOK_BLUE, TWITTER_BLUE, FACEBOOK_KEY, TWITTER_KEY} from '../constants';

const SCALE_VALUE = 16;
const CITY_DOT_RADIUS = 2;
const CITY_DOT_COLOR = '#000';
const BUBBLES_DEFAULT_OPACITY = 0.6;

class Map extends Component {

  constructor(props) {

		super(props);

    this.refDiv = null;
    this.refSvg = null;
    this.geopath = d3geoPath();
    this.divElt = null;
    this.svgElt = null;
    this.width = null;
    this.height = null;
    this.projection = null;
    this.scale = null;
    this.mapNode = null;
    this.bubblesNode = null;
    this.detailsNode = null;

    this.props = {
      data : [],
      groupId : 0,
      onDisplay : {facebook : true, twitter : true}
    };

    this.displayData = this.displayData.bind(this);
    // this.parseData = this.parseData.bind(this);
  }

  componentDidMount () {
    this.divElt = d3select(this.refDiv);
    this.svgElt = d3select(this.refSvg);
    this.width = this.svgElt.node().getBoundingClientRect().width;
    this.height = this.svgElt.node().getBoundingClientRect().height;
    this.mapNode = this.svgElt.append('g');
    this.bubblesNode = this.svgElt.append('g');
    this.detailsNode = this.svgElt.append('g');

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
    if (!self.projection || !self.props.data.isFull()) return;

    let divisions = self.props.data.getGroup(self.props.groupId).divisions;

    this.scale = d3scaleLinear()
        .domain([0, self.props.data.getMax()])
        .range([0, self.width / SCALE_VALUE]);

    const transition = d3transition()
      .duration(BUBBLES_TRANSITION_DELAY)
      .ease(d3easeLinear);

    self.bubblesNode.selectAll('g').remove();

    let g = self.bubblesNode.selectAll('g').data(divisions);
    g.enter().append('g')
    .attr('id', d => d.name)
    .style('opacity', BUBBLES_DEFAULT_OPACITY)
    .on("mouseover", function(d) {
      self.onMouseOver(d3select(this), d);
    })
    .on("mouseout", function(d) {
      self.onMouseOut(d3select(this));
    })
    .each(function(d, i) {
      let groupNode = d3select(this);
      let networks = self.filterNetworks(d.networks);
      let xy = self.projection(CITIES[d.city]);

      self.appendCityDot(groupNode, xy);
      self.appendNetworkCircles(groupNode, xy, networks);
    })
  }

  filterNetworks(networksData) {
    if (!this.props.onDisplay[FACEBOOK_KEY]) {
      networksData = networksData.filter((n) => n.type !== FACEBOOK_KEY);
    }
    if (!this.props.onDisplay[TWITTER_KEY]) {
      networksData = networksData.filter((n) => n.type !== TWITTER_KEY);
    }
    return networksData;
  }

  appendCityDot(node, xy) {
    node.append('circle')
      .attr('cx', xy[0])
      .attr('cy', xy[1])
      .attr('r', CITY_DOT_RADIUS)
      .style('fill', CITY_DOT_COLOR);
  }

  appendNetworkCircles (node, xy, data) {
    let circles = node.selectAll('circle').data(data, d => d.type);

    circles.enter()
    .append('circle')
      .attr('cx', xy[0])
      .attr('cy', xy[1])
      .style('fill', d => d.type === FACEBOOK_KEY ? FACEBOOK_BLUE : TWITTER_BLUE)
      .transition()
      .attr('cy', d => xy[1] - this.scale(d.value))
      .attr('r', d => this.scale(d.value));
  }

  onMouseOver (group, divisionData) {
    let svgGroupWidth = group.node().getBBox().width;
    group.style('opacity', 1);
    // let xy = this.projection(CITIES[divisionData.city]);
    // this.appendDetailsText(this.detailsNode, xy, divisionData.name);
    // let networks = this.filterNetworks(divisionData.networks);
    this.showTooltip(divisionData, svgGroupWidth);
  }

  onMouseOut (group) {
    group.style('opacity', BUBBLES_DEFAULT_OPACITY);
    this.hideDetails();
  }

  appendDetailsText(node, xy, divisionName) {
    node.append('text')
      .text(divisionName)
      .attr('x', xy[0])
      .attr('y', xy[1] + 18)
      .attr('text-anchor', 'middle')
      .attr("font-family", "Helvetica, sans-serif")
      .attr("font-size", "14px")
      .attr("fill", "#000");
  }

  showTooltip (divisionData, svgGroupWidth) {
    let xy = this.projection(CITIES[divisionData.city]);
    let networks = this.filterNetworks(divisionData.networks);
    let box = this.divElt.append('div')
      .attr('id', 'fn-map-tooltip');
    box.append('div')
      .attr('class', 'name')
      .text(divisionData.name);
    box.selectAll('.network').data(networks).enter()
    .append('div')
      .attr('class', 'network')
      .each(function(d, i) {
        let networkDiv = d3select(this);
        let img = d.type === FACEBOOK_KEY ? 'facebook-ball-white.svg' : 'twitter-ball-white.svg';
        networkDiv.append('img')
          .attr('src', 'build/img/' + img);
        networkDiv.append('span')
          .text(d.value)
          .style('color', d.type === FACEBOOK_KEY ? FACEBOOK_BLUE : TWITTER_BLUE);
      });
    let boxWidth = box.node().getBoundingClientRect().width;
    box.style('left', xy[0] - boxWidth / 2 + 'px')
    .style('top', xy[1] + 10 + 'px');




  }

  hideDetails () {
    // this.detailsNode.selectAll('text').remove();
    this.divElt.selectAll('#fn-map-tooltip').remove();
  }

  render () {
    return (
      <div id="fn-map-container" ref={e => this.refDiv = e}>
        <svg id="fn-map" ref={e => this.refSvg = e}></svg>
      </div>
    )
  }
}

module.exports = Map;
