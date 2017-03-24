import Inferno from 'inferno';

const SocialBalls = (props) => (
  <div id="fn-social-balls">
    <div className="social-ball">
      <img src="/build/img/facebook-ball.svg" />
      <input type="checkbox"/>
    </div>
    <div className="social-ball">
      <img src="/build/img/twitter-ball.svg" />
      <input type="checkbox"/>
    </div>
  </div>
);

module.exports = SocialBalls;
