import assert from 'assert';
import { clean, format, parse, toHTML } from 'minecraft-motd-util';
import TCPClient from './structure/TCPClient';
import { JavaStatusOptions } from './types/JavaStatusOptions';
import { JavaStatusFE01Response } from './types/JavaStatusFE01Response';
import { resolveTCPSRV } from './util/srvRecord';

export async function statusFE01(host: string, port = 25565, options?: JavaStatusOptions): Promise<JavaStatusFE01Response> {
	assert(typeof host === 'string', `Expected 'host' to be a 'string', got '${typeof host}'`);
	assert(host.length > 1, `Expected 'host' to have a length greater than 0, got ${host.length}`);
	assert(typeof port === 'number', `Expected 'port' to be a 'number', got '${typeof port}'`);
	assert(Number.isInteger(port), `Expected 'port' to be an integer, got '${port}'`);
	assert(port >= 0, `Expected 'port' to be greater than or equal to 0, got '${port}'`);
	assert(port <= 65535, `Expected 'port' to be less than or equal to 65535, got '${port}'`);
	assert(typeof options === 'object' || typeof options === 'undefined', `Expected 'options' to be an 'object' or 'undefined', got '${typeof options}'`);

	let srvRecord = null;

	if (typeof options === 'undefined' || typeof options.enableSRV === 'undefined' || options.enableSRV) {
		srvRecord = await resolveTCPSRV(host);

		if (srvRecord) {
			host = srvRecord.host;
			port = srvRecord.port;
		}
	}

	const socket = new TCPClient();

	await socket.connect({ host, port, timeout: options?.timeout ?? 1000 * 5 });

	try {
		// Ping packet
		// https://wiki.vg/Server_List_Ping#1.4_to_1.5
		{
			socket.writeBytes(Uint8Array.from([0xFE, 0x01]));
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
				},
				srvRecord
			};
		}
	} finally {
		await socket.close();
	}
}