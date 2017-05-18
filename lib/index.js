'use strict';

const gm = require('gm'),
    fs = require('fs');

function resize(image, options, callback) {
    return Promise.resolve().then(function () {
        if((options.width < 1) || (options.height < 1)) {
            return Promise.reject(new Error('width/height cannot be less than 1'));
        }

        if((options.width || options.height) && options.percent) {
            return Promise.reject(new Error('width/height or percent is required'));
        }

        if(options.percent) {
            return Promise.resolve(gm(image).resize(`${options.percent}%`));
        }

        return Promise.resolve(gm(image).resize(
            (options.width) ? options.width : null,
            (options.height) ? options.height : null,
            (options.width && options.height) ? '!' : null
        ));
    }).then(function (image) {
        return new Promise(function (resolve, reject) {
            image.toBuffer(options.format, function (error, result) {
                return (error) ? reject(error) : resolve(result);
            });
        });
    }).then(function (result) {
        return (callback) ? callback(null, result) : Promise.resolve(result);
    }).catch(function (error) {
        return (callback) ? callback(error) : Promise.reject(error);
    });
}

module.exports.resize = resize;
