import assert from 'assert';
import { clean, format, parse, toHTML } from 'minecraft-motd-util';
import { TextEncoder } from 'util';
import TCPClient from './structure/TCPClient';
import { JavaStatusOptions } from './types/JavaStatusOptions';

export interface JavaStatusFE01FAResponse {
	protocolVersion: number,
	version: string,
	players: {
		online: number,
		max: number
	},
	motd: {
		raw: string,
		clean: string,
		html: string
	}
}

const encoder = new TextEncoder();

export async function statusFE01FA(host: string, port = 25565, options: Partial<JavaStatusOptions> = {}): Promise<JavaStatusFE01FAResponse> {
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
		// Client to server packet
		// https://wiki.vg/Server_List_Ping#Client_to_server
		{
			const hostBytes = encoder.encode(host);

			socket.writeBytes(Uint8Array.from([0xFE, 0x01, 0xFA]));
			socket.writeInt16BE(11);
			socket.writeStringBytes('MC|PingHost');
			socket.writeInt16BE(7 + hostBytes.byteLength);
			socket.writeByte(0x4A);
			socket.writeInt16BE(hostBytes.length);
			socket.writeBytes(hostBytes);
			socket.writeInt16BE(port);
			await socket.flush(false);
		}

		// Server to client packet
		// https://wiki.vg/Server_List_Ping#Server_to_client
		{
			const kickIdentifier = await socket.readByte();
			if (kickIdentifier !== 0xFF) throw new Error('Expected server to send 0xFF kick packet, got ' + kickIdentifier);

			const remainingLength = await socket.readInt16BE();
			const remainingData = await socket.readBytes(remainingLength * 2);

			const [protocolVersionString, version, motdString, onlinePlayersString, maxPlayersString] = remainingData.slice(6).swap16().toString('utf16le').split('\0');

			const motd = parse(motdString);

			return {
				protocolVersion: parseInt(protocolVersionString),
				version,
				players: {
					online: parseInt(onlinePlayersString),
					max: parseInt(maxPlayersString)
				},
				motd: {
					raw: format(motd),
					clean: clean(motd),
					html: toHTML(motd)
				}
			};
		}
	} finally {
		await socket.close();
	}
}