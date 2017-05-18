'use strict';

const fs = require('fs'),
    imageGhost = require('../lib/index.js'),
    expect = require('expect.js'),
    chai = require('chai').expect,
    path = require('path'),
    gm = require('gm');

describe('api', function () {
    const srcPath = fs.realpathSync('./test/imgs/dummy.png');

    describe('Should be Buffer', function () {
        it('Should return buffer as callback', function (done) {
            const width = 100;

            imageGhost.resize(srcPath, { width: width }, function (err, resizeBuffer) {
                gm(srcPath).resize(width, '%').toBuffer('PNG',function (err, geBuffer) {
                    chai(resizeBuffer).to.deep.equal(geBuffer);
                    done();
                });
            });
        });

        it('Should return buffer as promise', function (done) {
            const width = 100;

            imageGhost.resize(srcPath, { width: width }).then(function (resizeBuffer) {
                gm(srcPath).resize(width, '%').toBuffer('PNG',function (err, geBuffer) {
                    chai(resizeBuffer).to.deep.equal(geBuffer);
                    done();
                });
            });
        });
    });

    describe('Should Size', function () {
        it('Should width size', function (done) {
            const width = 50;

            imageGhost.resize(srcPath, { width: width }).then(function (buffer) {
                gm(buffer).size(function(err, size) {
                    expect(width).to.be(size.width);
                    done();
                });
            });
        });

        it('Should height size', function (done) {
            const height = 50;

            imageGhost.resize(srcPath, { height: height }).then(function (buffer) {
                gm(buffer).size(function(err, size) {
                    expect(height).to.be(size.height);
                    done();
                });
            });
        });

        it('Should width and height size', function (done) {
            const width = 28,
                height = 50;

            imageGhost.resize(srcPath, {
                width: width,
                height: height
            }).then(function (buffer) {
                gm(buffer).size(function(err, size) {
                    expect(width).to.be(size.width);
                    expect(height).to.be(size.height);
                    done();
                });
            });
        });

        it('Should percent size', function (done) {
            const percent = 80;

            imageGhost.resize(srcPath, { percent: percent }).then(function (buffer) {
                gm(buffer).size(function(err, size) {
                    expect(percent).to.be(size.width);
                    expect(percent).to.be(size.height);
                    done();
                });
            });
        });

        it('Should image size should be 1 pixel after resizing', function (done) {
            const size = 1;

            imageGhost.resize(srcPath, { percent: size }).then(function (buffer) {
                gm(buffer).size(function(err, bufferSize) {
                    expect(size).to.be(bufferSize.width);
                    expect(size).to.be(bufferSize.height);
                    done();
                });
            });
        });
    });

    describe('Should check options', function () {
        it('Should format', function (done) {
            imageGhost.resize(srcPath, {
                format: 'jpg',
                percent: 100
            }).then(function (buffer) {
                gm(buffer).format(function (err, result) {
                    if (err) {
                        return done(err);
                    }

                    done();
                });
            });
        });
    });

    describe('Should be error', function () {
        it('Should return error if option includes width and height and percent', function (done) {
            imageGhost.resize(srcPath, {
                width: 50,
                height: 50,
                percent: 50
            }).catch(function (err) {
                expect(err.message).to.be('Property error because data should has width or percent');
                done();
            });
        });

        it('Should error that should not exist src path', function (done) {
            imageGhost.resize(path.resolve(`./test/imgs/notExist.png`), { width: 50 }).catch(function (err) {
                expect(err.message).to.be('Stream yields empty buffer');
                done();
            });
        });

        it('Should below 1 is error width', function (done) {
            imageGhost.resize(srcPath, { width: 0.5 }).catch(function (err) {
                expect(err.message).to.be('Property error because width or height is 1 more');
                done();
            });
        });

        it('Should below 1 is error height', function (done) {
            imageGhost.resize(srcPath, { height: 0.5 }).catch(function (err) {
                expect(err.message).to.be('Property error because width or height is 1 more');
                done();
            });
        });
    });
});
