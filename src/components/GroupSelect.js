import Inferno from 'inferno';
import Component from 'inferno-component';

class GroupSelect extends Component {

  constructor(props) {
		super(props);

    this.open = false;
    this.elt = null;

    this.props = {
      list : [],
      groupId : -1,
      clickHandler : null
    }

    this.getLi = this.getLi.bind(this);
    this.select = this.select.bind(this);
    this.switchUl = this.switchUl.bind(this);
  }

  getSelected () {
    if (typeof this.props.list[this.props.groupId] !== 'undefined') {
      return <span onClick={this.switchUl}>{this.props.list[this.props.groupId].name}</span>;
    }
  }

  getLi (group) {
    if (group.id !== this.props.groupId) return (
      <li onClick={e => this.select(group.id)} >
        {group.name}
      </li>
    )
  }

  switchUl () {
    this.open = !this.open;
    this.elt.className = this.open ? 'open' : '';
  }

  select (groupId) {
    this.switchUl();
    this.props.clickHandler(groupId);
  }

  render() {
    return (
      <div id="fn-group-select" ref={e => { this.elt = e }}>
        {this.getSelected()}
        <ul>
          {this.props.list.map(this.getLi)}
        </ul>
      </div>
    )
  }

}

module.exports = GroupSelect;
