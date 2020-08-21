const net = require('net');
const assert = require('assert');
const Packet = require('./structure/Packet');
const Socket = require('./structure/Socket');
const getVarIntSize = require('./util/getVarIntSize');
const formatResult = require('./util/formatResult');
const resolveSRV = require('./util/resolveSRV');

const ipAddressRegEx = /^\d{1,3}(\.\d{1,3}){3}$/;

const ping = (host, port = 25565, options, callback) => {
	if (typeof port === 'function') { // ping('host', (error) => {})
		callback = port;
		port = 25565;
		options = {};
	} else if (typeof port === 'object') { // ping('host', { protocolVersion: 47 }, (error) => {})
		callback = options;
		options = port;
		port = 25565;
	}

	if (typeof options === 'function') {
		callback = options;
		options = {};
	}

	// Apply the provided options on the default options
	options = Object.assign({
		protocolVersion: 47,
		connectTimeout: 1000 * 5,
		enableSRV: true
	}, options);

	// Validate all arguments to ensure they are the correct type
	assert(typeof host === 'string', 'Expected string, got ' + (typeof host));
	assert(host.length > 0, 'Expected host.length > 0, got ' + host.length);
	assert(typeof port === 'number', 'Expected number, got ' + (typeof port));
	assert(Number.isInteger(port), 'Expected integer, got ' + port);
	assert(port > 0, 'Expected port > 0, got ' + port);
	assert(port < 65536, 'Expected port < 65536, got ' + port);
	assert(typeof options === 'object', 'Expected object, got ' + (typeof options));

	const resultPromise = new Promise(async (resolve, reject) => {
		try {
			let srvRecord = null;

			// Automatically resolve from host (e.g. play.hypixel.net) into a connect-able address
			if (options.enableSRV && !ipAddressRegEx.test(host)) {
				srvRecord = await resolveSRV(host);
			}

			// Create a new TCP connection to the specified address
			const socket = new Socket(srvRecord ? srvRecord.host : host, srvRecord ? srvRecord.port : port, 1000 * 15);

			// Wait until the connection is established
			await socket.waitUntilConnected();

			// Create a new Handshake packet and sent it to the server
			const handshakePacket = new Packet();
			handshakePacket.writeVarInt(0x00); // Handshake packet ID
			handshakePacket.writeVarInt(options.protocolVersion); // Protocol version
			handshakePacket.writeString(host); // Host
			handshakePacket.writeUnsignedShort(port); // Port
			handshakePacket.writeVarInt(1); // Next state - status
			socket.writeBytes(handshakePacket.finish());

			// Create a new Request packet and send it to the server
			const requestPacket = new Packet();
			requestPacket.writeVarInt(0x00); // Request packet ID
			socket.writeBytes(requestPacket.finish());

			let result;

			// Loop over each packet returned and wait until it receives a Response packet
			while (true) {
				const packetLength = await socket.readVarInt();
				const packetType = await socket.readVarInt();

				if (packetType !== 0) {
					// Packet was unexpected type, ignore the rest of the data in this packet
					const readSize = packetLength - getVarIntSize(packetType);

					if (readSize > 0) await socket.readBytes();

					continue;
				}

				// Packet was expected type, read the contents of the packet for the ping data
				result = await socket.readString();

				break;
			}

			// Destroy the socket, it is no longer needed
			socket.destroy();

			let data;

			try {
				data = JSON.parse(result);
			} catch (e) {
				reject(new Error('Response from server is not valid JSON'));
			}

			// Convert the data from raw Minecraft ping payload format into a more human readable format and resolve the promise
			resolve(formatResult(host, port, srvRecord, data));
		} catch (e) {
			reject(e);
		}
	});

	// Use the callback if provided, otherwise return the promise
	if (callback) {
		resultPromise
			.then((...args) => callback(null, ...args))
			.catch((error) => callback(error, null));
	} else {
		return resultPromise;
	}
};

module.exports = ping;