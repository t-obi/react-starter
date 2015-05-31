import React from "react";
var {requestAnimationFrame} = window;

export default class CameraView extends React.Component {

	render() {
		var {camera, style} = this.props;
		Object.assign(style, {display: "block"});
		console.log("camera.height in cameraview: " + camera.height);
		console.log("height in cameraview: " + this.props.height);

		return <canvas ref="canvas" width={camera.width} height={camera.height} style={style}/>;
	}
	
	componentDidMount() {
		console.log("canvas offset height: " + React.findDOMNode(this.refs.canvas).offsetHeight);
		var context = React.findDOMNode(this.refs.canvas).getContext("2d");
		this.draw(context);
	}

	componentWillUnmount() {
		this.isUnmounting = true;
	}

    draw(context) {
    	if (this.isUnmounting) {
    		return;
    	}
        context.putImageData(this.props.camera.getImage(), 0, 0);
    	requestAnimationFrame(() => { this.draw(context); });
    }



}
CameraView.propTypes = {
	camera: React.PropTypes.object.isRequired,
	style: React.PropTypes.object,
	width: React.PropTypes.number,
	height: React.PropTypes.number
};
