import assert from 'assert';
import crypto from 'crypto';
import { clean, format, parse, toHTML } from 'minecraft-motd-util';
import TCPClient from './structure/TCPClient';
import { JavaStatusOptions } from './types/JavaStatusOptions';
import { JavaStatusResponse } from './types/JavaStatusResponse';
import { resolveSRV } from './util/srvRecord';

export function status(host: string, port = 25565, options?: JavaStatusOptions): Promise<JavaStatusResponse> {
	assert(typeof host === 'string', `Expected 'host' to be a 'string', got '${typeof host}'`);
	assert(host.length > 1, `Expected 'host' to have a length greater than 0, got ${host.length}`);
	assert(typeof port === 'number', `Expected 'port' to be a 'number', got '${typeof port}'`);
	assert(Number.isInteger(port), `Expected 'port' to be an integer, got '${port}'`);
	assert(port >= 0, `Expected 'port' to be greater than or equal to 0, got '${port}'`);
	assert(port <= 65535, `Expected 'port' to be less than or equal to 65535, got '${port}'`);
	assert(typeof options === 'object' || typeof options === 'undefined', `Expected 'options' to be an 'object' or 'undefined', got '${typeof options}'`);

	if (typeof options === 'object') {
		assert(typeof options.enableSRV === 'boolean' || typeof options.enableSRV === 'undefined', `Expected 'options.enableSRV' to be a 'boolean' or 'undefined', got '${typeof options.enableSRV}'`);
		assert(typeof options.timeout === 'number' || typeof options.timeout === 'undefined', `Expected 'options.timeout' to be a 'number' or 'undefined', got '${typeof options.timeout}'`);

		if (typeof options.timeout === 'number') {
			assert(Number.isInteger(options.timeout), `Expected 'options.timeout' to be an integer, got '${options.timeout}'`);
			assert(options.timeout >= 0, `Expected 'options.timeout' to be greater than or equal to 0, got '${options.timeout}'`);
		}
	}

	return new Promise(async (resolve, reject) => {
		const socket = new TCPClient();

		const timeout = setTimeout(() => {
			socket?.close();

			reject(new Error('Timed out while retrieving server status'));
		}, options?.timeout ?? 1000 * 5);

		try {
			let srvRecord = null;

			if (typeof options === 'undefined' || typeof options.enableSRV === 'undefined' || options.enableSRV) {
				srvRecord = await resolveSRV(host);

				if (srvRecord) {
					host = srvRecord.host;
					port = srvRecord.port;
				}
			}

			await socket.connect({ host, port, timeout: options?.timeout ?? 1000 * 5 });

			// Handshake packet
			// https://wiki.vg/Server_List_Ping#Handshake
			{
				socket.writeVarInt(0x00);
				socket.writeVarInt(47);
				socket.writeStringVarInt(host);
				socket.writeUInt16BE(port);
				socket.writeVarInt(1);
				await socket.flush();
			}

			// Request packet
			// https://wiki.vg/Server_List_Ping#Request
			{
				socket.writeVarInt(0x00);
				await socket.flush();
			}

			let response;

			// Response packet
			// https://wiki.vg/Server_List_Ping#Response
			{
				const packetLength = await socket.readVarInt();
				await socket.ensureBufferedData(packetLength);

				const packetType = await socket.readVarInt();
				if (packetType !== 0x00) throw new Error('Expected server to send packet type 0x00, received ' + packetType);

				response = JSON.parse(await socket.readStringVarInt());
			}

			const payload = crypto.randomBytes(8).readBigInt64BE();

			// Ping packet
			// https://wiki.vg/Server_List_Ping#Ping
			{
				socket.writeVarInt(0x01);
				socket.writeInt64BE(payload);
				await socket.flush();
			}

			const pingStart = Date.now();

			// Pong packet
			// https://wiki.vg/Server_List_Ping#Pong
			{
				const packetLength = await socket.readVarInt();
				await socket.ensureBufferedData(packetLength);

				const packetType = await socket.readVarInt();
				if (packetType !== 0x01) throw new Error('Expected server to send packet type 0x01, received ' + packetType);

				const receivedPayload = await socket.readInt64BE();
				if (receivedPayload !== payload) throw new Error('Ping payload did not match received payload');
			}

			const motd = parse(response.description);

			clearTimeout(timeout);

			socket.close();

			resolve({
				version: {
					name: response.version.name,
					protocol: response.version.protocol
				},
				players: {
					online: response.players.online,
					max: response.players.max,
					sample: response.players.sample ?? null
				},
				motd: {
					raw: format(motd),
					clean: clean(motd),
					html: toHTML(motd)
				},
				favicon: response.favicon ?? null,
				srvRecord,
				roundTripLatency: Date.now() - pingStart
			});
		} catch (e) {
			clearTimeout(timeout);

			socket?.close();

			reject(e);
		}
	});
}