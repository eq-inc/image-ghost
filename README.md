
# image-ghost
image-ghost is a tool that you can easily resize images. It has compatibility to jpeg, png, etc.
image-ghost can be executed from command or api. Also, if you have a json, you can resize multiple image in bulk.

## Getting started
First download and install [GraphicsMagick](http://www.graphicsmagick.org/). In Mac OS X, you can simply use [Homebrew](http://mxcl.github.io/homebrew/) and do:

```js
brew install graphicsmagick
```

## CLI
### Install

    yarn global add @eq-inc/image-ghost
    
### Usage
#### Resize image
```js
imageghost-resize -w 290 ./readPath/imgs/dummy.png ./exportPath/image.png
```

#### Available Options
`-w` or `--width` Width for render image.

`-h` or `--height` Height for render image.

`-p` or `--percent` Rendering at the referenced ratio.

`-f` or `--format` Format for render image. png or jpeg can be specified.

`-v` or `--version` Show version.

`-h` or `--help` Show help.

#### Batch resize
```js
imageghost-task ./readPath/task.json
```

#### Sample of json
if you want to run as multiple, you need to have json like the following.

```javascript
[
    { 
        "src": "test/imgs/test.png", // src path is target. 
        "dest": "test/imgs/export/test.png", 
        "percent": 50 // in this case, image will be create with 50 percent.
    },
    {
        "src": "test/imgs", // if src is directory, images will be create each to dest path. 
        "dest": "test/imgs/export", // This image is created according to this path. 
        "width": 50 // Either width or height is necessary. 
    },
    {
        "src": "test/imgs/test.png", 
        "dest": "test/imgs/export", // images will be create in this directory. 
        "height": 150,
        "extension": "png", // you can specify png, jpeg, etc.
        "filename": "{{ basename  }}{{height}}.{{ extension}}" // filename is image name after resizing and basename is src image name. 
    },
    {
        "src": "test/imgs", 
        "dest": "test/imgs/export", 
        "percent": 85,
        "extension": "jpg", // you can specify png, jpeg, etc.
        "filename": "{{ basename  }}{{percent}}.{{ extension}}" 
    }
 ]
```

#### Available Variables
`{{dirname}}` Directory path before resizing. it means target dest property full path.

`{{filename}}` Image name including extension before resizing.

`{{basename}}` Image name not including extension before resizing.

`{{extension}}` Extension is before resize image extension.

`{{width}}` Width. if there is no designation, It is converted to empty string.

`{{height}}` Height. if there is no designation, It is converted to empty string.

`{{percent}}` Percent. if there is no designation, It is converted to empty string.

## API
### Install
    yarn add image-ghost

#### Usage
```javascript
image_ghost.resize(path[, option][, callback])
```

`path` \<string> | \<Buffer> Filepath or File Buffer.

`option` \<Object>
* width \<Number> Width for render image.
* height \<Number> Height for render image.
* percent \<Number> Rendering at the referenced ratio.

you can specify width/height or percent.

`callback` \<Function> you can give callback function promise or not promise. if you do running function, image buffer will be returned.

#### Example
```js
const fs = require('fs'),
    image_ghost = require('@eq-inc/image-ghost'),
    image = fs.readFileSync('./image.jpg'),
    options = {
        width: 640
    };
 
// Promise
image_ghost.resize(image, options).then(function (result) {
    fs.writeFileSync('./resized.jpg', result);
});
 
// Callback
image_ghost.resize(image, options, function (error, result) {
    if (error) {
        console.log(error);
        process.exit(1);
    }
 
    fs.writeFileSync('./resized.jpg', result);
});
```
