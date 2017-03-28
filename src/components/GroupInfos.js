import Inferno from 'inferno';
import Component from 'inferno-component';
import {max as d3max, scaleLinear as d3scaleLinear, select as d3select} from 'd3';
import {cities, FACEBOOK_BLUE, TWITTER_BLUE} from '../constants';
import GroupInfosData from './GroupInfosData';

const GroupInfos = (props) => {
  return (
  <div id="fn-group-infos">
    <GroupInfosData sumTwitter={props.group.sumTwitter} sumFacebook={props.group.sumFacebook} />
    <h3 id="fn-group-name">{props.group.name}</h3>
  </div>
)};

module.exports = GroupInfos;
