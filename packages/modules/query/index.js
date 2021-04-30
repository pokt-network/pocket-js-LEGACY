let node = false;
try {
    node = (Object.prototype.toString.call(global.process) === '[object process]');
}
catch (e) {
}

module.exports = node ? require('./dist/index.js') : require('./dist/web');