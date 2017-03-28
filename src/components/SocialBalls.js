import Inferno from 'inferno';
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
        <Checkbox checked={props.onDisplay.facebook} clickHandler={handleCheck} id={'facebook'} />
      </div>
      <div className="social-ball">
        <img src="/build/img/twitter-ball.svg" />
        <Checkbox checked={props.onDisplay.twitter} clickHandler={handleCheck} id={'twitter'} />
      </div>
    </div>
  )
};

module.exports = SocialBalls;
