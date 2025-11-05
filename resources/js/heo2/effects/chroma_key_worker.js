/*
 * HeO2 - Proprietary RAD Web Framework
 * Copyright © 2014-2019, Heliox - All Right Reserved
 */

(function() {
    onmessage = (message) => {
        let data = message.data.imageData.data;
        let tolerance = message.data.tolerance;
        let colorKey = message.data.colorKey;
        let diff, diffR, diffG, diffB, red, green, blue;

        for (let i = 0, length = data.length; i < length; i += 4) {
            diff = Math.abs(data[i] - colorKey.r) + Math.abs(data[i + 1] - colorKey.g) + Math.abs(data[i + 2] - colorKey.b);
            red = data[i];
            green = data[i + 1];
            blue = data[i + 2];
            diffR = Math.abs(red - colorKey.r);
            diffG = Math.abs(green - colorKey.g);
            diffB = Math.abs(blue - colorKey.b);

            if (diffR < tolerance.r && diffG < tolerance.g && diffB < tolerance.b) {
                data[i + 3] = (diff * diff) / tolerance;
            } else if (green - 25 > blue && green - 25 > red) {
                data[i + 1] = green - diffG;
                data[i + 3] = green;
            }
        }

        postMessage(message.data.imageData);
    };
}());
