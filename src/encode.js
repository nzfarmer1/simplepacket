module.exports = XStreamEncode;

var enc = require('bindings')('enc');
var Transform = require('stream').Transform || require('readable-stream').Transform;
require('util').inherits(XStreamEncode, Transform);


function XStreamEncode() {
	if ( !(this instanceof XStreamEncode) )
		return new XStreamEncode();
	this._start =true;
	this._a=[];
	this._cb = undefined;
	Transform.call(this,{ "objectMode": true });
}


/**
 * Transforms a Buffer chunk of data to a Base64 string chunk.
 * @param {Buffer} chunk
 * @param {string} encoding - unused since chunk is always a Buffer
 * @param cb
 * @private
 */

XStreamEncode.prototype.flush = function(){

	var b = Buffer.concat(this._a);
	console.error("Processing: ");
	this.push(enc(b));
	

        this._start = true;
	this._a =[];
}

XStreamEncode.prototype._transform = function (chunk, encoding, cb) {
	this._a = this._a.concat(chunk);
	this._cb = cb;
	cb();
};


XStreamEncode.prototype._flush = function (cb) {

	this._cb = cb;
	this.flush();
	cb();
};



