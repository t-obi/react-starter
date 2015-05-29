import React from "react";
var {requestAnimationFrame} = window;

export default class CameraView extends React.Component {

	render() {
		var {camera, style} = this.props;
		Object.assign(style, {display: "block"});
		return <canvas ref="canvas" width={camera.width} height={camera.height} style={style}/>;
	}
	
	componentDidMount() {
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
