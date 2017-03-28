import Inferno from 'inferno';
import {FACEBOOK_KEY, TWITTER_KEY} from '../constants';
import Checkbox from './Checkbox';

const SocialBalls = (props) => {

  const handleCheck = function (id) {
    let onDisplay = Object.assign({}, props.onDisplay);
    onDisplay[id] = !onDisplay[id];
    props.checkHandler(onDisplay);
  }

  return (
    <div id="fn-social-balls">
      <div className="social-ball">
        <img src="/build/img/facebook-ball.svg" />
        <Checkbox checked={props.onDisplay.facebook} clickHandler={handleCheck} id={FACEBOOK_KEY} />
      </div>
      <div className="social-ball">
        <img src="/build/img/twitter-ball.svg" />
        <Checkbox checked={props.onDisplay.twitter} clickHandler={handleCheck} id={TWITTER_KEY} />
      </div>
    </div>
  )
};

module.exports = SocialBalls;
