import Inferno from 'inferno';
import Component from 'inferno-component';
import {max as d3max, scaleLinear as d3scaleLinear, select as d3select} from 'd3';
import {cities, facebookBlue, twitterBlue} from '../constants';

const scaleValue = 4;

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
  }

  displayData () {
    let self = this;

    let max = this.sumTwitter > this.sumFacebook ? this.sumTwitter : this.sumFacebook;

    let scale = d3scaleLinear()
        .domain([0, max])
        .range([0, self.width / scaleValue]);

    self.elt.selectAll('circle')
        .data(self.props.data)
      .enter()
        .append('g').each(function (d, i) {
          let node = d3select(this);
          let scaledTwitter = scale(d.twitter);
          let scaledFacebook = scale(d.facebook);

          let xy = self.projection(cities[d.city]);
          let x = xy[0];
          let y = xy[1];

          self.appendBubble(node, x, y - scaledTwitter, scaledTwitter, twitterBlue);
          self.appendBubble(node, x, y - scaledFacebook, scaledFacebook, facebookBlue);
        });
  }

  appendBubble (node, x, y, r, color) {
    node.append('circle')
      .attr('cx', x)
      .attr('cy', y)
      .attr('r', r)
      .style('fill', color);
  }

  render () {
    return <svg id="fn-group-sum"></svg>
  }
}

module.exports = GroupInfosData;
