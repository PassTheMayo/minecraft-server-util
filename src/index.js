const net = require('net');
const Packet = require('./structure/Packet');
const Socket = require('./structure/Socket');
const getVarIntSize = require('./util/getVarIntSize');
const formatResult = require('./util/formatResult');
const resolveSRV = require('./util/resolveSRV');
const { assert } = require('console');

const ipAddressRegEx = /^\d{1,3}(\.\d{1,3}){3}$/;

const ping = (host, port = 25565, options, callback) => {
	if (typeof port === 'function') {
		callback = port;
		port = 25565;
		options = {};
	} else if (typeof options === 'function') {
		callback = options;
		options = {};
	}

	options = Object.assign({
		protocolVersion: 47,
		connectTimeout: 1000 * 5,
		enableSRV: true
	}, options);

	assert(typeof host === 'string', 'Expected string, got ' + (typeof host));
	assert(host.length > 0, 'Expected host.length > 0, got ' + host.length);
	assert(typeof port === 'number', 'Expected number, got ' + (typeof port));
	assert(Number.isInteger(port), 'Expected integer, got ' + port);
	assert(port > 0, 'Expected port > 0, got ' + port);
	assert(port < 65536, 'Expected port < 65536, got ' + port);
	assert(typeof options === 'object', 'Expected object, got ' + (typeof options));

	const resultPromise = new Promise(async (resolve, reject) => {
		let srvRecord = null;

		if (options.enableSRV && !ipAddressRegEx.test(host)) {
			srvRecord = await resolveSRV(host);
		}

		const socket = new Socket(srvRecord ? srvRecord.host : host, srvRecord ? srvRecord.port : port, 1000 * 15);

		await socket.waitUntilConnected();

		const handshakePacket = new Packet();
		handshakePacket.writeVarInt(0x00); // Handshake packet ID
		handshakePacket.writeVarInt(options.protocolVersion); // Protocol version
		handshakePacket.writeString(host); // Host
		handshakePacket.writeUnsignedShort(port); // Port
		handshakePacket.writeVarInt(1); // Next state - status
		socket.writeBytes(handshakePacket.finish());

		const requestPacket = new Packet();
		requestPacket.writeVarInt(0x00); // Request packet ID
		socket.writeBytes(requestPacket.finish());

		let result;

		while (true) {
			const packetLength = await socket.readVarInt();
			const packetType = await socket.readVarInt();

			if (packetType !== 0) {
				await socket.readBytes(packetLength - getVarIntSize(packetType));

				continue;
			}

			result = await socket.readString();

			break;
		}

		socket.destroy();

		let data;

		try {
			data = JSON.parse(result);
		} catch (e) {
			reject(new Error('Response from server is not valid JSON'));
		}

		resolve(formatResult(host, port, srvRecord, data));
	});

	if (callback) {
		resultPromise
			.then((...args) => callback(null, ...args))
			.catch((error) => callback(error, null));
	} else {
		return resultPromise;
	}
};

module.exports = ping;