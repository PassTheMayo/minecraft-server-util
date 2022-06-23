import assert from 'assert';
import { clean, format, parse, toHTML } from 'minecraft-motd-util';
import { TextDecoder } from 'util';
import TCPClient from './structure/TCPClient';
import { JavaStatusOptions } from './types/JavaStatusOptions';
import { JavaStatusLegacyResponse } from './types/JavaStatusLegacyResponse';
import { resolveSRV } from './util/srvRecord';

// Credit for this method is owed to fabianwennink <3
// https://github.com/fabianwennink/minecraft-server-util/blob/master/src/statusFE01All.ts

const decoder = new TextDecoder('utf-16be');

export function statusLegacy(host: string, port = 25565, options?: JavaStatusOptions): Promise<JavaStatusLegacyResponse> {
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

			// Client to server packet
			// https://wiki.vg/Server_List_Ping#Client_to_server
			{
				socket.writeBytes(Uint8Array.from([0xFE, 0x01]));
				await socket.flush(false);
			}

			let protocolVersion;
			let versionName;
			let rawMOTD;
			let onlinePlayers;
			let maxPlayers;

			// Server to client packet
			// https://wiki.vg/Server_List_Ping#Server_to_client
			{
				const packetType = await socket.readByte();
				if (packetType !== 0xFF) throw new Error('Packet returned from server was unexpected type');

				const length = await socket.readUInt16BE();
				const data = decoder.decode(await socket.readBytes(length * 2));

				if (data[0] === '\u00A7' || data[1] === '1') {
					// 1.4+ server
					const split = data.split('\0');

					protocolVersion = parseInt(split[1]);
					versionName = split[2];
					rawMOTD = split[3];
					onlinePlayers = parseInt(split[4]);
					maxPlayers = parseInt(split[5]);
				} else {
					// < 1.4 server
					const split = data.split('\u00A7');

					protocolVersion = null;
					versionName = null;
					rawMOTD = split[0];
					onlinePlayers = parseInt(split[1]);
					maxPlayers = parseInt(split[2]);
				}
			}

			socket.close();

			clearTimeout(timeout);

			const motd = parse(rawMOTD);

			resolve({
				version: versionName === null && protocolVersion === null ? null : {
					name: versionName,
					protocol: protocolVersion
				},
				players: {
					online: onlinePlayers,
					max: maxPlayers
				},
				motd: {
					raw: format(motd),
					clean: clean(motd),
					html: toHTML(motd)
				},
				srvRecord
			});
		} catch (e) {
			clearTimeout(timeout);

			socket?.close();

			reject(e);
		}
	});
}