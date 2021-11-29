import assert from 'assert';
import { clean, format, parse, toHTML } from 'minecraft-motd-util';
import UDPClient from './structure/UDPClient';
import { QueryOptions } from './types/QueryOptions';
import { resolveUDPSRV } from './util/srvRecord';

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

export async function queryFull(host: string, port = 25565, options?: QueryOptions): Promise<FullQueryResponse> {
	assert(typeof host === 'string', `Expected 'host' to be a 'string', got '${typeof host}'`);
	assert(host.length > 1, `Expected 'host' to have a length greater than 0, got ${host.length}`);
	assert(typeof port === 'number', `Expected 'port' to be a 'number', got '${typeof port}'`);
	assert(Number.isInteger(port), `Expected 'port' to be an integer, got '${port}'`);
	assert(port >= 0, `Expected 'port' to be greater than or equal to 0, got '${port}'`);
	assert(port <= 65535, `Expected 'port' to be less than or equal to 65535, got '${port}'`);
	assert(typeof options === 'object' || typeof options === 'undefined', `Expected 'options' to be an 'object' or 'undefined', got '${typeof options}'`);

	let srvRecord = null;

	if (typeof options === 'undefined' || typeof options.enableSRV === 'undefined' || options.enableSRV) {
		srvRecord = await resolveUDPSRV(host);

		if (srvRecord) {
			host = srvRecord.host;
			port = srvRecord.port;
		}
	}

	const sessionID = (options?.sessionID ?? 1) & 0x0F0F0F0F;

	const socket = new UDPClient(host, port);

	try {
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

				const value: string = await socket.readStringNT();

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

			return {
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
			};
		}
	} finally {
		socket.close();
	}
}