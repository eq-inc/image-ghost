#!/usr/bin/env node

'use strict';

const fs = require('fs'),
    optmist = require('optimist'),
    imageGhost = require('../lib/index.js'),
    path = require('path');

const meta = require('../package.json');

const args = optmist
    .usage('Count the lines in a file.\nUsage: $0')
    .options({
        width : {
            alias : 'w',
            description : 'width for render image'
        },
        height : {
            alias : 'h',
            description : 'height for render image'
        },
        percent: {
            alias : 'r',
            description : 'Rendering at the referenced ratio'
        },
        format: {
            alias : 'f',
            description : 'format for render image. png or jpeg can be specified.'
        },
        version: {
            alias : 'v'
        }
    }).argv;

if(args.version) {
    console.log(meta.version);
    return false;
} else if(args.help) {
    optmist.showHelp();
    return false;
}

/**
 * Create Target directory
 *
 * @param pathName
 */
function createDirectorySync(pathName) {
    const info = path.parse(pathName),
        directory = info.dir.substring(info.root.length),
        list = directory.split(path.sep);

    list.push(path.basename(pathName));

    (function mkdir(current, list) {
        const currentPath = path.resolve(current, list.shift());

        try {
            fs.statSync(currentPath);
        } catch (err) {
            if ('ENOENT' === err.code) {
                fs.mkdirSync(currentPath);
            } else {
                console.error(err.message);
                process.exit(err.errno);
            }
        } finally {
            if (list.length) {
                mkdir(currentPath, list);
            }
        }
    })(info.root, list);
}

try {
    const src = path.resolve(args._[0]),
        dest = path.resolve(args._[1]);

    const properties = ['width', 'height', 'percent', 'format'];

    const optionParameter = Object.keys(args).reduce(function (collection, key) {
        const property = key.toLowerCase();
        if (-1 < properties.indexOf(property)) {
            collection[property] = args[key];
        }

        return collection;
    }, {});

    try {
        fs.statSync(fs.realpathSync(src));
    } catch(err) {
        console.error(err.message);
        process.exit(err.errno);
    }

    imageGhost.resize(src, optionParameter, function (err, buffer) {
        if (err) {
            console.log(err);
            process.exit(101);
        }

        // Get the path name before the folder name
        // To create directory, dest have to be processed
        // hoge/hoge/test.png → hoge/hoge
        createDirectorySync(path.dirname(dest));
        fs.writeFileSync(dest, buffer);
    });

} catch (err) {
    if ('ENOENT' === err.code) {
        console.error(err.message);
    }
}
