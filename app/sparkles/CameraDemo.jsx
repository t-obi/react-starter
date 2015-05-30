import React from "react";
import CameraConnection from "./camera/CameraConnection";
import CameraView from "./camera/CameraView";
import CameraModes from "./camera/CameraModes";
import CameraModeSelect from "./camera/CameraModeSelect";
import styles from "./CameraDemo.css";
window.cameraModes = CameraModes;
export default class CameraDemo extends React.Component {



	constructor(props) {
		super(props);
		this.cameraConnection = null;
		this.state = {
			isConnected: false,
			error: null,
			displayedWidth: 320,
			cameraMode: CameraModes.getMode("label", "VGA"),
			autoReconnect: true
		};
	}

	startCamera() {
		if (this.state.isConnected) {
			this.stopCamera();
		}
		var {width, height} = this.state.cameraMode;
		this.cameraConnection = new CameraConnection(width, height);
		this.cameraConnection.start()
		.then(() => {
			var state = {};
			state.isConnected = true;
			state.error = null;
			this.setState(state);
			this.measureHeight();
		})
		.catch((error) => {
			this.setState({error});	
		});
	}
	
	stopCamera() {
		var {isConnected} = this.state;
		if (isConnected) {
			this.cameraConnection.stop();
		}
		this.setState({isConnected: false});
	}

	render() {
		var {
			error, 
			isConnected,
			cameraMode, 
			displayedWidth, 
			measuredHeight, 
			autoReconnect
		} = this.state;

		var handleMode = (event) => {
				this.setState({cameraMode: CameraModes.getMode(event.target.selectedIndex) });
				if (autoReconnect) {
					this.startCamera(); 
				}
			},
			toggleConnect = () => {
				if (isConnected) {
					this.stopCamera();
				} else{
					this.startCamera();
				}
			},
			handleWidth = (event) => {
				this.setState({displayedWidth: event.target.value});
			},
			handleAutoReconnect = (event) => {
				this.setState({autoReconnect: event.target.checked});
			};

		var cameraViewContainer;
		if (isConnected) {
			cameraViewContainer = (
				<div>
					<p>
						camera resolution: {this.cameraConnection.width} x {this.cameraConnection.height},
						displayed resolution: {displayedWidth} x {measuredHeight}
					</p>

					<div>
						<input type="range"
							value={displayedWidth}
							min="0"
							max="1280"
							style={{width: 1280}}
							onChange={handleWidth} />
					</div>

					<CameraView ref="cameraView"
						camera={this.cameraConnection}
						style={{width: displayedWidth}} />
				</div>
			);
		}

		return (
			<div className={styles.this}>
			<p>

				<button onClick={toggleConnect}>
					{isConnected ? "disconnect camera" : "connect camera"}
				</button>

				<CameraModeSelect selectedIndex={CameraModes.getIndex(cameraMode)}
					onChange={handleMode}/>

				<label>
					<input ref="autoReconnect"
						type="checkbox"
						checked={autoReconnect}
						onChange={handleAutoReconnect} />
					Auto-reconnect
				</label>

				<ErrorView error={error}/>
			</p>
			{cameraViewContainer}
		</div>
		);
	}

	componentDidUpdate(prevProps, prevState) {
		if (prevState.displayedWidth !== this.state.displayedWidth) {
			this.measureHeight();
		}
	}

	measureHeight() {
		var element = React.findDOMNode(this.refs.cameraView);
		this.setState({measuredHeight: element.offsetHeight});
	}
}

class ErrorView extends React.Component {

	render(){
		if (this.props.error) {
			return (
				<div className={styles.error}>
					<h3>{this.props.error.name}</h3>
					{this.props.error.message}
				</div>
				);
		} else{
			return null;
		}
	}
}
