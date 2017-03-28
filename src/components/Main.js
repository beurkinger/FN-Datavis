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
      onDisplay : onDisplay
    };

    this.handleCheck = this.handleCheck.bind(this);
    this.handleListClick = this.handleListClick.bind(this);
	}

  componentWillMount () {
    d3json("/build/data/data.json", (json) => {
      if (json) {
        let data = new Data();
        data.parseData(json);
        this.setState({
        data : data,
        groupId : 0
        // name : json.name,
        // sumTwitter : json.sumTwitter,
        // sumFacebook : json.sumFacebook,
        // subgroups : json.subgroups
        });
      }
    });
  }

  handleCheck (onDisplay) {
    this.setState({onDisplay : onDisplay});
  }

  handleListClick (groupId) {
    console.log(groupId);
    this.setState({groupId : groupId});
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
        <GroupInfos group={this.state.data.getGroup(this.state.groupId)} />
        <SocialBalls onDisplay={this.state.onDisplay} checkHandler={this.handleCheck} />
        <GroupList list={this.state.data.getGroupsList()} groupId={this.state.groupId} clickHandler={this.handleListClick} />
        <Map onDisplay={this.state.onDisplay} data={this.state.data} groupId={this.state.groupId} />
      </div>
    );
	}

}

module.exports = Main;
