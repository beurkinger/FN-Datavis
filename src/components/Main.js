import Inferno, { linkEvent } from 'inferno';
import {FACEBOOK_KEY, TWITTER_KEY} from '../constants';
import Component from 'inferno-component';
import {json as d3json} from 'd3';
import GroupInfos from './GroupInfos';
import GroupList from './GroupList';
import SocialBalls from './SocialBalls';
import Map from './Map';
import Data from '../model/Data';


class Main extends Component {

  constructor(props) {

		super(props);

    let onDisplay = {};
    onDisplay[TWITTER_KEY] = true;
    onDisplay[FACEBOOK_KEY] = true;

    this.state = {
      name : "",
      data : new Data(),
      groupdId : 0,
      onDisplay : onDisplay
    };

    this.getGroup = this.getGroup.bind(this);
    this.handleCheck = this.handleCheck.bind(this);
	}

  componentWillMount () {
    d3json("/build/data/data.json", (json) => {
      if (json) {
        let data = new Data();
        data.parseData(json);
        this.setState({
        data : data
        // name : json.name,
        // sumTwitter : json.sumTwitter,
        // sumFacebook : json.sumFacebook,
        // subgroups : json.subgroups
        });
      }
    });
  }

  getGroup () {
    let groups = this.state.data.groups;
    let groupId = this.state.groupId;
    if (typeof groups[groupId] !== 'undefined' ) return groups[groupId];
    return {};
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
        <GroupInfos group={this.getGroup()} />
        <SocialBalls onDisplay={this.state.onDisplay} checkHandler={this.handleCheck} />
        <GroupList />
        <Map onDisplay={this.state.onDisplay} data={this.state.data} />
      </div>
    );
	}

}

module.exports = Main;
