import Inferno, { linkEvent } from 'inferno';
import Component from 'inferno-component';
import {json as d3json} from 'd3';
import GroupInfos from './GroupInfos';
import GroupList from './GroupList';
import SocialBalls from './SocialBalls';
import Map from './Map';


class Main extends Component {

  constructor(props) {

		super(props);

    this.state = {
      name : "",
      sumTwitter : 0,
      sumFacebook : 0,
      subgroups : [],
      onDisplay : { facebook : true, twitter : true }
    };

    this.handleCheck = this.handleCheck.bind(this);
	}

  componentWillMount () {
    d3json("/build/data/data.json", (json) => {
      if (json) this.setState({
        name : json.name,
        sumTwitter : json.sumTwitter,
        sumFacebook : json.sumFacebook,
        subgroups : json.subgroups
      });
    });
  }

  handleCheck (onDisplay) {
    this.setState({onDisplay : onDisplay});
  }

	render () {
		return (
      <div id="fn-app">
        <h1 id="fn-title">
          Groupes jeunesse <br/>
          d’extrême-droite en France
        </h1>
        <h2 id="fn-subtitle">
          Abonnés Twitter et Facebook 2017 des antennes régionales
        </h2>
        <GroupInfos name={this.state.name} sumTwitter={this.state.sumTwitter} sumFacebook={this.state.sumFacebook} />
        <SocialBalls onDisplay={this.state.onDisplay} checkHandler={this.handleCheck} />
        <GroupList />
        <Map onDisplay={this.state.onDisplay} data={this.state.subgroups} />
      </div>
    );
	}

}

module.exports = Main;
