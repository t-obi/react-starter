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
		this.state = {
			cameraConnection: null,
			error: null,
			displayedWidth: 320,
			cameraMode: CameraModes.getMode("label", "VGA"),
			autoReconnect: true
		};
	}

	startCamera() {
		if (this.state.cameraConnection) {
			this.stopCamera();
		}
		var {width, height} = this.state.cameraMode;
		var cameraConnection = new CameraConnection(width, height);
		cameraConnection.start()
		.then(() => {
			var state = {cameraConnection};
			state.error = null;
			this.setState(state);
			this.measureHeight();
		})
		.catch((error) => {
			this.setState({error});	
		});
	}
	
	stopCamera() {
		var {cameraConnection} = this.state;
		if (cameraConnection) {
			cameraConnection.stop();
		}
		this.setState({cameraConnection: null});
	}

	render() {
		var {
			error, 
			cameraConnection, 
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
			handleDisconnect = () => {
				this.stopCamera(); 
			},
			handleConnect = () => {
				this.startCamera(); 
			},
			handleWidth = (event) => {
				this.setState({displayedWidth: event.target.value});
			},
			handleAutoReconnect = (event) => {
				this.setState({autoReconnect: event.target.checked});
			};

		return <div className={styles.this}>
			<p>
				{!cameraConnection && 
					<button onClick={handleConnect}>connect camera</button>}
				
				{cameraConnection && 
					<button onClick={handleDisconnect}>disconnect camera</button>}

				<CameraModeSelect selectedIndex={CameraModes.getIndex(cameraMode)} onChange={handleMode}/>
				
				<label>
					<input ref="autoReconnect" type="checkbox" checked={autoReconnect} onChange={handleAutoReconnect} /> 
					Auto-reconnect
				</label>

				{cameraConnection && 
					<p>
						camera resolution: {cameraConnection.width} x {cameraConnection.height}, 
						displayed resolution: {displayedWidth} x {measuredHeight}
					</p>}
				
				{cameraConnection && 
					<div>
						<input type="range" value={displayedWidth} min="0" max="1280" style={{width: 1280}} onChange={handleWidth} />
					</div>}
				
				{error && 
					<div className={styles.error}>
						<h3>{error.name}</h3>
						{error.message}
					</div>}
			</p>
			{cameraConnection && 
				<CameraView ref="cameraView" camera={cameraConnection} style={{width: displayedWidth}} />}
		</div>;
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
