const net = require('net');
const dns = require('dns');
const Packet = require('./Structure/Packet');
const Response = require('./Structure/Response');

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

	if (typeof host !== 'string') throw new TypeError('Host must be a string');
	if (typeof port !== 'number') throw new TypeError('Port must be a number');
	if (typeof options !== 'object') throw new TypeError('Options must be an object');

	const resultPromise = new Promise(async (resolve, reject) => {
		if (options.enableSRV && isNaN(Number(host.split('.').pop())))
			({ host, port } = await new Promise((resolve, reject) => {
				dns.resolveSrv(`_minecraft._tcp.${host}`, (err, address) => {
					const addr = { host: host, port: port };
					if (!err && address && address[0]) {
						if (address[0].name)
							addr.host = address[0].name;
						if (address[0].port)
							addr.port = address[0].port;
					}
					resolve(addr);
				});
			}));

		let isResolved = false;

		const readingPacket = new Packet();

		const socket = net.createConnection({ host, port });

		socket.setTimeout(options.connectTimeout);

		socket.on('connect', async () => {
			try {
				const handshakePacket = new Packet();
				handshakePacket.writeVarInt(0x00); // Handshake packet ID
				handshakePacket.writeVarInt(options.protocolVersion); // Protocol version
				handshakePacket.writeString(host); // Host
				handshakePacket.writeUnsignedShort(port); // Port
				handshakePacket.writeVarInt(1); // Next state - status
				socket.write(handshakePacket.finish());

				const requestPacket = new Packet();
				requestPacket.writeVarInt(0x00); // Request packet ID
				socket.write(requestPacket.finish());
			} catch (e) {
				reject(e);
			}
		});

		socket.on('data', (data) => {
			readingPacket.writeByte(...data);

			let length;

			try {
				length = readingPacket.readVarInt();
			} catch (e) {
				return; // Data not long enough, we'll just wait
			}

			if (readingPacket.data.length < length) return;

			readingPacket.readVarIntSplice(); // Packet length

			if (readingPacket.readVarIntSplice() !== 0x00) return reject(new Error('Received a packet, but it was not a response'));

			readingPacket.readVarIntSplice(); // JSON length

			let parsed;

			try {
				parsed = JSON.parse(Buffer.from(readingPacket.data).toString("utf8"));
			} catch (e) {
				return reject(new Error('Invalid or corrupt payload data'));
			}

			try {
				let response = new Response(host, port, parsed);
				resolve(response);
			}
			catch(e) {
				return reject(new Error('Invalid or corrupt payload data'));
			}

			isResolved = true;

			socket.end();
		});

		socket.on('close', () => {
			if (isResolved) return;

			reject(new Error('Socket closed unexpectedly'));
		});

		socket.on('error', (error) => {
			if (isResolved) return;

			reject(error);
		});

		socket.on('timeout', () => {
			socket.end();
			socket.destroy();

			if (isResolved) return;

			reject(new Error('Socket did not connect in time'));
		});

		socket.on('end', () => {
			if (isResolved) return;

			reject(new Error('Socket closed unexpectedly'));
		});
	});

	if (callback) {
		resultPromise
			.then((...args) => callback(null, ...args))
			.catch((error) => callback(error, null));
	} else {
		return resultPromise;
	}
};

module.exports.Packet = Packet;
module.exports.Response = Response;
module.exports = ping;
