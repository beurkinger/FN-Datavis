import {FACEBOOK_KEY, TWITTER_KEY} from '../constants';
import Division from '../model/Division';
import Group from '../model/Group';
import Network from '../model/Network';

class Data {

  constructor() {
    this.groups = [];
    this.divisions = [];
    this.networks = [];
    this.max = 0;
  }

  parseData (data) {
    data.forEach((group) => {
      let groupId = this.groups.length;
      let sumTwitter = 0;
      let sumFacebook = 0;
      group.divisions.forEach((division) => {
        let divisionId = this.divisions.length;
        sumFacebook += division.facebook;
        sumTwitter += division.twitter;
        this.networks.push(new Network(FACEBOOK_KEY, division.facebook, groupId, divisionId));
        this.networks.push(new Network(TWITTER_KEY, division.twitter, groupId, divisionId));
        this.divisions.push(new Division(division.name, division.city, groupId));
      });
      this.groups.push(new Group(group.name, sumFacebook, sumTwitter));
    });
    this.networks.sort((a, b) => b.value - a.value);
    this.max = this.networks[0].value;
  }
  
  getMax() {
    return this.max;
  }
}

module.exports = Data;
