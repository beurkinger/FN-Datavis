import Inferno from 'inferno';

const GroupList = (props) => {
  const getLi = function(group) {
    return (
      <li className={group.id === props.groupId ? 'selected' : ''}
          onClick={e => props.clickHandler(group.id)} >
        {group.name}
      </li>
    )
  }
  return (
  <ul id="fn-group-list">
    {props.list.map(getLi)}
  </ul>
  )
};

module.exports = GroupList;
