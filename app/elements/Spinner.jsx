import React from "react";
import styles from "./Spinner.css";



/**
 * A spinner for indicating busyness. Wraps the react-spinkit spinner.
 */
export default class Spinner extends React.Component {
	render() {
		var Spinkit = require('react-spinkit');
		var { preset } = this.props;
		console.log('props:', this.props);
		return <div className={styles.this} data-preset={preset}>
			<Spinkit spinnerName={preset}/> 
		</div>;
	}
}
Spinner.presets = {
	'wandering-cubes': {
		width: 16,
		height: 16		
	}
};
Spinner.defaultProps = {
	preset: 'wandering-cubes'
};
Spinner.propTypes = {
	preset: React.PropTypes.string
};