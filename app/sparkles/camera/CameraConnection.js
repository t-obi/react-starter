var Promise = window.Promise;

/**
 * Webcam adapter. Call start, wait to resolve, ask for image using getImageData()
 * 
 * Interesting: https://webrtchacks.github.io/WebRTC-Camera-Resolution/
 *
 * @author Jovica.Aleksic <jovica.aleksic@xailabs.de>
 */

export default class CameraConnection {

    constructor(width = 320, height = 180) {
        this.applyShims(window);
        this.width = width;
        this.height = height;
    }

    //----------------------------------------------------------------------------
    //
    // public interface
    //
    //----------------------------------------------------------------------------

    /**
     * Connects to the camera.
     * @param constraints {Object} @see #this.getDefaultConstraints()
     * @returns {Promise} will be resolved with {MediaStream} or rejected with {Error}
     */
    start(constraints) {
        var {width, height} = this;
        constraints = constraints || this.getConstraints();
        return new Promise((resolve, reject) => {
            navigator.getUserMedia(constraints, (stream) => {
                this.stream = stream;
                this.canvas = this.createElement("canvas", width, height);
                this.video = this.createElement("video", width, height);
                this.playVideoStream(this.video, this.stream);
                resolve(stream);
            }, (error) => {
                reject(error);
            });
        });
    }


    /**
     * Disconnects from the camera
     */
    stop() {
        this.video.pause();
        this.video.src = null;
        this.stream.stop();
        
        this.stream = null;
        this.video = null;
        this.canvas = null;
    }


    /**
     * Draws the camera image and returns the image data.
     * TODO: Get rid of try/catch, detect readyness
     * @return {ImageData}
     */
    getImage() {
        var context = this.canvas.getContext("2d");
        try {
            // The video may not be ready, yet. 
            context.drawImage(this.video, 0, 0, this.width, this.height);
        } catch (e) {
            return null;
        }

        return context.getImageData(0, 0, this.width, this.height);
    }


    //----------------------------------------------------------------------------
    //
    // internals
    //
    //----------------------------------------------------------------------------

    /**
     * @see http://w3c.github.io/mediacapture-main/getusermedia.html#idl-def-MediaTrackConstraints
     * @see https://webrtchacks.com/how-to-figure-out-webrtc-camera-resolutions/
     */
    getConstraints() {
        return {
            audio: false,
            video: {
                mandatory: {
                    minWidth: this.width,
                    minHeight: this.height,
                    maxWidth: this.width,
                    maxHeight: this.height
                }
            }
        };
    }

    createElement(type, width, height) {
        var element = document.createElement(type);
        element.width = width;
        element.height = height;
        return element;
    }

    playVideoStream(video, stream) {
        if (video.mozSrcObject !== undefined) {
            video.mozSrcObject = stream;
        } else {
            video.src = window.URL.createObjectURL(stream);
        }
        video.play();
    }

    applyShims(win) {
        require("./adapter.js");
        // https://timtaubert.de/demos/shared/shim.js
        win.requestAnimationFrame = win.requestAnimationFrame ||
            win.msRequestAnimationFrame ||
            win.mozRequestAnimationFrame ||
            win.webkitRequestAnimationFrame ||
            ((callback) => { window.setTimeout(callback, 1000 / 60); });

        win.URL = win.URL || win.webkitURL || {};
        win.URL.createObjectURL = win.URL.createObjectURL || function(obj) {
            return obj;
        };
    }

}
