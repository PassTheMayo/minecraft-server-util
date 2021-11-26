import assert from 'assert';
import { clean, format, parse, toHTML } from 'minecraft-motd-util';
import TCPClient from './structure/TCPClient';
import { JavaStatusOptions } from './types/JavaStatusOptions';

export interface JavaStatusResponse {
	version: {
		name: string,
		protocol: number
	},
	players: {
		online: number,
		max: number,
		sample: {
			name: string,
			id: string
		}[] | null
	},
	motd: {
		raw: string,
		clean: string,
		html: string
	},
	favicon: string | null
}

export async function status(host: string, port = 25565, options: Partial<JavaStatusOptions> = {}): Promise<JavaStatusResponse> {
	assert(typeof host === 'string', `Expected 'host' to be a 'string', got '${typeof host}'`);
	assert(host.length > 1, `Expected 'host' to have a length greater than 0, got ${host.length}`);
	assert(typeof port === 'number', `Expected 'port' to be a 'number', got '${typeof port}'`);
	assert(Number.isInteger(port), `Expected 'port' to be an integer, got '${port}'`);
	assert(port >= 0, `Expected 'port' to be greater than or equal to 0, got '${port}'`);
	assert(port <= 65535, `Expected 'port' to be less than or equal to 65535, got '${port}'`);
	assert(typeof options === 'object', `Expected 'options' to be an 'object', got '${typeof options}'`);

	const socket = new TCPClient();

	await socket.connect({ host, port, timeout: options?.timeout ?? 1000 * 5 });

	try {
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

		// Response packet
		// https://wiki.vg/Server_List_Ping#Response
		{
			await socket.readVarInt();

			const packetType = await socket.readVarInt();
			if (packetType !== 0x00) throw new Error('Expected server to send packet type 0x00, received ' + packetType);

			const response = JSON.parse(await socket.readStringVarInt());

			const motd = parse(response.description);

			await socket.close();

			return {
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
				favicon: response.favicon ?? null
			};
		}
	} finally {
		await socket.close();
	}
}