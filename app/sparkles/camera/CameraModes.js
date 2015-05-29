var modes = [
    {
        "label": "4K",
        "width": 3840,
        "height": 2160,
        "ratio": "16:9"
    },
    {
        "label": "1080p",
        "width": 1920,
        "height": 1080,
        "ratio": "16:9"
    }, {
        "label": "UXGA",
        "width": 1600,
        "height": 1200,
        "ratio": "4:3"
    }, {
        "label": "720p",
        "width": 1280,
        "height": 720,
        "ratio": "16:9"
    }, {
        "label": "SVGA",
        "width": 800,
        "height": 600,
        "ratio": "4:3"
    }, {
        "label": "VGA",
        "width": 640,
        "height": 480,
        "ratio": "4:3"
    }, {
        "label": "CIF",
        "width": 352,
        "height": 288,
        "ratio": "4:3"
    }, {
        "label": "QVGA",
        "width": 320,
        "height": 240,
        "ratio": "4:3"
    }, {
        "label": "QCIF",
        "width": 176,
        "height": 144,
        "ratio": "4:3"
    }, {
        "label": "QQVGA",
        "width": 160,
        "height": 120,
        "ratio": "4:3"
    }

];
export default class CameraModes {
    static getModes() {
        return modes;
    }
    static getMode(key, value) {
        let index = isNaN(key) ? CameraModes.getIndex(key, value) : key;
        return modes[index];
    }
    static getIndex(key, value) {
        if (typeof key === "string") {
            for (let mode of modes) {
                if (mode[key] === value) {
                    return modes.indexOf(mode);
                }
            }
        }
        return modes.indexOf(key);
    }
}
