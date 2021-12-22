import assert from 'assert';
import { clean, format, parse, toHTML } from 'minecraft-motd-util';
import UDPClient from './structure/UDPClient';
import { QueryOptions } from './types/QueryOptions';
import { resolveSRV } from './util/srvRecord';

export interface BasicQueryResponse {
	motd: {
		raw: string,
		clean: string,
		html: string
	},
	gameType: string,
	map: string,
	players: {
		online: number,
		max: number
	},
	hostPort: number,
	hostIP: string
}

export function queryBasic(host: string, port = 25565, options?: QueryOptions): Promise<BasicQueryResponse> {
	assert(typeof host === 'string', `Expected 'host' to be a 'string', got '${typeof host}'`);
	assert(host.length > 1, `Expected 'host' to have a length greater than 0, got ${host.length}`);
	assert(typeof port === 'number', `Expected 'port' to be a 'number', got '${typeof port}'`);
	assert(Number.isInteger(port), `Expected 'port' to be an integer, got '${port}'`);
	assert(port >= 0, `Expected 'port' to be greater than or equal to 0, got '${port}'`);
	assert(port <= 65535, `Expected 'port' to be less than or equal to 65535, got '${port}'`);
	assert(typeof options === 'object' || typeof options === 'undefined', `Expected 'options' to be an 'object' or 'undefined', got '${typeof options}'`);

	if (typeof options === 'object') {
		assert(typeof options.enableSRV === 'boolean' || typeof options.enableSRV === 'undefined', `Expected 'options.enableSRV' to be a 'boolean' or 'undefined', got '${typeof options.enableSRV}'`);
		assert(typeof options.sessionID === 'number' || typeof options.sessionID === 'undefined', `Expected 'options.sessionID' to be a 'number' or 'undefined', got '${typeof options.sessionID}'`);
		assert(typeof options.timeout === 'number' || typeof options.timeout === 'undefined', `Expected 'options.timeout' to be a 'number' or 'undefined', got '${typeof options.timeout}'`);

		if (typeof options.timeout === 'number') {
			assert(Number.isInteger(options.timeout), `Expected 'options.timeout' to be an integer, got '${options.timeout}'`);
			assert(options.timeout >= 0, `Expected 'options.timeout' to be greater than or equal to 0, got '${options.timeout}'`);
		}
	}

	const sessionID = (options?.sessionID ?? 1) & 0x0F0F0F0F;

	return new Promise(async (resolve, reject) => {
		const socket = new UDPClient(host, port);

		const timeout = setTimeout(() => {
			socket?.close();

			reject(new Error('Timed out while querying server for status'));
		}, options?.timeout ?? 1000 * 5);

		try {
			let srvRecord = null;

			if (typeof options === 'undefined' || typeof options.enableSRV === 'undefined' || options.enableSRV) {
				srvRecord = await resolveSRV(host, 'udp');

				if (srvRecord) {
					host = srvRecord.host;
					port = srvRecord.port;
				}
			}

			// Request packet
			// https://wiki.vg/Query#Request
			{
				socket.writeUInt16BE(0xFEFD);
				socket.writeByte(0x09);
				socket.writeInt32BE(sessionID);
				await socket.flush(false);
			}

			let challengeToken;

			// Response packet
			// https://wiki.vg/Query#Response
			{
				const packetType = await socket.readByte();
				if (packetType !== 0x09) throw new Error('Expected server to send packet type 0x09, received ' + packetType);

				const serverSessionID = await socket.readInt32BE();
				if (sessionID !== serverSessionID) throw new Error('Server session ID mismatch, expected ' + sessionID + ', received ' + serverSessionID);

				challengeToken = parseInt(await socket.readStringNT());
				if (isNaN(challengeToken)) throw new Error('Server sent an invalid challenge token');
			}

			// Basic stat request packet
			// https://wiki.vg/Query#Request_2
			{
				socket.writeUInt16BE(0xFEFD);
				socket.writeByte(0x00);
				socket.writeInt32BE(sessionID);
				socket.writeInt32BE(challengeToken);
				await socket.flush(false);
			}

			// Basic stat response packet
			// https://wiki.vg/Query#Response_2
			{
				const packetType = await socket.readByte();
				if (packetType !== 0x00) throw new Error('Expected server to send packet type 0x00, received ' + packetType);

				const serverSessionID = await socket.readInt32BE();
				if (sessionID !== serverSessionID) throw new Error('Server session ID mismatch, expected ' + sessionID + ', received ' + serverSessionID);

				const motdString = await socket.readStringNT();
				const gameType = await socket.readStringNT();
				const map = await socket.readStringNT();
				const onlinePlayers = await socket.readStringNT();
				const maxPlayers = await socket.readStringNT();
				const hostPort = await socket.readInt16LE();
				const hostIP = await socket.readStringNT();

				const motd = parse(motdString);

				socket.close();

				clearTimeout(timeout);

				resolve({
					motd: {
						raw: format(motd),
						clean: clean(motd),
						html: toHTML(motd)
					},
					gameType,
					map,
					players: {
						online: parseInt(onlinePlayers),
						max: parseInt(maxPlayers)
					},
					hostPort,
					hostIP
				});
			}
		} catch (e) {
			clearTimeout(timeout);

			socket?.close();

			reject(e);
		}
	});
}