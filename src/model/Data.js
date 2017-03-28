import {FACEBOOK_KEY, TWITTER_KEY} from '../constants';
import Division from '../model/Division';
import Group from '../model/Group';
import Network from '../model/Network';

class Data {

  constructor() {
    this.groups = [];
    this.max = 0;
    this.full = false;
  }

  parseData (data) {
    let max = 0;
    data.forEach((group) => {
      let divisions = [];
      let sumTwitter = 0;
      let sumFacebook = 0;
      group.divisions.forEach((division) => {
        let networks = [];
        sumFacebook += division.facebook;
        sumTwitter += division.twitter;
        networks.push(new Network(FACEBOOK_KEY, division.facebook));
        networks.push(new Network(TWITTER_KEY, division.twitter));
        networks.sort((a, b) => b.value - a.value);
        let x = division.facebook > division.twitter ? division.facebook : division.twitter;
        max = x > max ? x : max;
        divisions.push(new Division(division.name, division.city, networks));
      });
      this.groups.push(new Group(group.name, sumFacebook, sumTwitter, divisions));
      this.max = max;
    });
    this.full = true;
  }

  getGroup (id) {
    let groups = this.groups;
    if (typeof groups[id] !== 'undefined' ) return groups[id];
    return {};
  }

  getGroupsList () {
    return this.groups.map((group, i) => {
      return { id : i, name : group.name }
    })
  }

  getMax() {
    return this.max;
  }

  isFull() {
    return this.full;
  }
}

module.exports = Data;
