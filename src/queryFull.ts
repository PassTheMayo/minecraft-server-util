import assert from 'assert';
import { clean, format, parse, toHTML } from 'minecraft-motd-util';
import UDPClient from './structure/UDPClient';
import { QueryOptions } from './types/QueryOptions';
import { resolveSRV } from './util/srvRecord';

const validKeys: Buffer[] = [
	'gametype',
	'game_id',
	'version',
	'plugins',
	'map',
	'numplayers',
	'maxplayers',
	'hostport',
	'hostip'
].map(s => Buffer.from(s, 'utf-8'));

export interface FullQueryResponse {
	motd: {
		raw: string,
		clean: string,
		html: string
	},
	version: string,
	software: string,
	plugins: string[],
	map: string,
	players: {
		online: number,
		max: number,
		list: string[]
	},
	hostIP: string,
	hostPort: number
}

export function queryFull(host: string, port = 25565, options?: QueryOptions): Promise<FullQueryResponse> {
	host = host.trim();

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

			reject(new Error('Server is offline or unreachable'));
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

			// Full stat request packet
			// https://wiki.vg/Query#Request_3
			{
				socket.writeUInt16BE(0xFEFD);
				socket.writeByte(0x00);
				socket.writeInt32BE(sessionID);
				socket.writeInt32BE(challengeToken);
				socket.writeBytes(Uint8Array.from([0x00, 0x00, 0x00, 0x00]));
				await socket.flush(false);
			}

			// Full stat response packet
			// https://wiki.vg/Query#Response_3
			{
				const packetType = await socket.readByte();
				if (packetType !== 0x00) throw new Error('Expected server to send packet type 0x00, received ' + packetType);

				const serverSessionID = await socket.readInt32BE();
				if (sessionID !== serverSessionID) throw new Error('Server session ID mismatch, expected ' + sessionID + ', received ' + serverSessionID);

				await socket.readBytes(11);

				const data: Record<string, string> = {};
				const players: string[] = [];

				// eslint-disable-next-line no-constant-condition
				while (true) {
					const key = await socket.readStringNT();

					if (key.length < 1) break;

					let value;
					if(key === 'hostname') {
						value = await socket.readStringNTFollowedBy(validKeys);
					} else  {
						value = await socket.readStringNT();
					}

					data[key] = value;
				}

				await socket.readBytes(10);

				// eslint-disable-next-line no-constant-condition
				while (true) {
					const username = await socket.readStringNT();

					if (username.length < 1) break;

					players.push(username);
				}

				const motd = parse(data.hostname);
				const plugins = data.plugins.split(/(?::|;) */g);

				socket.close();

				clearTimeout(timeout);

				resolve({
					motd: {
						raw: format(motd),
						clean: clean(motd),
						html: toHTML(motd)
					},
					version: data.version,
					software: plugins[0],
					plugins: plugins.slice(1),
					map: data.map,
					players: {
						online: parseInt(data.numplayers),
						max: parseInt(data.maxplayers),
						list: players
					},
					hostIP: data.hostip,
					hostPort: parseInt(data.hostport)
				});
			}
		} catch (e) {
			clearTimeout(timeout);

			socket?.close();

			reject(e);
		}
	});
}