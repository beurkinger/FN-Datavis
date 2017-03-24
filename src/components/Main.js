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
      subgroups : []
    };
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

	render () {
		return (
      <div id="fn-app">
        <h1 id="fn-title">
          Partis jeunesse <br/>
          d’extrême droite
        </h1>
        <h2 id="fn-subtitle">
          Abonnés Twitter et Facebook 2017 des antennes régionales
        </h2>
        <GroupInfos name={this.state.name} sumTwitter={this.state.sumTwitter} sumFacebook={this.state.sumFacebook} />
        <SocialBalls />
        <GroupList />
        <Map data={this.state.subgroups} />
      </div>
    );
	}

}

module.exports = Main;
