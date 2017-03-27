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
    this.parseData = this.parseData.bind(this);
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
    if (!self.projection || !self.props.data) return;

    let max = d3max(self.props.data, (d) => d.facebook > d.twitter ? d.facebook : d.twitter);

    self.dataNode.selectAll('g').remove();

    let scale = d3scaleLinear()
        .domain([0, max])
        .range([0, self.width / SCALE_VALUE]);

    let groups = self.dataNode.selectAll('g')
    .data(self.props.data, d => d.name).enter()
      .append('g').each(function (d, i) {
        let node = d3select(this);
        let scaledTwitter = scale(d.twitter);
        let scaledFacebook = scale(d.facebook);

        let xy = self.projection(cities[d.city]);
        let x = xy[0];
        let y = xy[1];

        self.appendBubble(node, x, y, CITY_DOT_RADIUS, '#000');
        self.appendBubble(node, x, y - scaledTwitter, scaledTwitter, TWITTER_BLUE);
        self.appendBubble(node, x, y - scaledFacebook, scaledFacebook, FACEBOOK_BLUE);
      });
  }

  parseData (data) {
    const pushSocialData = (array, type, color, value) => array.push({
      type : type,
      color : color,
      value : value
    });

    let max = 0;

    let groups = data.map((group) => {
      let socialData = [];

      if (group.twitter && this.props.onDisplay.twitter)
        pushSocialData(socialData, 'twitter', TWITTER_BLUE, group.twitter);

      if (group.facebook && this.props.onDisplay.facebook)
        pushSocialData(socialData, 'facebook', FACEBOOK_BLUE, group.facebook);

      socialData.sort(function(a, b) {
        return b.value - a.value;
      });

      let x = d3max(socialData, (d) => d.value);
      max = x > max ? x : max;

      return {
        name : group.name,
        city : group.city,
        socialData : socialData
      }
    });

    return {groups : groups, max : max};
  }



  appendBubble (node, x, y, r, color) {
    node.append('circle')
      .attr('cx', x)
      .attr('cy', y)
      .attr('r', r)
      .style('fill', color);
  }

  render () {
    return <svg id="fn-map"></svg>
  }
}

module.exports = Map;
