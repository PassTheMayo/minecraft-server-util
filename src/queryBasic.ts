import assert from 'assert';
import { clean, format, parse, toHTML } from 'minecraft-motd-util';
import UDPClient from './structure/UDPClient';
import { QueryOptions } from './types/QueryOptions';

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

export async function queryBasic(host: string, port = 25565, options: Partial<QueryOptions> = {}): Promise<BasicQueryResponse> {
	assert(typeof host === 'string', `Expected 'host' to be a 'string', got '${typeof host}'`);
	assert(host.length > 1, `Expected 'host' to have a length greater than 0, got ${host.length}`);
	assert(typeof port === 'number', `Expected 'port' to be a 'number', got '${typeof port}'`);
	assert(Number.isInteger(port), `Expected 'port' to be an integer, got '${port}'`);
	assert(port >= 0, `Expected 'port' to be greater than or equal to 0, got '${port}'`);
	assert(port <= 65535, `Expected 'port' to be less than or equal to 65535, got '${port}'`);
	assert(typeof options === 'object', `Expected 'options' to be an 'object', got '${typeof options}'`);

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

			return {
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
			};
		}
	} finally {
		socket.close();
	}
}