import Inferno from 'inferno';
import Component from 'inferno-component';
import {max as d3max, scaleLinear as d3scaleLinear, select as d3select} from 'd3';
import {FACEBOOK_BLUE, TWITTER_BLUE} from '../constants';

const SCALE_VALUE = 2;
const TWITTER_KEY = 'twitter';
const FACEBOOK_KEY = 'facebook';

class GroupInfosData extends Component {

  constructor(props) {

    super(props);

    this.elt = "";
    this.width = 0;
    this.height = 0;

    this.props = {
      sumTwitter : 0,
      sumFacebook : 0
    }
  }

  componentDidMount () {
    this.elt = d3select(document.getElementById('fn-group-sum'));
    this.width = this.elt.node().getBoundingClientRect().width;
    this.height = this.elt.node().getBoundingClientRect().height;
    this.displayData();
  }

  componentDidUpdate () {
    this.displayData();
  }

  displayData () {
    let data = [
      {name : TWITTER_KEY, sum : this.props.sumTwitter},
      {name : FACEBOOK_KEY, sum : this.props.sumFacebook}
    ];

    let max = d3max(data, d => d.sum);

    let scale = d3scaleLinear()
        .domain([0, max])
        .range([0, this.width / SCALE_VALUE]);

    let circles = this.elt.selectAll('circle')
        .data(data);

    circles.enter().append('circle')
        .attr('cx', this.width/2)
    .merge(circles)
        .attr('cy', d => this.height - scale(d.sum))
        .attr('r', d => scale(d.sum))
        .style('fill', d => d.name === TWITTER_KEY ? TWITTER_BLUE : FACEBOOK_BLUE);
  }

  render () {
    return <svg id="fn-group-sum"></svg>
  }
}

module.exports = GroupInfosData;
