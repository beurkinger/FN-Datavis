import Inferno from 'inferno';

const Checkbox = (props) => <input type="checkbox" checked={props.checked} onClick={e => props.clickHandler(props.id)} />

module.exports = Checkbox;
