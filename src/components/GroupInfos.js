import Inferno from 'inferno';
import Component from 'inferno-component';
import {max as d3max, scaleLinear as d3scaleLinear, select as d3select} from 'd3';
import {cities, FACEBOOK_BLUE, TWITTER_BLUE} from '../constants';
import GroupInfosData from './GroupInfosData';

const defaultProps = {
  name : "",
  sumTwitter : 0,
  sumFacebook : 0
};

const GroupInfos = (props = defaultProps) => (
  <div id="fn-group-infos">
    <GroupInfosData sumTwitter={props.sumTwitter} sumFacebook={props.sumFacebook} />
    <h3 id="fn-group-name">{props.name}</h3>
  </div>
);

module.exports = GroupInfos;
