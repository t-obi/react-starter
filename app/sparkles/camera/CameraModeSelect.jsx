import React from "react";
import CameraModes from "./CameraModes";


export default class CameraModeSelect extends React.Component {
	render() {
		var {selectedIndex, onChange} = this.props;
		return <select onChange={onChange} defaultValue={selectedIndex}>
			{CameraModes.getModes().map((mode, idx) => <option key={idx} value={idx}>{mode.label} ({mode.width} x {mode.height})</option>)}
		</select>;
	}
}
CameraModeSelect.propTypes = {
	selectedIndex: React.PropTypes.number,
	onChange: React.PropTypes.func
};
CameraModeSelect.defaultProps = {
	selectedIndex: 0,
	onChange: () => {}
};
