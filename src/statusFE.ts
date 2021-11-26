import assert from 'assert';
import TCPClient from './structure/TCPClient';
import { JavaStatusOptions } from './types/JavaStatusOptions';

export interface JavaStatusFEResponse {
	players: {
		online: number,
		max: number
	},
	motd: string
}

export async function statusFE(host: string, port = 25565, options: Partial<JavaStatusOptions> = {}): Promise<JavaStatusFEResponse> {
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
		// Ping packet
		// https://wiki.vg/Server_List_Ping#Beta_1.8_to_1.3
		{
			socket.writeByte(0xFE);
			await socket.flush(false);
		}

		// Response packet
		// https://wiki.vg/Server_List_Ping#Beta_1.8_to_1.3
		{
			const packetID = await socket.readByte();
			if (packetID !== 0xFF) throw new Error('Expected server to send 0xFF kick packet, got ' + packetID);

			const packetLength = await socket.readInt16BE();
			const remainingData = await socket.readBytes(packetLength * 2);

			const [motd, onlinePlayersString, maxPlayersString] = remainingData.swap16().toString('utf16le').split('\u00A7');

			return {
				players: {
					online: parseInt(onlinePlayersString),
					max: parseInt(maxPlayersString)
				},
				motd
			};
		}
	} finally {
		await socket.close();
	}
}