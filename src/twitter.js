import request from 'superagent';

import {TWITTER_KEY} from './constants';

const url = 'https://api.twitter.com/1.1/users/show.json?screen_name=twitterdev';

module.exports = (username) => {
  console.log(username);
  console.log(TWITTER_KEY);
};
