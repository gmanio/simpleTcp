/**
 * @description
 * @class
 * @name
 * @author gman.park
 * @version 0.0.1
 * @since June 18, 2015
 * @copyright Copyright (c) 2015, Gman.park
 */
var nts = nts || {};
/**
 * @description get Configuration
 */
var conf = require(process.cwd() + '/config/config');
/**
 * @description Nodejs Netmodule
 */
var net = require('net');

/**
 * oServer
 * @private
 */
nts._1999Lounge_ = function () {
	this.Initialize.apply(this, arguments);
};

nts._1999Lounge_.prototype = {
	aSocketPool: [],
	currentLightStatus: [0, 0],
	Initialize: function () {
		this.oServer = net.createServer();
		this.oServer.listen(conf["server"].port);
		this.attachedEvent();
	},

	attachedEvent: function () {
		this.oServer.on('connection', this._onServerConnect.bind(this));
	},

	_onServerConnect: function (oSocket) {
		this.aSocketPool.push(oSocket);
		oSocket.on('connection', this._sendSignalToClient)
		oSocket.on('close', function () {
			var index = this.aSocketPool.indexOf(oSocket);
			if (index > -1) {
				this.aSocketPool.splice(index, 1);
			}
		}.bind(this));
		oSocket.on('error', function (e) {
			console.log('error : ' + e);
		}.bind(this));
	},

	_modRequestBuffer: function () {
		var frontLightBuffer = new Buffer(conf["socket"].sElevatorRequestSignal);
		var backLightBuffer = new Buffer(conf["socket"].sDoorRequestSignal);
		setInterval(function () {
			this.request.write(frontLightBuffer);
			this.request.write(backLightBuffer);
		}.bind(this), conf["socket"].requestInterval);
	},

	_modRequestOnData: function (bSignals) {
		var signalDataIndex = bSignals.length - 1;
		if (bSignals.length == 11) {
			this.currentLightStatus[0] = bSignals[signalDataIndex];
		} else if (bSignals.length == 13) {
			this.currentLightStatus[1] = bSignals[signalDataIndex];
		}

		if (this.aSocketPool.length >= conf["server"].min_connection) {
			this._sendSignalToClient(this.currentLightStatus);
		}
	},

	_sendSignalToClient: function () {
			for (var index in this.aSocketPool) {
				this.aSocketPool[index].write(new Buffer([1]));
			}
	}
}

serverRun = new nts._1999Lounge_();